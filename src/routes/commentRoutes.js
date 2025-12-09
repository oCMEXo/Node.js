
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/articles/:articleId/comments', commentController.create);
router.delete('/comments/:id', commentController.destroy);

module.exports = router;
