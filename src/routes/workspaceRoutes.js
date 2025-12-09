
const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

router.get('/', workspaceController.list);
router.get('/new', workspaceController.newForm);
router.post('/', workspaceController.create);
router.get('/:id/edit', workspaceController.editForm);
router.put('/:id', workspaceController.update);
router.delete('/:id', workspaceController.destroy);

module.exports = router;
