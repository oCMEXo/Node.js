module.exports = (req, res, next) => {
    req.user = {
        id: 1,
        email: "testuser@example.com",
        role: "admin"
    };
    next();
};
