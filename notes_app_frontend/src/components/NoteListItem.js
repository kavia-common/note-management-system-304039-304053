import React from "react";
import { formatUpdatedAt, snippet } from "../utils/notes";

/**
 * PUBLIC_INTERFACE
 * Sidebar list row for a single note.
 */
export function NoteListItem({ note, selected, onSelect, onTogglePin }) {
  return (
    <div
      className={`noteItem ${selected ? "noteItemSelected" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(note.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(note.id);
        }
      }}
      aria-label={`Note: ${note.title || "Untitled"}`}
      aria-current={selected ? "true" : "false"}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <p className="noteItemTitle" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {note.title?.trim() ? note.title : "Untitled"}
          </p>
          {note.pinned ? <span className="pinBadge" aria-label="Pinned note">Pinned</span> : null}
        </div>
        <div className="noteItemMeta">
          {formatUpdatedAt(note.updatedAt)} • {snippet(note.content)}
        </div>
      </div>

      <div className="noteItemActions">
        <button
          className="iconBtn"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          title={note.pinned ? "Unpin" : "Pin"}
        >
          {note.pinned ? "📌" : "📍"}
        </button>
      </div>
    </div>
  );
}
