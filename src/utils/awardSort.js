import { extractNumericId } from './formatBlog.js';

/**
 * Standard enterprise award sorting (newest added shows first):
 * 1. Year descending (2026 > 2025 > 2024 > ...)
 * 2. CreatedAt descending (newest additions in CMS appear #1 in Latest Achievements & grid; newer additions push previous ones down)
 * 3. Numeric WP ID descending tie-breaker
 * 4. Explicit featured flag & premier accolade titles (e.g., 🏆)
 */
export const sortAwardsByFeaturedAndDate = (awardsList) => {
  if (!Array.isArray(awardsList)) return [];

  // Deduplicate by unique documentId, id, or normalized title + year + company
  const seen = new Set();
  const deduped = [];
  for (const a of awardsList) {
    if (!a) continue;
    const rawTitle = a.title || a.name || '';
    if (!rawTitle) continue;
    const key = a.documentId
      ? `doc_${a.documentId}`
      : (a.id
          ? `id_${a.id}`
          : `${rawTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}_${a.year || ''}_${(a.company || '').trim().toLowerCase()}`);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
  }

  return deduped.sort((a, b) => {
    // 1. Year descending (2026 > 2025 > 2024...)
    const aYear = parseInt(a.year, 10) || 0;
    const bYear = parseInt(b.year, 10) || 0;
    if (bYear !== aYear) return bYear - aYear;

    // 2. CreatedAt descending (newest additions in CMS appear first and shift older ones down)
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

    // 3. Numeric ID descending tie-breaker
    const aNumId = extractNumericId(a);
    const bNumId = extractNumericId(b);
    if (bNumId !== aNumId) return bNumId - aNumId;

    // 4. Explicit featured flag tie-breaker
    const aFeat = Boolean(a.featured || a.isFeatured);
    const bFeat = Boolean(b.featured || b.isFeatured);
    if (aFeat && !bFeat) return -1;
    if (!aFeat && bFeat) return 1;

    // 5. Premier recognitions (e.g. trophy emoji in title)
    const aTitle = a.title || a.name || '';
    const bTitle = b.title || b.name || '';
    const aTrophy = aTitle.includes('🏆') ? 1 : 0;
    const bTrophy = bTitle.includes('🏆') ? 1 : 0;
    if (bTrophy !== aTrophy) return bTrophy - aTrophy;

    return 0;
  });
};

export default sortAwardsByFeaturedAndDate;
