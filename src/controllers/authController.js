const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerPage = (req, res) => res.render('register');
exports.loginPage = (req, res) => res.render('login');

exports.register = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();

    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).send('User with this email already exists.');
    }

    const isFirstUser = (await User.count()) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash, role });

    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();

    const user = await User.findOne({ where: { email } });
    if (!user) return res.redirect('/login');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.redirect('/login');

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/workspaces');
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};