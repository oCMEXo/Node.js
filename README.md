# TZ9 RBAC Assignment – Reference Implementation (Backend + Frontend)

This is a **clean reference project** implementing the assignment requirements:

- Users have roles: `admin` | `user`
- Only article creator **or** admin can edit an article
- Admin-only User Management page:
  - lists all users + roles
  - allows admins to change other users' roles
- Backend enforces RBAC on protected endpoints
- Frontend hides admin navigation + protects `/admin`

> If you want me to "fix your existing code" exactly, upload your project as a `.zip` and I will apply these changes directly.

## Tech
- Backend: Node.js + Express + SQLite (better-sqlite3) + JWT
- Frontend: React (Vite)

## Run (local)

### 1) Backend
```bash
cd backend
npm i
npm run migrate
npm run seed:admin
npm run dev
```

Backend runs on `http://localhost:4000`

Default admin after seeding:
- email: `admin@example.com`
- password: `admin12345`

### 2) Frontend
```bash
cd frontend
npm i
npm run dev
```

Frontend runs on `http://localhost:5173`

## API quick list
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (auth)
- `GET /articles` (public)
- `POST /articles` (auth)
- `PUT /articles/:id` (auth + owner or admin)
- `DELETE /articles/:id` (auth + owner or admin)
- `GET /admin/users` (admin)
- `PATCH /admin/users/:id/role` (admin)

