## Existing app + Auth extension (Node.js + PostgreSQL)

Защищённая зона — это основное приложение (Articles) с CRUD-операциями, которые доступны только при валидном JWT.

### База данных (pgAdmin)
1) Создай базу `auth_jwt_pg`
2) Выполни миграцию: `migrations/001_init.sql`

Там создаются:
- `users`
- `articles`

### Env
В репозитории есть `.env.example`.
Скопируй в `.env` и заполни `DATABASE_URL` и `JWT_SECRET`.

### Запуск
```bash
npm i
npm run dev
```

### Страницы
Public:
- `/register.html`
- `/login.html`

Protected:
- `/app.html` (основное приложение: статьи)

### API
Public:
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`

Protected:
- `GET /api/me`
- `GET /api/articles`
- `POST /api/articles`
- `DELETE /api/articles/:id`
