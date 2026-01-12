# Ocean Notes (notes_app_frontend)

A modern, single-page notes UI built with React and a lightweight CSS approach (no UI framework).

## Features

- **Sidebar** with:
  - Search/filter by **title or content**
  - **New note** button
  - List sorted by **Pinned first**, then **Last updated**
- **Editor** with:
  - Title + content editing
  - **Autosave (debounced)** to localStorage
  - **Delete** with confirmation
  - **Pin / Unpin**
- **Persistence**: Notes are stored in `localStorage` and loaded on app start
- **Empty states** and simple inline **toast/banner** messages
- **Responsive** layout (sidebar stacks above editor on smaller screens)
- **Accessible** labels and keyboard-selectable note list rows

## Theme (Ocean Professional)

Theme tokens live in `src/App.css` as CSS variables:

```css
:root {
  --color-primary: #2563EB;
  --color-secondary: #F59E0B;
  --color-error: #EF4444;
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #111827;
}
```

Adjust these variables to re-skin the app without touching component code.

## Local storage key

Notes are persisted under:

- `ocean_notes_v1`

To reset the app, clear that key in your browser devtools (Application/Storage).

## Future backend integration

Environment variables (if present) are intentionally **not required** right now, but the code is structured so `NotesStore` can be adapted to fetch/save notes via an API later (e.g., using `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL`).
