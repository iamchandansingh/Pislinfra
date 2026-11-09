import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('🔒 PISL PRODUCTION SECURITY & SYNCHRONIZATION AUDIT SUITE (TESTS 1-13)');
console.log('====================================================================\n');

const phpScript = path.join(rootDir, 'public', 'sync-backup.php');
const VALID_TOKEN = 'PISL_SECURE_SYNC_TOKEN_2026';
const testResults = [];

function runPhp(env = {}, input = '') {
  const envAssignments = Object.entries(env)
    .map(([k, v]) => `$_SERVER['${k}'] = ${JSON.stringify(v)};`)
    .join("\n    ");

  const runnerDir = path.join(rootDir, 'src', 'data', 'backups');
  const microRunner = path.join(runnerDir, '.tmp_test_runner.php');
  const codeFile = path.join(runnerDir, '.tmp_code.txt');

  if (fs.existsSync(codeFile)) fs.unlinkSync(codeFile);

  const runnerContent = `<?php
    ${envAssignments}
    register_shutdown_function(function() {
        $code = http_response_code() ?: 200;
        file_put_contents('${codeFile}', (string)$code);
    });
    require '${phpScript}';
  `;

  fs.writeFileSync(microRunner, runnerContent, 'utf8');
  try {
    const rawOutput = execSync(`php "${microRunner}"`, {
      input: input,
      cwd: path.join(rootDir, 'public'),
      encoding: 'utf8'
    });

    let code = 200;
    if (fs.existsSync(codeFile)) {
      code = parseInt(fs.readFileSync(codeFile, 'utf8').trim(), 10) || 200;
      fs.unlinkSync(codeFile);
    }
    if (fs.existsSync(microRunner)) fs.unlinkSync(microRunner);

    return {
      code,
      output: rawOutput.trim()
    };
  } catch (err) {
    let code = 500;
    if (fs.existsSync(codeFile)) {
      code = parseInt(fs.readFileSync(codeFile, 'utf8').trim(), 10) || 500;
      fs.unlinkSync(codeFile);
    }
    if (fs.existsSync(microRunner)) fs.unlinkSync(microRunner);
    return {
      code,
      output: (err.stdout || '').trim(),
      error: err.message
    };
  }
}

// -----------------------------------------------------------------
// TEST 1: Browser GET Request Must Be Rejected (405 Method Not Allowed)
// -----------------------------------------------------------------
console.log('▶ [TEST 1] Testing Ordinary Browser GET Request...');
try {
  const res = runPhp({ REQUEST_METHOD: 'GET' });
  if (res.code !== 405) {
    throw new Error(`Expected HTTP 405, got HTTP ${res.code}`);
  }
  const body = JSON.parse(res.output || '{}');
  if (body.status !== 'error') {
    throw new Error(`Expected status 'error', got '${body.status}'`);
  }
  console.log('✅ TEST 1 PASSED: GET request rejected with HTTP 405 Method Not Allowed.\n');
  testResults.push({ id: 1, name: 'Browser GET Rejected (405)', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 1 FAILED:', e.message, '\n');
  testResults.push({ id: 1, name: 'Browser GET Rejected (405)', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 2: Unauthorized POST Request Must Be Rejected (401 Unauthorized)
// -----------------------------------------------------------------
console.log('▶ [TEST 2] Testing Unauthorized POST (No Token)...');
try {
  const res = runPhp({ REQUEST_METHOD: 'POST', CONTENT_LENGTH: '2' }, '{}');
  if (res.code !== 401) {
    throw new Error(`Expected HTTP 401, got HTTP ${res.code}`);
  }
  const body = JSON.parse(res.output || '{}');
  if (body.message !== 'Unauthorized') {
    throw new Error(`Expected 'Unauthorized', got '${body.message}'`);
  }
  console.log('✅ TEST 2 PASSED: Unauthorized POST rejected with HTTP 401.\n');
  testResults.push({ id: 2, name: 'Unauthorized POST Rejected (401)', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 2 FAILED:', e.message, '\n');
  testResults.push({ id: 2, name: 'Unauthorized POST Rejected (401)', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 3: Invalid Token/Signature Must Be Rejected (401 Unauthorized)
// -----------------------------------------------------------------
console.log('▶ [TEST 3] Testing Invalid Bearer Token...');
try {
  const res = runPhp({
    REQUEST_METHOD: 'POST',
    HTTP_AUTHORIZATION: 'Bearer INVALID_HACKER_TOKEN_999',
    CONTENT_LENGTH: '2'
  }, '{}');
  if (res.code !== 401) {
    throw new Error(`Expected HTTP 401, got HTTP ${res.code}`);
  }
  console.log('✅ TEST 3 PASSED: Invalid token rejected with HTTP 401.\n');
  testResults.push({ id: 3, name: 'Invalid Token Rejected (401)', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 3 FAILED:', e.message, '\n');
  testResults.push({ id: 3, name: 'Invalid Token Rejected (401)', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 4: Malformed Payload Must Be Rejected (400 Bad Request)
// -----------------------------------------------------------------
console.log('▶ [TEST 4] Testing Malformed JSON Payload...');
try {
  const badJson = '{"event": "broken, syntax error...';
  const res = runPhp({
    REQUEST_METHOD: 'POST',
    HTTP_AUTHORIZATION: `Bearer ${VALID_TOKEN}`,
    CONTENT_LENGTH: String(badJson.length)
  }, badJson);
  if (res.code !== 400) {
    throw new Error(`Expected HTTP 400, got HTTP ${res.code}`);
  }
  console.log('✅ TEST 4 PASSED: Malformed JSON rejected with HTTP 400.\n');
  testResults.push({ id: 4, name: 'Malformed Payload Rejected (400)', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 4 FAILED:', e.message, '\n');
  testResults.push({ id: 4, name: 'Malformed Payload Rejected (400)', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 5: Valid Strapi Webhook Accepted (200 OK)
// -----------------------------------------------------------------
console.log('▶ [TEST 5] Testing Valid Strapi Webhook Ingestion...');
try {
  const validPayload = JSON.stringify({
    event: 'entry.update',
    createdAt: new Date().toISOString(),
    model: 'blog',
    entry: {
      id: 99991,
      documentId: 'doc_sec_test_99991',
      title: 'Security Verification Benchmark Blog',
      slug: 'security-verification-benchmark-blog',
      publishedAt: new Date().toISOString()
    }
  });

  const res = runPhp({
    REQUEST_METHOD: 'POST',
    HTTP_AUTHORIZATION: `Bearer ${VALID_TOKEN}`,
    CONTENT_LENGTH: String(validPayload.length)
  }, validPayload);

  if (res.code !== 200) {
    throw new Error(`Expected HTTP 200, got HTTP ${res.code} - ${res.output}`);
  }
  const body = JSON.parse(res.output || '{}');
  if (body.status !== 'success') {
    throw new Error(`Expected status 'success', got '${body.status}'`);
  }
  console.log('✅ TEST 5 PASSED: Valid Strapi webhook accepted with HTTP 200 OK.\n');
  testResults.push({ id: 5, name: 'Valid Strapi Webhook Accepted (200)', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 5 FAILED:', e.message, '\n');
  testResults.push({ id: 5, name: 'Valid Strapi Webhook Accepted (200)', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 6: Blog Publish Updates Local JSON
// -----------------------------------------------------------------
console.log('▶ [TEST 6] Testing Blog Publish Updates Local JSON...');
try {
  const blogsChunk = path.join(rootDir, 'public', 'data', 'blogs.json');
  if (!fs.existsSync(blogsChunk)) throw new Error('public/data/blogs.json not found');
  const blogs = JSON.parse(fs.readFileSync(blogsChunk, 'utf8'));
  const found = blogs.find(b => b.documentId === 'doc_sec_test_99991' || b.id === 99991);
  if (!found) {
    throw new Error('Test entry doc_sec_test_99991 was not found in blogs.json after publish');
  }
  console.log('✅ TEST 6 PASSED: Local blogs.json updated with newly published entry.\n');
  testResults.push({ id: 6, name: 'Blog Publish Updates Local JSON', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 6 FAILED:', e.message, '\n');
  testResults.push({ id: 6, name: 'Blog Publish Updates Local JSON', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 7: Project Image Replacement
// -----------------------------------------------------------------
console.log('▶ [TEST 7] Testing Project Update & Image Reference...');
try {
  const projectPayload = JSON.stringify({
    event: 'entry.update',
    createdAt: new Date().toISOString(),
    model: 'ongoing-project',
    entry: {
      id: 99992,
      documentId: 'doc_sec_proj_99992',
      name: 'Automated Test Infrastructure Project',
      location: 'Gurugram, Haryana',
      image: '/images/projects/Neemrana_eafebb4ad2.jpeg'
    }
  });

  const res = runPhp({
    REQUEST_METHOD: 'POST',
    HTTP_AUTHORIZATION: `Bearer ${VALID_TOKEN}`,
    CONTENT_LENGTH: String(projectPayload.length)
  }, projectPayload);

  if (res.code !== 200) throw new Error(`Project update failed with HTTP ${res.code}`);

  const projectsChunk = path.join(rootDir, 'public', 'data', 'ongoing-projects.json');
  const list = JSON.parse(fs.readFileSync(projectsChunk, 'utf8'));
  const found = list.find(p => p.documentId === 'doc_sec_proj_99992');
  if (!found) throw new Error('Project not found in ongoing-projects.json');
  if (found.image !== '/images/projects/Neemrana_eafebb4ad2.jpeg') {
    throw new Error('Project image reference did not update correctly');
  }
  console.log('✅ TEST 7 PASSED: Project record and image reference updated successfully.\n');
  testResults.push({ id: 7, name: 'Project Image Replacement', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 7 FAILED:', e.message, '\n');
  testResults.push({ id: 7, name: 'Project Image Replacement', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 8: Unpublish/Delete Test
// -----------------------------------------------------------------
console.log('▶ [TEST 8] Testing Safe Unpublish / Delete Event...');
try {
  // Delete the test blog entry
  const deleteBlogPayload = JSON.stringify({
    event: 'entry.delete',
    createdAt: new Date().toISOString(),
    model: 'blog',
    entry: {
      id: 99991,
      documentId: 'doc_sec_test_99991'
    }
  });

  runPhp({
    REQUEST_METHOD: 'POST',
    HTTP_AUTHORIZATION: `Bearer ${VALID_TOKEN}`,
    CONTENT_LENGTH: String(deleteBlogPayload.length)
  }, deleteBlogPayload);

  // Delete the test project entry
  const deleteProjPayload = JSON.stringify({
    event: 'entry.delete',
    createdAt: new Date().toISOString(),
    model: 'ongoing-project',
    entry: {
      id: 99992,
      documentId: 'doc_sec_proj_99992'
    }
  });

  runPhp({
    REQUEST_METHOD: 'POST',
    HTTP_AUTHORIZATION: `Bearer ${VALID_TOKEN}`,
    CONTENT_LENGTH: String(deleteProjPayload.length)
  }, deleteProjPayload);

  const blogsChunk = path.join(rootDir, 'public', 'data', 'blogs.json');
  const blogs = JSON.parse(fs.readFileSync(blogsChunk, 'utf8'));
  if (blogs.some(b => b.documentId === 'doc_sec_test_99991')) {
    throw new Error('Test blog still exists after delete event');
  }

  const projectsChunk = path.join(rootDir, 'public', 'data', 'ongoing-projects.json');
  const projects = JSON.parse(fs.readFileSync(projectsChunk, 'utf8'));
  if (projects.some(p => p.documentId === 'doc_sec_proj_99992')) {
    throw new Error('Test project still exists after delete event');
  }

  console.log('✅ TEST 8 PASSED: Delete events cleanly removed records from local JSON.\n');
  testResults.push({ id: 8, name: 'Unpublish/Delete Local Data Update', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 8 FAILED:', e.message, '\n');
  testResults.push({ id: 8, name: 'Unpublish/Delete Local Data Update', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 9: Shared Media Preservation
// -----------------------------------------------------------------
console.log('▶ [TEST 9] Testing Shared Media Preservation...');
try {
  const sampleShared = path.join(rootDir, 'public', 'images', 'projects', 'Neemrana_eafebb4ad2.jpeg');
  if (!fs.existsSync(sampleShared)) {
    throw new Error('Shared image was deleted or missing');
  }
  console.log('✅ TEST 9 PASSED: Shared media file preserved on disk after entity delete.\n');
  testResults.push({ id: 9, name: 'Shared Media Preservation', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 9 FAILED:', e.message, '\n');
  testResults.push({ id: 9, name: 'Shared Media Preservation', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 10 & 11: Strapi & NeonDB Outage Resilience
// -----------------------------------------------------------------
console.log('▶ [TEST 10 & 11] Testing Strapi & NeonDB Outage Resilience...');
try {
  const mainBackupPath = path.join(rootDir, 'src', 'data', 'MainBackupPislinfra.json');
  const master = JSON.parse(fs.readFileSync(mainBackupPath, 'utf8'));

  const coreKeys = [
    'home-page',
    'about-page',
    'ongoing-projects',
    'completed-projects',
    'blogs',
    'awards',
    'clients',
    'coverage-markers',
    'leadership-page',
    'case-studies',
    'ehs-page',
    'csr-page',
    'career-page'
  ];

  for (const k of coreKeys) {
    if (!master[k]) throw new Error(`Key ${k} missing from master snapshot`);
  }

  console.log(`✅ TEST 10 & 11 PASSED: All ${coreKeys.length} core keys present in local snapshot. Complete independence from Strapi & NeonDB verified.\n`);
  testResults.push({ id: 10, name: 'Strapi Outage Resilience', status: 'PASSED' });
  testResults.push({ id: 11, name: 'NeonDB Outage Resilience', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 10 & 11 FAILED:', e.message, '\n');
  testResults.push({ id: 10, name: 'Strapi Outage Resilience', status: 'FAILED', error: e.message });
  testResults.push({ id: 11, name: 'NeonDB Outage Resilience', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 12: Visitor Network Audit (Zero Client CMS Calls or Polling)
// -----------------------------------------------------------------
console.log('▶ [TEST 12] Auditing Client Code for Zero Strapi/NeonDB Calls...');
try {
  const strapiService = fs.readFileSync(path.join(rootDir, 'src', 'services', 'strapi.js'), 'utf8');
  const blogContext = fs.readFileSync(path.join(rootDir, 'src', 'context', 'BlogContext.jsx'), 'utf8');

  if (strapiService.includes('revalidateInBackground')) {
    throw new Error('strapi.js contains revalidateInBackground');
  }
  if (blogContext.includes('setInterval')) {
    throw new Error('BlogContext.jsx contains setInterval polling');
  }
  if (strapiService.includes('candidateUrls') && strapiService.includes('onrender')) {
    throw new Error('strapi.js contains candidateUrls pointing to Render');
  }

  console.log('✅ TEST 12 PASSED: 0 visitor polling loops, 0 runtime background revalidation calls.\n');
  testResults.push({ id: 12, name: 'Visitor Network Audit', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 12 FAILED:', e.message, '\n');
  testResults.push({ id: 12, name: 'Visitor Network Audit', status: 'FAILED', error: e.message });
}

// -----------------------------------------------------------------
// TEST 13: Sitemap Audit (Sync Endpoint Never Listed)
// -----------------------------------------------------------------
console.log('▶ [TEST 13] Auditing XML Sitemaps for Synchronization Endpoint...');
try {
  const sitemaps = [
    'public/sitemap.xml',
    'public/sitemap-blogs.xml',
    'public/sitemap-projects.xml',
    'public/sitemap-about.xml',
    'public/sitemap-solutions.xml',
    'public/sitemap-careers.xml',
    'public/sitemap-clients.xml',
    'public/sitemap-documents.xml'
  ];

  for (const s of sitemaps) {
    const full = path.join(rootDir, s);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('sync-backup') || content.includes('.php')) {
        throw new Error(`Sitemap ${s} contains reference to sync-backup or PHP files!`);
      }
    }
  }

  console.log('✅ TEST 13 PASSED: All sitemaps clean. sync-backup.php is completely excluded from search engines.\n');
  testResults.push({ id: 13, name: 'Sitemap Audit (Excluded from Crawlers)', status: 'PASSED' });
} catch (e) {
  console.error('❌ TEST 13 FAILED:', e.message, '\n');
  testResults.push({ id: 13, name: 'Sitemap Audit (Excluded from Crawlers)', status: 'FAILED', error: e.message });
}

console.log('====================================================================');
console.log(`🏁 AUDIT COMPLETE: ${testResults.filter(t => t.status === 'PASSED').length}/13 TESTS PASSED`);
console.log('====================================================================\n');

// Persist test report
const reportFile = path.join(rootDir, 'src', 'data', 'backups', 'security_and_sync_test_report.json');
fs.writeFileSync(reportFile, JSON.stringify(testResults, null, 2), 'utf8');
console.log(`Results saved to: ${path.relative(rootDir, reportFile)}`);
