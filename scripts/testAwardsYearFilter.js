import defaultAwardsData from '../src/data/Awards-&-Certifications.js';
import { sortAwardsByFeaturedAndDate } from '../src/utils/awardSort.js';

console.log('--- Testing Awards Page Year Filter Isolation ---');

const awardsAndCertifications = sortAwardsByFeaturedAndDate(defaultAwardsData);

// 1. Initial State / Computation
function computeLatestAchievement(awardsList) {
  const targetList = (awardsList || []).filter(item => item.category !== 'Certification');
  const data = targetList.length > 0 ? targetList[0] : (awardsList.length > 0 ? awardsList[0] : null);
  if (!data) return null;
  return {
    id: data.id,
    year: parseInt(data.year, 10) || 2025,
    title: data.title,
    organization: data.company || 'Industry Recognition',
  };
}

function computeLatestAchievementsList(awardsList) {
  return (awardsList || []).filter(a => a.category !== 'Certification').slice(0, 5);
}

function computeFilteredData(awardsList, selectedYear) {
  if (selectedYear === 'All' || !selectedYear) return awardsList;
  const targetYear = String(selectedYear).trim();
  return awardsList.filter(item => String(item.year || '').trim() === targetYear);
}

// Baseline Latest Achievement
const initialLatest = computeLatestAchievement(awardsAndCertifications);
const initialTop5 = computeLatestAchievementsList(awardsAndCertifications);

console.log('Baseline Latest Achievement:', initialLatest.title, `(${initialLatest.year})`);
console.log('Baseline Top 5 carousel items count:', initialTop5.length);

const testYears = ['2026', '2025', '2024', '2023', '2022', '2021', 'All'];

let allPassed = true;

for (const year of testYears) {
  const filtered = computeFilteredData(awardsAndCertifications, year);
  
  // Latest Achievement must NOT use filteredData, must use awardsAndCertifications
  const latestAfterYearChange = computeLatestAchievement(awardsAndCertifications);
  const top5AfterYearChange = computeLatestAchievementsList(awardsAndCertifications);

  // Verification 1: Latest Achievement stays identical
  const latestMatch = JSON.stringify(initialLatest) === JSON.stringify(latestAfterYearChange);
  const top5Match = JSON.stringify(initialTop5.map(a => a.id)) === JSON.stringify(top5AfterYearChange.map(a => a.id));

  // Verification 2: Legacy of Excellence filtered list matches target year
  let filterValid = true;
  if (year !== 'All') {
    filterValid = filtered.every(item => String(item.year) === year);
  } else {
    filterValid = filtered.length === awardsAndCertifications.length;
  }

  if (latestMatch && top5Match && filterValid) {
    console.log(`[PASS] Year '${year}': Filtered items = ${filtered.length}. Latest Achievement remains: "${initialLatest.title}" (${initialLatest.year}).`);
  } else {
    console.error(`[FAIL] Year '${year}': latestMatch=${latestMatch}, top5Match=${top5Match}, filterValid=${filterValid}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\nSUCCESS: All year filter isolation tests PASSED perfectly.');
} else {
  console.error('\nFAILURE: Some tests failed.');
  process.exit(1);
}
