import React from "react";
import { useNotes } from "../store/NotesStore";

/**
 * PUBLIC_INTERFACE
 * App header with branding and transient inline toast messages.
 */
export function Header() {
  const { toast, clearToast } = useNotes();

  return (
    <div className="header" role="banner">
      <div className="headerInner">
        <div className="brand" aria-label="Ocean Notes">
          <div className="brandMark" aria-hidden="true" />
          <div style={{ minWidth: 0 }}>
            <p className="brandTitle">Ocean Notes</p>
            <p className="brandSubtitle">Fast, local-first note taking</p>
          </div>
        </div>

        <div className="headerActions">
          {toast ? (
            <div
              className={`banner ${
                toast.type === "error"
                  ? "bannerError"
                  : toast.type === "warn"
                    ? "bannerWarn"
                    : "bannerInfo"
              }`}
              role="status"
              aria-live="polite"
              style={{ maxWidth: 420 }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>{toast.message}</div>
                <button className="btn btnGhost" onClick={clearToast} aria-label="Dismiss message">
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="smallText" aria-label="Local storage status">
              Saved locally
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
