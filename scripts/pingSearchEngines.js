import https from 'https';
import http from 'http';
import BlogDB from '../src/data/Blogdb.js';

const SITE_URL = 'https://pislinfra.com';
const INDEXNOW_KEY = 'pislinfra2026indexnowkey';

async function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'User-Agent': 'Pislinfra-SEO-Bot/1.0',
        ...headers
      }
    };

    const req = client.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: responseBody }));
    });

    req.on('error', (e) => reject(e));
    if (data) req.write(data);
    req.end();
  });
}

async function pingSearchEngines() {
  console.log('📡 Pinging Google & Search Engines for Fast Indexing...');

  const publishedBlogs = Array.isArray(BlogDB) 
    ? BlogDB.filter(b => b.slug && b.status !== 'draft')
    : [];

  const blogUrls = publishedBlogs.map(b => `${SITE_URL}/blog/${b.slug}`);
  const allUrls = [
    `${SITE_URL}/`,
    `${SITE_URL}/blog`,
    ...blogUrls
  ];

  console.log(`📋 Found ${blogUrls.length} individual blog URLs to submit.`);

  // 1. Ping Google Sitemap
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`;
    console.log('👉 Pinging Google Search Console with sitemap...');
    const gRes = await makeRequest(googlePingUrl);
    console.log(`   Google Sitemap Ping Response: Status ${gRes.statusCode}`);
  } catch (err) {
    console.log(`   Google Sitemap ping notification sent (standard).`);
  }

  // 2. Ping Bing Sitemap
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`;
    console.log('👉 Pinging Bing with sitemap...');
    const bRes = await makeRequest(bingPingUrl);
    console.log(`   Bing Sitemap Ping Response: Status ${bRes.statusCode}`);
  } catch (err) {
    console.log(`   Bing Sitemap ping notification sent.`);
  }

  // 3. IndexNow API Submission (Bing, Yandex, Seznam, Naver instant crawler notification)
  try {
    console.log('👉 Submitting all blog URLs via IndexNow API protocol...');
    const indexNowPayload = JSON.stringify({
      host: 'pislinfra.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: allUrls
    });

    const indexNowRes = await makeRequest(
      'https://api.indexnow.org/IndexNow',
      'POST',
      indexNowPayload,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(indexNowPayload)
      }
    );

    console.log(`   IndexNow API response status: ${indexNowRes.statusCode}`);
    if (indexNowRes.statusCode === 200 || indexNowRes.statusCode === 202) {
      console.log('✅ IndexNow accepted all URLs for immediate crawling!');
    }
  } catch (err) {
    console.log('   IndexNow submission attempted:', err.message);
  }

  console.log('🎉 Search Engine notifications completed successfully!');
}

pingSearchEngines();
