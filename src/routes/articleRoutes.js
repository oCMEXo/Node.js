
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const articleController = require('../controllers/articleController');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
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

router.get('/workspaces/:workspaceId/articles', articleController.listByWorkspace);
router.get('/workspaces/:workspaceId/articles/new', articleController.newForm);
router.post('/workspaces/:workspaceId/articles', upload.single('attachment'), articleController.create);

router.get('/articles/:id', articleController.detail);
router.get('/articles/:id/edit', articleController.editForm);
router.put('/articles/:id', upload.single('attachment'), articleController.update);
router.delete('/articles/:id', articleController.destroy);

module.exports = router;
