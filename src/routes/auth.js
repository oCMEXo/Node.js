const router = require('express').Router();
const c = require('../controllers/authController');

router.get('/login', c.loginPage);
router.post('/login', c.login);
router.get('/register', c.registerPage);
router.post('/register', c.register);
router.get('/logout', c.logout);

module.exports = router;