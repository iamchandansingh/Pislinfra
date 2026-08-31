import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRAPI_BASE_URL = process.env.VITE_STRAPI_URL || 'http://127.0.0.1:1337';

const ENDPOINTS = [
  { key: 'awards', endpoint: 'awards?populate=*&pagination[pageSize]=100&sort=order:asc' },
  { key: 'client-appreciations', endpoint: 'client-appreciations?populate=*&pagination[pageSize]=100&sort=createdAt:desc' },
  { key: 'milestones', endpoint: 'milestones?populate=*&pagination[pageSize]=100&sort=year:asc' },
  { key: 'timeline-milestones', endpoint: 'timeline-milestones?populate=*&pagination[pageSize]=100&sort=year:asc' },
  { key: 'awards-page', endpoint: 'awards-page?populate[0]=heroImage&populate[1]=seo' },
  { key: 'ongoing-projects', endpoint: 'ongoing-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc' },
  { key: 'completed-projects', endpoint: 'completed-projects?populate=*&pagination[pageSize]=100&sort=createdAt:asc' },
  { key: 'ongoing-page', endpoint: 'ongoing-page?populate=seo,heroImage' },
  { key: 'completed-page', endpoint: 'completed-page?populate=seo,heroImage' },
  { key: 'clients', endpoint: 'clients?pagination[pageSize]=100&sort=order:asc' },
  { key: 'case-studies', endpoint: 'case-studies?populate=*&pagination[pageSize]=100&sort=createdAt:asc' },
  { key: 'case-study-page', endpoint: 'case-study-page?populate=seo,heroImage,approachSteps,trustedClients.logo' },
  { key: 'home-page', endpoint: 'home-page?populate=*' },
  { key: 'about-page', endpoint: 'about-page?populate[0]=heroImage&populate[1]=seo&populate[2]=stats&populate[3]=capabilities&populate[4]=values' },
  { key: 'leadership-page', endpoint: 'leadership-page?populate[0]=heroImage&populate[1]=seo&populate[2]=topLeaderImage&populate[3]=topLeaderHighlights&populate[4]=executives.image&populate[5]=coreTeam.image' },
  { key: 'csr-page', endpoint: 'csr-page?populate=seo,heroImage,philosophyImages,stats,focusAreas.image,givingBackCards.image,environmentCards.image,celebrationCards.image' },
  { key: 'ehs-page', endpoint: 'ehs-page?populate[0]=heroImage&populate[1]=seo&populate[2]=gallery.image&populate[3]=stats&populate[4]=features&populate[5]=philosophy.image&populate[6]=awards.image&populate[7]=rules&populate[8]=resources&populate[9]=approaches&populate[10]=pillars&populate[11]=programs' },
  { key: 'solution-pages-warehouse', endpoint: 'solution-pages?filters[slug]=warehouse&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo' },
  { key: 'solution-pages-industrial', endpoint: 'solution-pages?filters[slug]=industrial&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo' },
  { key: 'solution-pages-infrastructure', endpoint: 'solution-pages?filters[slug]=infrastructure&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=whyPislImage&populate[3]=features&populate[4]=seo' },
  { key: 'solution-pages-logistic', endpoint: 'solution-pages?filters[slug]=logistic&populate[0]=heroImage&populate[1]=mainFeatureImage&populate[2]=grids.items&populate[3]=seo' },
  { key: 'annual-report-page', endpoint: 'annual-report-page?populate[0]=heroImage&populate[1]=seo&populate[2]=reports&populate[3]=reports.pdfFile' },
  { key: 'policy-page', endpoint: 'policy-page?populate[0]=heroImage&populate[1]=seo&populate[2]=sections' }
];

async function runBackup() {
  console.log(`\n======================================================`);
  console.log(`📦 [MainBackupPislinfra] Starting Strapi Backup Sync...`);
  console.log(`🌐 Strapi URL: ${STRAPI_BASE_URL}`);
  console.log(`======================================================\n`);

  const backupData = {};
  let successCount = 0;
  let failCount = 0;

  for (const item of ENDPOINTS) {
    try {
      const url = `${STRAPI_BASE_URL}/api/${item.endpoint}`;
      console.log(`⏳ Fetching: ${item.key}...`);
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        backupData[item.key] = json.data;
        backupData[item.endpoint] = json.data;
        successCount++;
        console.log(`✅ Saved: ${item.key}`);
      } else {
        console.warn(`⚠️ Skipped (${res.status}): ${item.key}`);
        failCount++;
      }
    } catch (err) {
      console.warn(`❌ Error fetching ${item.key}: ${err.message}`);
      failCount++;
    }
  }

  // Save to src/data/MainBackupPislinfra.json
  const targetDir = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, 'MainBackupPislinfra.json');
  fs.writeFileSync(targetPath, JSON.stringify(backupData, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`🎉 [MainBackupPislinfra] Backup Sync Completed!`);
  console.log(`📁 File Saved at: ${targetPath}`);
  console.log(`📊 Success: ${successCount} | Failed/Offline: ${failCount}`);
  console.log(`💡 Now the frontend can run 100% OFFLINE without CMS!`);
  console.log(`======================================================\n`);
}

runBackup();
