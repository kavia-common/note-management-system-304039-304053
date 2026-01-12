import React, { useEffect, useMemo, useState } from "react";
import { useNotes } from "../store/NotesStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { formatUpdatedAt } from "../utils/notes";

/**
 * PUBLIC_INTERFACE
 * Main editor for selected note (title + content). Autosaves via debounced updates.
 */
export function Editor() {
  const { selectedNote, updateNote, togglePin, deleteNote, createNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Keep inputs in sync when selection changes.
  useEffect(() => {
    setTitle(selectedNote?.title ?? "");
    setContent(selectedNote?.content ?? "");
  }, [selectedNote?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedTitle = useDebouncedValue(title, 450);
  const debouncedContent = useDebouncedValue(content, 450);

  // Autosave: apply patches after debounce.
  useEffect(() => {
    if (!selectedNote) return;
    if (debouncedTitle !== selectedNote.title) {
      updateNote(selectedNote.id, { title: debouncedTitle });
    }
  }, [debouncedTitle, selectedNote, updateNote]);

  useEffect(() => {
    if (!selectedNote) return;
    if (debouncedContent !== selectedNote.content) {
      updateNote(selectedNote.id, { content: debouncedContent });
    }
  }, [debouncedContent, selectedNote, updateNote]);

  const editorStatus = useMemo(() => {
    if (!selectedNote) return null;
    return `Updated ${formatUpdatedAt(selectedNote.updatedAt)}`;
  }, [selectedNote]);

  if (!selectedNote) {
    return (
      <section className="editorSurface" aria-label="Note editor">
        <div className="emptyState">
          <div className="emptyCard">
            <h3 className="emptyTitle">No note selected</h3>
            <p className="emptyDesc">
              Create a note to get started, or select one from the sidebar.
            </p>
            <div style={{ marginTop: 14 }}>
              <button className="btn btnPrimary" onClick={createNote} aria-label="Create your first note">
                + Create a note
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="editorSurface" aria-label="Note editor">
      <div className="editorHeader">
        <div className="editorTitleRow">
          <label className="sr-only" htmlFor="noteTitle">
            Note title
          </label>
          <input
            id="noteTitle"
            className="input editorTitleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            aria-label="Note title"
          />

          <div className="editorSubRow">
            {selectedNote.pinned ? (
              <span className="pinBadge" aria-label="Pinned note">Pinned</span>
            ) : (
              <span className="smallText">Not pinned</span>
            )}
            <span className="smallText">{editorStatus}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="btn"
            onClick={() => togglePin(selectedNote.id)}
            aria-label={selectedNote.pinned ? "Unpin note" : "Pin note"}
          >
            {selectedNote.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            className="btn btnDanger"
            onClick={() => {
              const ok = window.confirm("Delete this note? This cannot be undone.");
              if (ok) deleteNote(selectedNote.id);
            }}
            aria-label="Delete note"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="editorBody">
        <label className="sr-only" htmlFor="noteContent">
          Note content
        </label>
        <textarea
          id="noteContent"
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note…"
          aria-label="Note content"
        />

        <div className="banner bannerInfo" role="note" aria-label="Autosave notice">
          Autosave is enabled. Changes are saved locally after a short pause.
        </div>
      </div>
    </section>
  );
}
