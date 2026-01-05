function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function isStrongPassword(s) {
  return typeof s === "string" && s.length >= 8;
}

module.exports = { isEmail, isStrongPassword };
