# Versioned Articles App (Assignment 7)

This project extends the previous articles/workspaces app with **article versioning**.

Every time you edit an article, a new version is created; older versions remain available in **read-only** mode.

## Tech stack

- Node.js + Express
- PostgreSQL
- Sequelize ORM
- EJS templates
- File uploads for attachments

## Data model

Main entities:

- `Workspace`
- `Article`
- `ArticleVersion`
- `Comment`

Relationships:

- `Workspace` 1 — N `Article`
- `Article` 1 — N `ArticleVersion`
- `Article` 1 — N `Comment`

Behavior:

- `Article` is the logical container.
- `ArticleVersion` holds the actual `title`, `body`, `attachmentFilename`, `version_number`, `created_at`.
- When you create an article:
  - a row in `articles`
  - a row in `article_versions` with `version_number = 1`.
- When you edit an article:
  - a **new** row in `article_versions` with `version_number = previous + 1`.
  - `articles.updated_at` is updated.
- Older versions (`version_number < latest`) are shown as **read-only** and cannot be edited.

## How to run

Requirements:

- Node.js 18+
- PostgreSQL running locally

1. Install dependencies:

```bash
npm install
```

2. Create a PostgreSQL database, for example:

```sql
CREATE DATABASE versioned_articles;
```

3. Configure environment:

- copy `.env.example` to `.env`
- adjust `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE` if needed

Example `.env`:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=versioned_articles
PORT=3000
```

4. Sync schema from Sequelize models and seed default workspaces:

```bash
npm run sync-db
```

This will:

- connect to PostgreSQL
- create tables `workspaces`, `articles`, `article_versions`, `comments` if they do not exist
- insert two default workspaces if the table is empty

5. Start the app:

```bash
npm start
```

Open in browser:

- http://localhost:3000
- you will be redirected to `/workspaces`

## UI overview

### Workspaces

- `/workspaces` — list of workspaces
- you can:
  - create workspace
  - edit workspace
  - delete workspace (with all its articles and comments)

### Articles list (latest versions)

- `/workspaces/:workspaceId/articles`
- shows:
  - article title (from **latest version**)
  - latest version number
  - comment count
- actions:
  - open article (view)
  - edit article (creates new version)
  - delete article (and all its versions and comments)

### Article detail with versions

- `/articles/:id` — opens article detail
- query param `version` can be used: `/articles/:id?version=2`

On the page:

- current version title and content
- version badge:
  - `latest` for latest version
  - `old version` for any previous version
- explicit warning when viewing old version:

  > "You are viewing an older, read-only version of this article. Editing is only allowed for the latest version."

- list of versions:
  - each entry links to `/articles/:id?version=N`
  - selected version is marked as current
- comments:
  - list of comments
  - add new comment form
  - delete comment button

Editing is **only** exposed from the latest version:

- on article detail, the "Edit (creates new version)" button is shown only when viewing the latest version
- older versions do not show any edit button

### Create / edit article

- Create:
  - `/workspaces/:workspaceId/articles/new`
  - form with `title`, `body`, optional attachment
  - on submit:
    - creates `Article` + first `ArticleVersion` (`version_number = 1`)
- Edit:
  - `/articles/:id/edit`
  - form prefilled with data from **latest** version
  - on submit:
    - creates a new `ArticleVersion` with `version_number = previous + 1`
    - keeps previous versions unchanged
    - carries over old attachment filename if no new file is uploaded

## Versioning requirements checklist

- **Updating an article creates a new version**:
  - `articleController.update` creates a new `ArticleVersion` instead of overwriting old data.
- **Old versions are accessible**:
  - all versions are listed in `article_detail.ejs`
  - any specific version can be opened with `?version=N`.
- **Old versions cannot be edited**:
  - edit link is only available when `isLatest === true`.
- **UI indicates old version**:
  - `old version` badge and a warning box on top of the page.
- **Database structure supports versioning**:
  - `articles` for the logical article
  - `article_versions` with `article_id`, `version_number`, `title`, `body`, `attachment_filename`, `created_at`.
- **Existing CRUD adapted**:
  - create: creates base article + first version
  - update: appends new version
  - delete: removes article and all versions/comments
  - lists use latest version to show the title and version number.

This structure and setup should be easy to reproduce on another machine by following the steps above.
