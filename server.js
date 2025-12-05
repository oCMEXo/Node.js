
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// body parsing
app.use(express.urlencoded({ extended: true }));

// simple flash system (per request)
app.use((req, res, next) => {
  res.locals.flashMessages = [];
  res.flash = (type, message) => {
    res.locals.flashMessages.push({ type, message });
  };
  next();
});

// file upload via multer
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const safeName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// small wrappers around pg
async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

async function getOne(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

async function exec(sql, params = []) {
  await pool.query(sql, params);
}

// redirect root
app.get('/', (req, res) => {
  res.redirect('/workspaces');
});

// helpers
async function loadWorkspace(id) {
  return await getOne('SELECT * FROM workspaces WHERE id = $1', [id]);
}

async function loadWorkspaces() {
  return await query('SELECT * FROM workspaces ORDER BY name ASC');
}

// WORKSPACES

app.get('/workspaces', async (req, res, next) => {
  try {
    let workspaces = await loadWorkspaces();
    if (workspaces.length === 0) {
      await exec('INSERT INTO workspaces (name) VALUES ($1)', ['Default workspace']);
      await exec('INSERT INTO workspaces (name) VALUES ($1)', ['Demo workspace']);
      workspaces = await loadWorkspaces();
    }
    res.render('workspaces', { workspaces });
  } catch (err) {
    next(err);
  }
});

app.get('/workspaces/new', (req, res) => {
  res.render('workspace_form', { workspace: null });
});

app.post('/workspaces/new', async (req, res, next) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    res.flash('error', 'Workspace name is required.');
    return res.render('workspace_form', { workspace: null });
  }
  try {
    const existing = await getOne('SELECT * FROM workspaces WHERE name = $1', [name]);
    if (existing) {
      res.flash('error', 'Workspace with this name already exists.');
      return res.render('workspace_form', { workspace: null });
    }
    await exec('INSERT INTO workspaces (name) VALUES ($1)', [name]);
    res.flash('success', 'Workspace created.');
    const workspaces = await loadWorkspaces();
    res.render('workspaces', { workspaces });
  } catch (err) {
    next(err);
  }
});

app.get('/workspaces/:id/edit', async (req, res, next) => {
  try {
    const workspace = await loadWorkspace(req.params.id);
    if (!workspace) return res.status(404).send('Workspace not found');
    res.render('workspace_form', { workspace });
  } catch (err) {
    next(err);
  }
});

app.post('/workspaces/:id/edit', async (req, res, next) => {
  const name = (req.body.name || '').trim();
  try {
    if (!name) {
      res.flash('error', 'Workspace name is required.');
      const workspace = await loadWorkspace(req.params.id);
      return res.render('workspace_form', { workspace });
    }
    await exec('UPDATE workspaces SET name = $1 WHERE id = $2', [name, req.params.id]);
    res.flash('success', 'Workspace updated.');
    const workspaces = await loadWorkspaces();
    res.render('workspaces', { workspaces });
  } catch (err) {
    next(err);
  }
});

app.post('/workspaces/:id/delete', async (req, res, next) => {
  try {
    const wsId = req.params.id;

    // delete attachments & rows manually for clarity
    const articles = await query('SELECT id, attachment_filename FROM articles WHERE workspace_id = $1', [wsId]);
    for (const art of articles) {
      if (art.attachment_filename) {
        const filePath = path.join(uploadsDir, art.attachment_filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      await exec('DELETE FROM comments WHERE article_id = $1', [art.id]);
    }
    await exec('DELETE FROM articles WHERE workspace_id = $1', [wsId]);
    await exec('DELETE FROM workspaces WHERE id = $1', [wsId]);

    res.flash('success', 'Workspace and its articles/comments deleted.');
    const workspaces = await loadWorkspaces();
    res.render('workspaces', { workspaces });
  } catch (err) {
    next(err);
  }
});

// ARTICLES

app.get('/workspaces/:workspaceId/articles', async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await loadWorkspace(workspaceId);
    if (!workspace) return res.status(404).send('Workspace not found');
    const workspaces = await loadWorkspaces();
    const articles = await query(
      `SELECT a.*,
              (SELECT COUNT(*) FROM comments c WHERE c.article_id = a.id) AS comment_count
       FROM articles a
       WHERE a.workspace_id = $1
       ORDER BY a.created_at DESC`,
      [workspaceId]
    );
    res.render('articles', { workspace, workspaces, articles });
  } catch (err) {
    next(err);
  }
});

app.get('/workspaces/:workspaceId/articles/new', async (req, res, next) => {
  try {
    const workspace = await loadWorkspace(req.params.workspaceId);
    if (!workspace) return res.status(404).send('Workspace not found');
    res.render('article_form', { workspace, article: null });
  } catch (err) {
    next(err);
  }
});

app.post('/workspaces/:workspaceId/articles/new', upload.single('attachment'), async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await loadWorkspace(workspaceId);
    if (!workspace) return res.status(404).send('Workspace not found');

    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();
    let attachmentFilename = null;

    if (!title) {
      res.flash('error', 'Title is required.');
      return res.render('article_form', { workspace, article: null });
    }

    if (req.file) {
      attachmentFilename = req.file.filename;
    }

    await exec(
      'INSERT INTO articles (title, body, workspace_id, attachment_filename) VALUES ($1, $2, $3, $4)',
      [title, body, workspaceId, attachmentFilename]
    );

    res.redirect(`/workspaces/${workspaceId}/articles`);
  } catch (err) {
    next(err);
  }
});

app.get('/articles/:id', async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await getOne('SELECT * FROM articles WHERE id = $1', [articleId]);
    if (!article) return res.status(404).send('Article not found');
    const workspace = await loadWorkspace(article.workspace_id);
    const workspaces = await loadWorkspaces();
    const comments = await query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC',
      [articleId]
    );
    res.render('article_detail', { article, workspace, workspaces, comments });
  } catch (err) {
    next(err);
  }
});

app.get('/articles/:id/edit', async (req, res, next) => {
  try {
    const article = await getOne('SELECT * FROM articles WHERE id = $1', [req.params.id]);
    if (!article) return res.status(404).send('Article not found');
    const workspace = await loadWorkspace(article.workspace_id);
    res.render('article_form', { workspace, article });
  } catch (err) {
    next(err);
  }
});

app.post('/articles/:id/edit', upload.single('attachment'), async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await getOne('SELECT * FROM articles WHERE id = $1', [articleId]);
    if (!article) return res.status(404).send('Article not found');

    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();

    if (!title) {
      const workspace = await loadWorkspace(article.workspace_id);
      res.flash('error', 'Title is required.');
      return res.render('article_form', { workspace, article });
    }

    let attachmentFilename = article.attachment_filename;

    if (req.file) {
      if (attachmentFilename) {
        const oldPath = path.join(uploadsDir, attachmentFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      attachmentFilename = req.file.filename;
    }

    await exec(
      'UPDATE articles SET title = $1, body = $2, updated_at = NOW(), attachment_filename = $3 WHERE id = $4',
      [title, body, attachmentFilename, articleId]
    );

    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    next(err);
  }
});

app.post('/articles/:id/delete', async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await getOne('SELECT * FROM articles WHERE id = $1', [articleId]);
    if (!article) return res.status(404).send('Article not found');

    if (article.attachment_filename) {
      const filePath = path.join(uploadsDir, article.attachment_filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await exec('DELETE FROM comments WHERE article_id = $1', [articleId]);
    await exec('DELETE FROM articles WHERE id = $1', [articleId]);

    res.redirect(`/workspaces/${article.workspace_id}/articles`);
  } catch (err) {
    next(err);
  }
});

// COMMENTS

app.post('/articles/:id/comments', async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await getOne('SELECT * FROM articles WHERE id = $1', [articleId]);
    if (!article) return res.status(404).send('Article not found');

    const author = (req.body.author || '').trim();
    const body = (req.body.body || '').trim();

    if (!author || !body) {
      const workspace = await loadWorkspace(article.workspace_id);
      const workspaces = await loadWorkspaces();
      const comments = await query(
        'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC',
        [articleId]
      );
      res.locals.flashMessages.push({ type: 'error', message: 'Author and comment text are required.' });
      return res.render('article_detail', { article, workspace, workspaces, comments });
    }

    await exec(
      'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)',
      [author, body, articleId]
    );

    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    next(err);
  }
});

app.post('/comments/:id/delete', async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const comment = await getOne('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (!comment) return res.status(404).send('Comment not found');

    await exec('DELETE FROM comments WHERE id = $1', [commentId]);

    res.redirect(`/articles/${comment.article_id}`);
  } catch (err) {
    next(err);
  }
});

// basic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
