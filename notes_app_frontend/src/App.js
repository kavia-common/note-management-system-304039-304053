import React from "react";
import "./App.css";
import { NotesProvider } from "./store/NotesStore";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";

/**
 * PUBLIC_INTERFACE
 * Root SPA for the notes application (Ocean Professional theme).
 * Provides a sidebar for navigation and an editor for viewing/editing notes.
 */
function App() {
  return (
    <NotesProvider>
      <div className="appShell">
        <Header />
        <div className="main" role="main" aria-label="Notes application">
          <Sidebar />
          <Editor />
        </div>
      </div>
    </NotesProvider>
  );
}

export default App;
