FINAL PROJECT – Assignments 9 + 10 (RBAC + Search)

This project fully implements:
- Assignment 9: User Management (RBAC: admin / user)
- Assignment 10: Article Search (title + content)

Features:
- Users have roles (admin / user)
- Only article owner OR admin can edit/delete articles
- Admin-only User Management page:
  - View all users
  - Change user roles
- Backend enforces RBAC on protected endpoints
- Search by title OR content (case-insensitive)
- Search integrated into article list page

Tech:
- Backend: Node.js + Express + SQLite (better-sqlite3) + JWT
- Frontend: React + Vite

Run:

Backend:
cd backend
npm install
mkdir data
npm run migrate
npm run seed:admin
npm run dev

Frontend:
cd frontend
npm install
npm run dev

Admin login:
email: admin@example.com
password: admin12345
