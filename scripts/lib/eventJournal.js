import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');
const BACKUPS_DIR = path.join(ROOT, 'src/data/backups');
const JOURNAL_PATH = path.join(BACKUPS_DIR, 'events.log');

if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

// Memory cache for fast deduplication (5-second window)
const recentEvents = new Map();
const docRevisions = new Map(); // docId -> latest timestamp

/**
 * Appends an event to the durable disk journal.
 * Returns { isDuplicate, isOutOfOrder, journalEntry }
 */
export function recordIncomingEvent(event) {
  const now = Date.now();
  const eventId = event.eventId || `evt_${now}_${Math.random().toString(36).substring(2, 7)}`;
  const uid = event.uid || event.model || 'unknown';
  const docId = String(event.documentId || event.entry?.documentId || event.entry?.id || 'doc');
  const action = event.action || event.event || 'update';
  const eventTime = event.timestamp ? Number(event.timestamp) : now;

  // 1. Deduplication Check (same event ID or same uid+docId+action within 5000ms)
  const dedupKey = `${uid}:${docId}:${action}`;
  const lastSeen = recentEvents.get(dedupKey);
  if (lastSeen && now - lastSeen.time < 5000 && JSON.stringify(lastSeen.entry) === JSON.stringify(event.entry)) {
    return { isDuplicate: true, isOutOfOrder: false, eventId, reason: 'Duplicate event received within 5s window' };
  }

  // 2. Out-of-Order Check (if we already applied a newer revision for this document)
  const latestRevTime = docRevisions.get(docId) || 0;
  if (eventTime < latestRevTime) {
    return { isDuplicate: false, isOutOfOrder: true, eventId, reason: `Stale event timestamp (${eventTime} < ${latestRevTime})` };
  }

  // Update caches
  recentEvents.set(dedupKey, { time: now, entry: event.entry });
  docRevisions.set(docId, eventTime);

  // Clean memory cache if it grows too large
  if (recentEvents.size > 1000) {
    const cutoff = now - 60000;
    for (const [k, v] of recentEvents.entries()) {
      if (v.time < cutoff) recentEvents.delete(k);
    }
  }

  // 3. Persist to durable append-only journal
  const journalEntry = {
    eventId,
    uid,
    docId,
    action,
    eventTime,
    receivedAt: new Date().toISOString(),
    status: 'PENDING',
    entrySummary: typeof event.entry === 'object' && event.entry ? {
      id: event.entry.id,
      title: event.entry.title || event.entry.name,
      documentId: event.entry.documentId
    } : null
  };

  try {
    fs.appendFileSync(JOURNAL_PATH, JSON.stringify(journalEntry) + '\n', 'utf8');
  } catch (e) {
    console.error('Failed to append to event journal:', e.message);
  }

  return { isDuplicate: false, isOutOfOrder: false, eventId, journalEntry };
}

/**
 * Marks an event as PROCESSED or FAILED in the durable journal.
 */
export function markEventStatus(eventId, status = 'PROCESSED', error = null) {
  if (!fs.existsSync(JOURNAL_PATH)) return;

  const updateLine = {
    eventId,
    status,
    completedAt: new Date().toISOString(),
    error: error ? String(error) : null
  };

  try {
    fs.appendFileSync(JOURNAL_PATH, JSON.stringify(updateLine) + '\n', 'utf8');
  } catch (e) {}
}

/**
 * Reads pending (uncommitted) events from the journal upon restart.
 */
export function getPendingEventsFromJournal() {
  if (!fs.existsSync(JOURNAL_PATH)) return [];

  const pendingMap = new Map();
  try {
    const lines = fs.readFileSync(JOURNAL_PATH, 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item.status === 'PENDING') {
          pendingMap.set(item.eventId, item);
        } else if (item.status === 'PROCESSED' || item.status === 'FAILED') {
          pendingMap.delete(item.eventId);
        }
      } catch (e) {}
    }
  } catch (e) {}

  return Array.from(pendingMap.values());
}
