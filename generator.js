const path = require("path");
const Logger = require("./logger");

const logsRoot = path.join(__dirname, "logs");
const logger = new Logger(logsRoot);

let lastFolderName = null;
let counter = 1;

function pickRandomType() {
  const types = [Logger.TYPES.SUCCESS, Logger.TYPES.ERROR];
  const index = Math.floor(Math.random() * types.length);
  return types[index];
}

async function writeRandomLog() {
  try {
    const type = pickRandomType();
    const message = type === Logger.TYPES.SUCCESS
      ? "Operation succeeded " + counter
      : "Operation failed " + counter;
    const info = await logger.log(type, message);
    if (lastFolderName !== info.folderName) {
      lastFolderName = info.folderName;
      const banner = "[FOLDER] Active log folder " + info.folderName + " at " + info.dirPath;
      console.log(banner);
    }
    console.log("[" + new Date().toISOString() + "]", type.toUpperCase(), "-", message, "(" + info.fileName + ")");
    counter += 1;
  } catch (err) {
    console.error("Log generator error:", err.message);
  }
}

console.log("Log generator started. Logs root:", logsRoot);
writeRandomLog();
setInterval(writeRandomLog, 10000);
