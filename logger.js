const fs = require("fs");
const path = require("path");

class Logger {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  static get TYPES() {
    return {
      SUCCESS: "success",
      ERROR: "error",
      INFO: "info"
    };
  }

  getCurrentFolderName(date) {
    const d = date || new Date();
    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return year + month + day + "-" + hour + minute;
  }

  getFileName(date) {
    const d = date || new Date();
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    const second = String(d.getSeconds()).padStart(2, "0");
    return "log-" + hour + minute + second + ".log";
  }

  async ensureDir(dirPath) {
    await fs.promises.mkdir(dirPath, { recursive: true })
  }

  async log(type, message) {
    const now = new Date();
    const folderName = this.getCurrentFolderName(now);
    const dirPath = path.join(this.rootDir, folderName);
    await this.ensureDir(dirPath);
    const fileName = this.getFileName(now);
    const filePath = path.join(dirPath, fileName);
    const entry = {
      timestamp: now.toISOString(),
      type,
      message
    };
    const line = JSON.stringify(entry) + "\n";
    await fs.promises.appendFile(filePath, line, { encoding: "utf8" });
    return { folderName, dirPath, fileName, filePath };
  }
}

module.exports = Logger;
