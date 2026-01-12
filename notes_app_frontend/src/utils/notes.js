/**
 * Notes helper functions.
 */

/**
 * PUBLIC_INTERFACE
 * Generates a reasonably unique ID without extra dependencies.
 * @returns {string}
 */
export function generateId() {
  // Combines time + randomness; sufficient for local-only notes.
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * PUBLIC_INTERFACE
 * Sort pinned first, then by updatedAt descending.
 * @param {Array<{pinned?:boolean,updatedAt:number}>} notes
 * @returns {Array}
 */
export function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });
}

/**
 * PUBLIC_INTERFACE
 * Creates a human-friendly "time ago" label (simple).
 * @param {number} ts
 * @returns {string}
 */
export function formatUpdatedAt(ts) {
  const deltaMs = Date.now() - ts;
  const mins = Math.floor(deltaMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/**
 * PUBLIC_INTERFACE
 * Returns a compact one-line snippet of content.
 * @param {string} content
 * @returns {string}
 */
export function snippet(content) {
  const s = (content || "").replace(/\s+/g, " ").trim();
  if (!s) return "No content";
  return s.length > 80 ? `${s.slice(0, 80)}…` : s;
}
