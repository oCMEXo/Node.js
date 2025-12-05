# SSE Assignment 5 — PostgreSQL + Sequelize Setup

Этот проект демонстрирует базовую интеграцию **Node.js**, **PostgreSQL** и **Sequelize ORM** с поддержкой миграций.  
Задача — создать подключение к базе данных, инициализировать модель данных и обеспечить запуск миграций одной командой.

---

## 🚀 Что делает проект

- Подключается к PostgreSQL с помощью Sequelize  
- Имеет одну модель: **Article**  
- Содержит миграцию, создающую таблицу **Articles**  
- Позволяет любому пользователю поднять базу командой `npm run db:migrate`  
- При старте приложения проверяет соединение и создаёт пример статьи, если таблица пуста  

---

## 📦 Установка

1. Установи зависимости:

```bash
npm install
Создай базу данных PostgreSQL (если её нет):

bash
Copy code
createdb sse_assignment
Настрой файл окружения .env (он уже включён):

env
Copy code
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sse_assignment
DB_USER=postgres
DB_PASSWORD=postgres
🛠 Запуск миграций
Создать таблицы:

bash
Copy code
npm run db:migrate
▶️ Запуск приложения
bash
Copy code
npm start
Приложение:

подключится к базе,

проверит количество записей,

создаст пример статьи при необходимости.

📁 Основные файлы
pgsql
Copy code
src/
  config/
    database.js       – подключение к БД
    database.cjs      – конфиг для sequelize-cli
  models/
    article.js        – модель Article
  migrations/
    create-articles.js – миграция таблицы
  index.js            – входная точка приложения
