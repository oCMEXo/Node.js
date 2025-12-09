# Assignment 3: API Extension

This project shows edit and delete endpoints for articles, with validation and a simple frontend.

Structure:

- backend/
  - data/articlesStore.js
  - controllers/articlesController.js
  - routes/articles.js
  - app.js
  - server.js
- frontend/
  - index.html
  - script.js
- package.json

Install:

```bash
npm install
```

Run:

```bash
npm start
```

Open in browser:

- http://localhost:3000

API routes:

- GET /api/articles
- POST /api/articles
- PUT /api/articles/:id
- DELETE /api/articles/:id

Validation details:

- All operations that use :id:
  - check that id is a positive integer
  - check that the article exists
  - return JSON errors:

    - 400 { "error": "Invalid article id" }
    - 404 { "error": "Article not found" }

- Create:
  - requires both title and content
  - on error: 400 { "error": "Both title and content are required to create an article" }

- Update:
  - article must exist
  - at least one field (title or content) must be provided
  - on error: 400 { "error": "Provide at least one field (title or content) to update the article" }

The frontend:

- shows errors from the API in a visible error box
- gracefully handles network errors and invalid operations
- allows creating, editing and deleting articles via the new endpoints.
