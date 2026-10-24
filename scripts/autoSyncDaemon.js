import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadSyncCursor, saveSyncCursor, updateSyncStatus, loadCurrentSnapshot } from './lib/snapshotManager.js';
import { recordIncomingEvent, markEventStatus, getPendingEventsFromJournal } from './lib/eventJournal.js';
import { applyIncrementalSync } from './lib/incrementalSync.js';
import { detectRemoteChanges, fetchModifiedTableData } from './lib/changeDetector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PORT = parseInt(process.env.SYNC_PORT || '5174', 10);
const POLL_INTERVAL = parseInt(process.env.SYNC_POLL_INTERVAL || '2000', 10); // 2000ms target

let isRunning = true;
let isPolling = false;
let currentCursor = loadSyncCursor();
let consecutiveErrors = 0;
let nextPollDelay = POLL_INTERVAL;

// -----------------------------------------------------------------
// 1. Process Pending Events From Durable Journal
// -----------------------------------------------------------------
async function replayPendingJournalEvents() {
  const pending = getPendingEventsFromJournal();
  if (pending.length > 0) {
    console.log(`📋 Replaying ${pending.length} pending events from durable journal...`);
    for (const evt of pending) {
      try {
        await applyIncrementalSync(evt.uid, evt.entrySummary, evt.action);
        markEventStatus(evt.eventId, 'PROCESSED');
      } catch (e) {
        markEventStatus(evt.eventId, 'FAILED', e.message);
      }
    }
  }
}

// -----------------------------------------------------------------
// 2. High-Frequency Poller Loop (2-Second Target)
// -----------------------------------------------------------------
async function runPollingCycle() {
  if (!isRunning || isPolling) return;
  isPolling = true;

  try {
    const result = await detectRemoteChanges(currentCursor);

    if (result.offline) {
      consecutiveErrors++;
      nextPollDelay = Math.min(30000, POLL_INTERVAL * Math.pow(1.5, consecutiveErrors));
      updateSyncStatus({
        status: 'OFFLINE',
        error: result.error,
        recoveryAttempts: consecutiveErrors
      });
      // Keep website usable with last known good local content
    } else {
      if (consecutiveErrors > 0) {
        console.log('✅ Connection restored. Automatic recovery completed.');
        consecutiveErrors = 0;
        nextPollDelay = POLL_INTERVAL;
      }

      if (result.changed) {
        console.log(`⚡ Change detected in [${result.modifiedTables.join(', ')}] (latency: ${result.latencyMs}ms)`);
        for (const tbl of result.modifiedTables) {
          const fresh = await fetchModifiedTableData(tbl);
          if (fresh && fresh.data) {
            const syncRes = await applyIncrementalSync(fresh.key, fresh.data, 'update');
            console.log(`✅ Incremental sync completed for ${fresh.key} in ${syncRes.latencyMs}ms (${syncRes.mediaDownloaded} media downloaded)`);
          }
        }
        currentCursor = result.newCursor;
        saveSyncCursor(currentCursor);
      }

      updateSyncStatus({
        status: 'ONLINE',
        lastSuccessfulSync: new Date().toISOString(),
        syncLatencyMs: result.latencyMs,
        error: null,
        recoveryAttempts: 0
      });
    }
  } catch (err) {
    consecutiveErrors++;
    nextPollDelay = Math.min(30000, POLL_INTERVAL * Math.pow(1.5, consecutiveErrors));
    updateSyncStatus({
      status: 'OFFLINE',
      error: err.message,
      recoveryAttempts: consecutiveErrors
    });
  } finally {
    isPolling = false;
    if (isRunning) {
      setTimeout(runPollingCycle, nextPollDelay);
    }
  }
}

// -----------------------------------------------------------------
// 3. Ultra-Fast Webhook & Management HTTP Server
// -----------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Healthcheck
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  // Sync Status
  if (url.pathname === '/api/status') {
    const statusData = {
      status: consecutiveErrors === 0 ? 'ONLINE' : 'OFFLINE',
      port: PORT,
      pollIntervalMs: nextPollDelay,
      cursor: currentCursor,
      uptimeSec: Math.round(process.uptime()),
      consecutiveErrors
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(statusData, null, 2));
    return;
  }

  // Force Manual Reconciliation
  if (url.pathname === '/api/sync-now' && req.method === 'POST') {
    const s = performance.now();
    try {
      const detect = await detectRemoteChanges({});
      if (detect.changed) {
        for (const tbl of detect.modifiedTables) {
          const fresh = await fetchModifiedTableData(tbl);
          if (fresh && fresh.data) await applyIncrementalSync(fresh.key, fresh.data, 'update');
        }
        currentCursor = detect.newCursor;
        saveSyncCursor(currentCursor);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, latencyMs: Math.round(performance.now() - s) }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // Real-Time Event Webhook Receiver (Target < 50ms)
  if (url.pathname === '/api/webhook' && req.method === 'POST') {
    const requestStart = performance.now();
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        
        // 1. Journal and Deduplicate
        const { isDuplicate, isOutOfOrder, eventId } = recordIncomingEvent(payload);

        if (isDuplicate) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, dedup: true, eventId }));
          return;
        }

        if (isOutOfOrder) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, ignored: true, reason: 'Out-of-order revision', eventId }));
          return;
        }

        // 2. Apply Targeted Incremental Sync
        const target = payload.uid || payload.model || payload.event;
        const entry = payload.entry || payload;
        const action = payload.action || (payload.event?.includes('delete') ? 'delete' : 'update');

        const syncResult = await applyIncrementalSync(target, entry, action);
        markEventStatus(eventId, 'PROCESSED');

        const totalLatency = Math.round(performance.now() - requestStart);

        updateSyncStatus({
          status: 'ONLINE',
          lastSuccessfulSync: new Date().toISOString(),
          syncLatencyMs: totalLatency,
          lastEvent: { eventId, target, action }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          eventId,
          latencyMs: totalLatency,
          mediaDownloaded: syncResult.mediaDownloaded
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// -----------------------------------------------------------------
// 4. Start Daemon Process
// -----------------------------------------------------------------
server.listen(PORT, '127.0.0.1', async () => {
  console.log('===============================================================');
  console.log(`🚀 PISL WEBSITE — REAL-TIME AUTO-SYNC DAEMON RUNNING ON :${PORT} 🚀`);
  console.log(`⏱️  Polling Interval: ${POLL_INTERVAL}ms (Target: 2 seconds)`);
  console.log(`📡 Webhook Receiver: http://127.0.0.1:${PORT}/api/webhook`);
  console.log('===============================================================\n');

  updateSyncStatus({
    status: 'ONLINE',
    startedAt: new Date().toISOString(),
    port: PORT,
    pollIntervalMs: POLL_INTERVAL
  });

  // Replay uncommitted events
  await replayPendingJournalEvents();

  // Start polling cycle
  runPollingCycle();
});

// Graceful Shutdown
const cleanup = () => {
  isRunning = false;
  console.log('\n🛑 Stopping Auto-Sync Daemon gracefully...');
  updateSyncStatus({ status: 'STOPPED' });
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
