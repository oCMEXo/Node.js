# SSE Assignment 5 — PostgreSQL + Sequelize Setup

Этот проект демонстрирует базовую интеграцию **Node.js**, **PostgreSQL** и **Sequelize ORM** с поддержкой миграций.

## Что делает проект

- Подключается к PostgreSQL с помощью Sequelize.
- Имеет одну модель: **Article**.
- Содержит миграцию, создающую таблицу **Articles**.
- Позволяет любому пользователю поднять базу командой:

  ```bash
  npm run db:migrate
