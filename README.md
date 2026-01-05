## Auth (Node.js + PostgreSQL) — Registration + Login + JWT + Protected Logic page

### 1) Подготовка БД (через pgAdmin или psql)
1. Создай базу: `auth_jwt_pg`
2. Выполни скрипт `db/init.sql`

### 2) Настройка окружения
Скопируй `.env.example` в `.env` и укажи свои значения:
- `DATABASE_URL`
- `JWT_SECRET`

### 3) Запуск
```bash
npm i
npm run dev
```

Открой:
- `http://localhost:3000/register.html` (public)
- `http://localhost:3000/login.html` (public)
- `http://localhost:3000/logic.html` (protected)

### Как работает защита
- JWT выдаётся на `/api/login` и кладётся в HttpOnly cookie `token`
- `logic.html` и `/api/logic` доступны только при валидном токене
- если токена нет/он истёк/битый — редирект на `/login.html` или 401 для API
- logout очищает cookie
