function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function isStrongPassword(s) {
  return typeof s === "string" && s.length >= 8;
}

function nonEmptyText(s, maxLen) {
  return typeof s === "string" && s.trim().length > 0 && s.trim().length <= maxLen;
}

module.exports = { isEmail, isStrongPassword, nonEmptyText };
