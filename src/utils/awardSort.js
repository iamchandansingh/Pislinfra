/**
 * Standard enterprise award sorting:
 * 1. Explicit featured flag (featured: true or isFeatured: true)
 * 2. Year descending (2026 > 2025 > 2024 > ...)
 * 3. CreatedAt descending (newest additions in CMS appear first in featured section)
 * 4. Premier accolade titles (e.g., 🏆)
 */
export const sortAwardsByFeaturedAndDate = (awardsList) => {
  if (!Array.isArray(awardsList)) return [];

  // Deduplicate by normalized title
  const seen = new Set();
  const deduped = [];
  for (const a of awardsList) {
    if (!a) continue;
    const rawTitle = a.title || a.name || '';
    if (!rawTitle) continue;
    const key = rawTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
  }

  return deduped.sort((a, b) => {
    // 1. Explicit featured flag takes #1 priority
    const aFeat = Boolean(a.featured || a.isFeatured);
    const bFeat = Boolean(b.featured || b.isFeatured);
    if (aFeat && !bFeat) return -1;
    if (!aFeat && bFeat) return 1;

    // 2. Year descending (2026 > 2025 > 2024...)
    const aYear = parseInt(a.year, 10) || 0;
    const bYear = parseInt(b.year, 10) || 0;
    if (bYear !== aYear) return bYear - aYear;

    // 3. CreatedAt descending (newest additions in CMS appear first in featured section)
    if (a.createdAt && b.createdAt) {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      if (!isNaN(aTime) && !isNaN(bTime) && bTime !== aTime) {
        return bTime - aTime;
      }
    } else if (a.createdAt && !b.createdAt) {
      return -1;
    } else if (!a.createdAt && b.createdAt) {
      return 1;
    }

    // 4. Premier recognitions (e.g. trophy emoji in title)
    const aTitle = a.title || a.name || '';
    const bTitle = b.title || b.name || '';
    const aTrophy = aTitle.includes('🏆') ? 1 : 0;
    const bTrophy = bTitle.includes('🏆') ? 1 : 0;
    if (bTrophy !== aTrophy) return bTrophy - aTrophy;

    return 0;
  });
};

export default sortAwardsByFeaturedAndDate;
