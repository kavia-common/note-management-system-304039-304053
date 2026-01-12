/**
 * Storage utilities for persisting notes in localStorage.
 */

const STORAGE_KEY = "ocean_notes_v1";

/**
 * PUBLIC_INTERFACE
 * Loads notes from localStorage.
 * @returns {Array<{id:string,title:string,content:string,updatedAt:number,pinned?:boolean}>}
 */
export function loadNotesFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Minimal validation
    return parsed
      .filter((n) => n && typeof n.id === "string")
      .map((n) => ({
        id: n.id,
        title: typeof n.title === "string" ? n.title : "",
        content: typeof n.content === "string" ? n.content : "",
        updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now(),
        pinned: Boolean(n.pinned),
      }));
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Saves notes to localStorage.
 * @param {Array<{id:string,title:string,content:string,updatedAt:number,pinned?:boolean}>} notes
 */
export function saveNotesToStorage(notes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Ignore quota / private mode errors; app will still work in-memory.
  }
}
