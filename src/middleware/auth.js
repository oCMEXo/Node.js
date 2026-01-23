const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, { attributes: ['id', 'email', 'role'] });
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    req.user = user.toJSON();
    res.locals.currentUser = req.user;
    next();
  } catch {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};