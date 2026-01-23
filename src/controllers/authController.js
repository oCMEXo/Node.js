const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerPage = (req, res) => res.render('register');
exports.loginPage = (req, res) => res.render('login');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash });
  res.redirect('/login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.redirect('/login');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.redirect('/login');

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, { httpOnly: true });
  res.redirect('/workspaces');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};