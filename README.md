# Assignment 2: Work with API

This project is a simple full‑stack application with a Node.js backend and a minimal frontend.

The backend stores articles as JSON files in `backend/data`. The frontend shows the list of articles, lets you view an article, and create a new one using a small WYSIWYG editor.

## How to run

Requirements: Node.js 18+

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the app in the browser:

- http://localhost:3000

The same server serves both the API and static frontend.

## API

Base path: `/api/articles`

### GET /api/articles

Returns a list of saved articles:

```json
[
  {
    "id": "20251208123456-00001",
    "title": "First article"
  }
]
```

### GET /api/articles/:id

Returns a single article by its id:

```json
{
  "id": "20251208123456-00001",
  "title": "First article",
  "content": "<p>HTML body</p>",
  "createdAt": "2025-12-08T12:34:56.000Z"
}
```

Errors:

- 400 `{ "error": "Article id is required" }`
- 404 `{ "error": "Article not found" }`

### POST /api/articles

Creates a new article and saves it as a JSON file under `backend/data`.

Request body:

```json
{
  "title": "My title",
  "content": "<p>Some HTML content</p>"
}
```

Validation:

- If body is missing or not JSON:

  - `400 { "error": "Invalid request body", "errors": { "title": "Title is required", "content": "Content is required" } }`

- If fields are missing or empty:

  - `400 { "error": "Validation failed", "errors": { "title": "Title is required", "content": "Content is required" } }`

On success:

- `201` with the saved article JSON.

Errors:

- `500 { "error": "Failed to save article" }` if file writing fails.

## Frontend

The frontend is plain HTML + JavaScript and is served from `frontend/`.

Features:

- Left panel: list of articles from `GET /api/articles`.
- Click on an article to load it from `GET /api/articles/:id` and display the content.
- Right panel:
  - WYSIWYG editor using a `contenteditable` div and simple toolbar (bold, italic, underline, list).
  - Title input.
  - Save button that sends `POST /api/articles` with JSON body.
- Errors from the API are shown in an error box above the editor. Each validation message is listed separately.

This resolves the validation feedback:

- Backend always returns clear JSON error responses that indicate which fields are missing or invalid.
- Frontend displays those errors in a user‑friendly way.
- README explains how to run and test the backend and frontend.
