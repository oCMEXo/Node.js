const { User } = require('../models');

exports.userManagementPage = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role'],
      order: [['id', 'ASC']]
    });

    res.render('user_management', { users });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    const role = (req.body.role || '').trim();

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).send('Invalid role.');
    }

    // prevent admin from removing own admin role accidentally
    if (req.user.id === targetUserId && role !== 'admin') {
      return res.status(400).send('You cannot remove your own admin role.');
    }

    const user = await User.findByPk(targetUserId);
    if (!user) return res.status(404).send('User not found');

    await user.update({ role });
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
};