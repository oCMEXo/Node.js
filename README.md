
# Articles App – Backend + Frontend

Small demo project that extends a basic Articles API with:

- CRUD for articles
- File attachments (JPG / PNG / PDF)
- Real-time notifications via WebSockets (Socket.IO)
- PostgreSQL + Sequelize with an `articles` table and migration
- Simple frontend to interact with all of that

## Project structure

```text
project/
  backend/
    server.js
    package.json
    .env
    config/
      config.js
    models/
      index.js
      article.js
    migrations/
      20251125090000-create-articles.js
    uploads/
  frontend/
    index.html
    script.js
    styles.css
```

## Backend setup

```bash
cd backend
npm install
npm run db:migrate
node server.js
```

## Frontend

Open `frontend/index.html` in a browser.
