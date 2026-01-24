const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/adminController');

router.get('/admin/users', auth, admin, c.userManagementPage);
router.post('/admin/users/:id/role', auth, admin, c.updateUserRole);

module.exports = router;