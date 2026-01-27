const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (req, res, next) => {
    const publicPaths = [
        "/login",
        "/register"
    ];

    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            req.user = null;
        }
    }

    if (!publicPaths.includes(req.path)) {
        if (!req.user) {
            return res.redirect("/login");
        }
    }

    next();
};
