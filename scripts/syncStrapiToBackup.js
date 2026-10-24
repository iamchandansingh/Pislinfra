import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { discoverAndSyncWebsiteContent } from './lib/contentDiscovery.js';
import {
  adaptOngoingProjects,
  adaptCompletedProjects,
  adaptAwards,
  adaptBlogs,
  adaptLeadership,
  adaptCoverageMarkers,
  adaptClientAppreciations,
  sanitizeBrand
} from './lib/dataAdapters.js';
import { syncAllDiscoveredMedia, sanitizeLocalhostUrls } from './lib/mediaSyncEngine.js';
import {
  loadCurrentSnapshot,
  safeCommitSnapshot,
  exportStaticCollections
} from './lib/snapshotManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runUniversalSyncPipeline() {
  console.log('===============================================================');
  console.log('🚀 PISL WEBSITE — UNIVERSAL CONTENT SYNCHRONIZATION & BACKUP 🚀');
  console.log('===============================================================');

  const startTime = Date.now();

  // 1. Inspect and load previous valid snapshot
  console.log('\n[1/6] Loading current baseline snapshot...');
  const currentSnapshot = loadCurrentSnapshot();
  console.log(`📦 Baseline loaded (${Object.keys(currentSnapshot).length} collections found).`);

  // 2. Discover and synchronize all eligible published content across all sources
  console.log('\n[2/6] Connecting to authoritative sources and discovering content...');
  const { data: syncedRawData, report: discoveryReport } = await discoverAndSyncWebsiteContent(currentSnapshot);
  console.log(`🌐 Synchronized via source: [${discoveryReport.source.toUpperCase()}]`);
  console.log(`📊 Endpoints processed: ${discoveryReport.endpointsSynced}`);

  // 3. Adapt and format core structured models
  console.log('\n[3/6] Applying content adapters to generate live data models...');
  let masterData = sanitizeBrand(syncedRawData);

  // Adapt Ongoing Projects
  const ongoing = adaptOngoingProjects(masterData['ongoing-projects'] || masterData['ongoing-projects?populate=*']);
  if (ongoing) {
    masterData['ongoing-projects'] = ongoing;
    console.log(`✅ Synced ongoing projects (${ongoing.length} items) -> projectsData.js`);
  }

  // Adapt Completed Projects
  const completed = adaptCompletedProjects(masterData['completed-projects'] || masterData['completed-projects?populate=*']);
  if (completed) {
    masterData['completed-projects'] = completed;
    console.log(`✅ Synced completed projects (${completed.length} items) -> completedProjects.js`);
  }

  // Adapt Awards & Certifications
  const awards = adaptAwards(masterData['awards'] || masterData['awards?populate=*&sort=createdAt:desc']);
  if (awards) {
    masterData['awards'] = awards;
    console.log(`✅ Synced and sorted awards (${awards.length} items) -> Awards-&-Certifications.js`);
  }

  // Adapt Blogs
  const blogs = adaptBlogs(masterData['blogs'] || masterData['blogs?populate=*']);
  if (blogs) {
    masterData['blogs'] = blogs;
    console.log(`✅ Synced blogs (${blogs.length} posts) -> Blogdb.js`);
  }

  // Adapt Leadership
  const leadership = adaptLeadership(masterData['leadership-page']);
  if (leadership) {
    console.log(`✅ Synced leadership data -> leadershipData.js`);
  }

  // Adapt Coverage Markers
  const markers = adaptCoverageMarkers(masterData['coverage-markers'] || masterData['coverage-markers?populate=*']);
  if (markers) {
    masterData['coverage-markers'] = markers;
    console.log(`✅ Synced coverage markers (${markers.length} markers) -> coverageMarkersData.js`);
  }

  // Adapt Client Appreciations
  const appreciations = adaptClientAppreciations(masterData['client-appreciations'] || masterData['client-appreciations?populate=*']);
  if (appreciations) {
    masterData['client-appreciations'] = appreciations;
    console.log(`✅ Synced client appreciations (${appreciations.length} items) -> clientAppreciationsData.js`);
  }

  // 4. Discover and localize media assets & strip any localhost URLs
  console.log('\n[4/6] Crawling and synchronizing media assets (images, PDFs, documents)...');
  const mediaStats = await syncAllDiscoveredMedia(masterData);
  console.log(`🖼️ Media Discovery Results:`);
  console.log(`   - Total Discovered: ${mediaStats.totalFound}`);
  console.log(`   - Newly Downloaded: ${mediaStats.newlyDownloaded}`);
  console.log(`   - Already Cached:   ${mediaStats.alreadyCached}`);
  console.log(`   - Failed/Skipped:   ${mediaStats.failed}`);

  // Strip localhost URLs
  masterData = sanitizeLocalhostUrls(masterData);

  // 5. Validate completeness and safely commit snapshot
  console.log('\n[5/6] Validating snapshot integrity and creating versioned backup...');
  const commitResult = safeCommitSnapshot(masterData, {
    source: discoveryReport.source,
    mediaStats,
    mode: discoveryReport.source.includes('offline') ? 'offline-fallback' : 'live-synced'
  });

  if (!commitResult.success && !commitResult.fallbackUsed) {
    console.error('❌ CRITICAL: Snapshot validation failed and no fallback available.');
    process.exit(1);
  }

  // 6. Export static collections to public/data and dist/data
  console.log('\n[6/6] Exporting decoupled static JSON collections to public/data & dist/data...');
  exportStaticCollections(masterData);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('===============================================================');
  console.log(`🌟 SYNCHRONIZATION PIPELINE FINISHED SUCCESSFULLY IN ${duration}s!`);
  console.log(`📁 Master Snapshot: src/data/MainBackupPislinfra.json`);
  console.log(`📁 Public Backup:   public/data/live-backup.json`);
  console.log(`📁 Versioned Copy:  src/data/backups/snapshot-latest.json`);
  console.log('===============================================================\n');

  return { success: true, commitResult, mediaStats, discoveryReport };
}

// Run directly when called via node scripts/syncStrapiToBackup.js
runUniversalSyncPipeline().catch(err => {
  console.error('❌ Fatal error in universal sync pipeline:', err);
  process.exit(1);
});
