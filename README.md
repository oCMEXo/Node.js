1. Install dependencies:

```bash
npm install
```

2. Create a PostgreSQL database (example):

```sql
CREATE DATABASE versioned_articles;
```

3. Configure environment:

- copy `.env.example` to `.env`
- update DB credentials if needed

Example `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=versioned_articles
JWT_SECRET=supersecret
```

4. Sync schema from Sequelize models and seed default workspaces:

```bash
npm run sync-db
```

5. Start the app:

```bash
npm start
```
