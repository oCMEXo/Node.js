const jwt = require("jsonwebtoken");

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const token = req.cookies.token || bearer;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized" });
  }
}

function authPage(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login.html");
  try {
    verifyToken(token);
    return next();
  } catch (e) {
    return res.redirect("/login.html");
  }
}

module.exports = { signToken, verifyToken, authMiddleware, authPage };
