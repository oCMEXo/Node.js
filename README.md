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

5. Start the app:

```bash
npm start
```
