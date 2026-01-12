import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadNotesFromStorage, saveNotesToStorage } from "../utils/storage";
import { generateId, sortNotes } from "../utils/notes";

/**
 * @typedef {{id:string,title:string,content:string,updatedAt:number,pinned?:boolean}} Note
 */

const NotesContext = createContext(null);

function createWelcomeNote() {
  const now = Date.now();
  return {
    id: generateId(),
    title: "Welcome to Ocean Notes",
    content:
      "Create notes, pin important ones, and search instantly.\n\nTips:\n• Use the sidebar search to filter by title or content\n• Pin/unpin notes to keep them at the top\n• Edits autosave after a short pause",
    updatedAt: now,
    pinned: true,
  };
}

const initialState = {
  notes: /** @type {Note[]} */ ([]),
  selectedId: /** @type {string|null} */ (null),
  query: "",
  toast: /** @type {{type:"info"|"warn"|"error", message:string} | null} */ (null),
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      const notes = action.notes;
      const selectedId = action.selectedId ?? (notes[0]?.id ?? null);
      return { ...state, notes, selectedId };
    }
    case "SET_QUERY":
      return { ...state, query: action.query };
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "TOAST":
      return { ...state, toast: action.toast };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    case "CREATE": {
      const now = Date.now();
      const newNote = {
        id: generateId(),
        title: action.title ?? "Untitled",
        content: action.content ?? "",
        updatedAt: now,
        pinned: false,
      };
      const notes = sortNotes([newNote, ...state.notes]);
      return { ...state, notes, selectedId: newNote.id };
    }
    case "UPDATE": {
      const { id, patch } = action;
      const now = Date.now();
      const notes = state.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: patch.updatedAt ?? now } : n
      );
      return { ...state, notes: sortNotes(notes) };
    }
    case "DELETE": {
      const id = action.id;
      const notes = state.notes.filter((n) => n.id !== id);
      const selectedId =
        state.selectedId === id ? (notes[0]?.id ?? null) : state.selectedId;
      return { ...state, notes, selectedId };
    }
    case "TOGGLE_PIN": {
      const id = action.id;
      const notes = state.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
      return { ...state, notes: sortNotes(notes) };
    }
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * Notes provider for the application. Handles persistence and exposes actions/selectors.
 */
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from storage once.
  useEffect(() => {
    const stored = loadNotesFromStorage();
    const notes = stored.length ? sortNotes(stored) : sortNotes([createWelcomeNote()]);
    dispatch({ type: "INIT", notes });
  }, []);

  // Persist on change.
  useEffect(() => {
    saveNotesToStorage(state.notes);
  }, [state.notes]);

  // Auto clear toast after a delay.
  useEffect(() => {
    if (!state.toast) return;
    const t = window.setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 2500);
    return () => window.clearTimeout(t);
  }, [state.toast]);

  const api = useMemo(() => {
    const normalizedQuery = state.query.trim().toLowerCase();

    const filteredNotes = normalizedQuery
      ? state.notes.filter((n) => {
          const hay = `${n.title}\n${n.content}`.toLowerCase();
          return hay.includes(normalizedQuery);
        })
      : state.notes;

    const selectedNote = state.selectedId
      ? state.notes.find((n) => n.id === state.selectedId) ?? null
      : null;

    return {
      state,
      filteredNotes,
      selectedNote,

      // Actions
      createNote: () => {
        dispatch({ type: "CREATE" });
        dispatch({ type: "TOAST", toast: { type: "info", message: "New note created" } });
      },
      selectNote: (id) => dispatch({ type: "SELECT", id }),
      setQuery: (query) => dispatch({ type: "SET_QUERY", query }),
      updateNote: (id, patch) => dispatch({ type: "UPDATE", id, patch }),
      togglePin: (id) => dispatch({ type: "TOGGLE_PIN", id }),
      deleteNote: (id) => {
        dispatch({ type: "DELETE", id });
        dispatch({ type: "TOAST", toast: { type: "warn", message: "Note deleted" } });
      },
      toast: state.toast,
      clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
    };
  }, [state]);

  return <NotesContext.Provider value={api}>{children}</NotesContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access notes state/actions.
 */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within <NotesProvider />");
  }
  return ctx;
}
