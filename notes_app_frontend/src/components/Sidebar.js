import React from "react";
import { useNotes } from "../store/NotesStore";
import { NoteListItem } from "./NoteListItem";

/**
 * PUBLIC_INTERFACE
 * Left sidebar: search, create button, and notes list.
 */
export function Sidebar() {
  const { filteredNotes, selectedNote, selectNote, createNote, query, setQuery, togglePin } = useNotes();

  const selectedId = selectedNote?.id ?? null;

  return (
    <aside className="sidebar" aria-label="Notes sidebar">
      <div className="sidebarTop">
        <div className="sidebarTopRow">
          <h2 className="sidebarTitle">Your notes</h2>
          <button className="btn btnPrimary" onClick={createNote} aria-label="Create a new note">
            + New
          </button>
        </div>

        <div className="searchRow">
          <label className="sr-only" htmlFor="noteSearch">
            Search notes
          </label>
          <input
            id="noteSearch"
            className="input"
            placeholder="Search title or content…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search notes"
          />
        </div>
      </div>

      <div className="sidebarList" role="list" aria-label="Notes list">
        {filteredNotes.length === 0 ? (
          <div className="banner bannerInfo" role="status" aria-live="polite">
            No notes match your search.
          </div>
        ) : (
          filteredNotes.map((n) => (
            <div key={n.id} role="listitem">
              <NoteListItem
                note={n}
                selected={n.id === selectedId}
                onSelect={selectNote}
                onTogglePin={togglePin}
              />
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
