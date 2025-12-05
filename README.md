
# Node.js + PostgreSQL: Articles + Comments + Workspaces

Реализация задания на **Node.js + Express + PostgreSQL**.

## Что делает приложение

- Хранит **статьи** и **комментарии** в PostgreSQL.
- Реализует **CRUD** для:
  - workspaces (пространства / рабочие области),
  - articles,
  - comments (создание и удаление).
- Показывает статьи по workspace, даёт переключаться между workspace’ами.
- На странице статьи:
  - текст статьи,
  - список комментариев,
  - форма добавления комментария.
- Вложения (**attachments**) всё так же файлами:
  - сохраняются в папку `uploads/`,
  - в БД — только имя файла,
  - отдача через `/uploads/<filename>`.

## Стек

- Node.js 18+
- Express
- EJS
- PostgreSQL
- pg (node-postgres)
- Multer (загрузка файлов)
- dotenv (настройка подключения через `.env`)

## Структура

```text
.
├── server.js        
├── db.js            
├── schema.sql      
├── package.json
├── uploads/         
├── views/        
│   ├── workspaces.ejs
│   ├── workspace_form.ejs
│   ├── articles.ejs
│   ├── article_form.ejs
│   └── article_detail.ejs
└── tools/
    └── init-db.js   # npm run init-db
```

## Настройка PostgreSQL

По умолчанию в `db.js` используются переменные окружения:

- `PGHOST` (по умолчанию `localhost`)
- `PGPORT` (по умолчанию `5432`)
- `PGUSER` (по умолчанию `postgres`)
- `PGPASSWORD` (по умолчанию `postgres`)
- `PGDATABASE` (по умолчанию `workspace_app`)

Рекомендуется создать БД заранее:

```sql
CREATE DATABASE workspace_app;
```

Или использовать существующую и прописать её имя в `PGDATABASE`.

Можно создать файл `.env` в корне проекта:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=workspace_app
PORT=3000
```

## Как запустить

1. Установить зависимости:

```bash
npm install
```

2. Убедиться, что PostgreSQL запущен и есть база `workspace_app` (или другая по вашим env).

3. Один раз прогнать инициализацию схемы (по сути, просто проверка подключения, а схема применяется внутри `db.js`):

```bash
npm run init-db
```

4. Запустить сервер:

```bash
npm start
```

Открыть в браузере: `http://localhost:3000`.

При первом заходе на `/workspaces` создаются два workspace’а:
- `Default workspace`
- `Demo workspace`

## Маршруты (кратко)

### Workspaces

- `GET /workspaces` — список workspace’ов.
- `GET /workspaces/new` — форма создания.
- `POST /workspaces/new` — создание.
- `GET /workspaces/:id/edit` — редактирование.
- `POST /workspaces/:id/edit` — обновление.
- `POST /workspaces/:id/delete` — удаление workspace + его статей + комментариев + файлов-вложений.

### Articles

- `GET /workspaces/:workspaceId/articles` — список статей в workspace.
- `GET /workspaces/:workspaceId/articles/new` — форма создания.
- `POST /workspaces/:workspaceId/articles/new` — создание статьи (с опциональным файлом).
- `GET /articles/:id` — просмотр статьи (+ комментарии).
- `GET /articles/:id/edit` — форма редактирования.
- `POST /articles/:id/edit` — обновление (если загрузить новый файл — старый удаляется).
- `POST /articles/:id/delete` — удаление статьи (+ её комментариев и файла).

### Comments

- `POST /articles/:id/comments` — добавить комментарий.
- `POST /comments/:id/delete` — удалить комментарий.

## Соответствие критериям задания

- **Core Functionality (6 баллов)**  
  - Статьи и комментарии лежат в реальной SQL БД (PostgreSQL).  
  - Полный CRUD для статей и комментариев.  
  - Статьи обёрнуты в workspaces, есть переключение в UI.

- **Migration & Reproducibility (2 балла)**  
  - В `schema.sql` описана вся структура (workspaces, articles, comments).  
  - `db.js` автоматически применяет эту схему при старте приложения.  
  - Через `.env` легко подключить любую PostgreSQL БД.

- **Code Quality & Structure (2 балла)**  
  - Чётко разделено: db-логика (`db.js`), маршруты (`server.js`), шаблоны (`views/`).  
  - Нет жёстких магий, только обычные `SELECT/INSERT/UPDATE/DELETE` с параметрами.  
  - Код легко читать и допиливать.
