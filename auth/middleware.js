const { verifyToken } = require("./jwt");

function getToken(req) {
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  return req.cookies.token || bearer || "";
}

function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    req.user = verifyToken(token);
    return next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized" });
  }
}

function requireAuthPage(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login.html");
  try {
    verifyToken(token);
    return next();
  } catch (e) {
    return res.redirect("/login.html");
  }
}

module.exports = { requireAuth, requireAuthPage, getToken };
