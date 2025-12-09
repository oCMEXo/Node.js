
# Node.js + PostgreSQL + Sequelize: Articles / Comments / Workspaces

Это улучшенная версия решения под твой фидбэк (и фидбэк препода).

## Что изменено по замечаниям

### 1. Связка схемы с моделями

- Вместо выполнения `schema.sql` руками теперь используется **Sequelize**.
- Модели:
  - `Workspace`
  - `Article`
  - `Comment`
- Файл `src/models/index.js` задаёт все **ассоциации** (hasMany / belongsTo).
- Команда:

```bash
npm run sync-db
```

делает `sequelize.sync()` и создаёт / обновляет таблицы строго по моделям.

→ Это решает проблему: **схема БД теперь жёстко связана с model-слоем**, и любые изменения в структуре делаются через модели.

### 2. Структура приложения

Код больше не свален в один `server.js`. Сейчас структура такая:

```text
src/
  app.js                # конфигурация Express, middleware, подключение роутов
  server.js             # точка входа, запуск сервера
  sync-db.js            # синхронизация схемы по моделям
  config/
    database.js         # конфиг Sequelize (PostgreSQL)
  models/
    index.js            # инициализация моделей и ассоциаций
    workspace.js
    article.js
    comment.js
  controllers/
    workspaceController.js
    articleController.js
    commentController.js
  routes/
    workspaceRoutes.js
    articleRoutes.js
    commentRoutes.js
views/
  workspaces.ejs
  workspace_form.ejs
  articles.ejs
  article_form.ejs
  article_detail.ejs
uploads/
.env.example
package.json
```

- **Контроллеры** содержат бизнес-логику.
- **Роуты** — только маршруты и связывание с контроллерами.
- **Модели** — ярко отделены, используются во всех контроллерах.

### 3. Безопасность и SQL-инъекции

- Прямых SQL-запросов больше нет — всё через Sequelize (`Workspace.findAll`, `Article.create`, `Comment.destroy`, и т.д.).
- Sequelize под капотом использует **параметризованные запросы**, так что строки типа `title`, `body`, `author` не могут пробить SQL-инъекцию.

### 4. API-логика для комментариев

Замечание было про то, что endpoint создания комментария делает лишнее (подгружает workspaces, рендерит view и т.д.).

Сейчас:

- `POST /articles/:articleId/comments` в `commentController.create`:
  - валидирует входные данные;
  - создаёт комментарий через модель `Comment`;
  - **делает только одно действие**: после успеха — `res.redirect('/articles/:id')`.
- Никаких лишних рендеров/загрузок других сущностей — **одна ответственность у обработчика**.

### 5. PUT/DELETE методы (редактирование)

Теперь использованы **REST-методы**:

- Для workspace:
  - `POST /workspaces` — создать
  - `PUT /workspaces/:id` — обновить
  - `DELETE /workspaces/:id` — удалить
- Для article:
  - `POST /workspaces/:workspaceId/articles` — создать
  - `PUT /articles/:id` — обновить
  - `DELETE /articles/:id` — удалить
- Для comment:
  - `POST /articles/:articleId/comments` — создать
  - `DELETE /comments/:id` — удалить

Так как HTML-формы не умеют `PUT`/`DELETE` напрямую, подключён:

```js
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
```

В формах используется `_method=PUT` / `_method=DELETE`, это стандартный подход.

## Основной функционал (по заданию)

- **CRUD для workspaces, articles, comments**.
- **Комментарии** привязаны к статьям (one-to-many).
- **Статьи** привязаны к workspace (one-to-many).
- UI:
  - список workspaces;
  - список статей внутри workspace + переключатель workspace’ов;
  - страница статьи с:
    - текстом,
    - вложением (если есть),
    - комментариями,
    - формой добавления комментария.

Вложения всё так же сохраняются в `/uploads`, а в БД хранится только имя файла.

## Как запустить

1. Установить зависимости:

```bash
npm install
```

2. Подготовить PostgreSQL:

- создать БД (например, `workspace_app`):

```sql
CREATE DATABASE workspace_app;
```

- скопировать `.env.example` в `.env` и при необходимости поправить настройки:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=workspace_app
PORT=3000
```

3. Синхронизировать схему по моделям и засеять дефолтные workspace’ы:

```bash
npm run sync-db
```

4. Запустить сервер:

```bash
npm start
```

Открыть `http://localhost:3000`.

## URL’ы

- Workspaces:
  - `GET /workspaces`
  - `GET /workspaces/new`
  - `POST /workspaces`
  - `GET /workspaces/:id/edit`
  - `PUT /workspaces/:id`
  - `DELETE /workspaces/:id`

- Articles:
  - `GET /workspaces/:workspaceId/articles`
  - `GET /workspaces/:workspaceId/articles/new`
  - `POST /workspaces/:workspaceId/articles`
  - `GET /articles/:id`
  - `GET /articles/:id/edit`
  - `PUT /articles/:id`
  - `DELETE /articles/:id`

- Comments:
  - `POST /articles/:articleId/comments`
  - `DELETE /comments/:id`

Итого: это уже более «правильная» архитектура под реальные проекты и полностью закрывает фидбэк препода.
