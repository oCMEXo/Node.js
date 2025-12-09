const path = require("path");
const { Logger, LOG_TYPES } = require("./lib/logger");

const logsRoot = path.join(__dirname, "logs");
const logger = new Logger({ baseDir: logsRoot });

let currentFolderPath = null;

function createNewFolder() {
  const folderInfo = logger.createLogFolder();
  currentFolderPath = folderInfo.fullPath;
  console.log("=== Created log folder:", folderInfo.folderName, "===");
}

function writeRandomLog() {
  if (!currentFolderPath) {
    createNewFolder();
  }
  const now = new Date();
  const fileName = logger.formatFileName(now);
  const filePath = path.join(currentFolderPath, fileName);
  const isSuccess = Math.random() >= 0.5;
  const type = isSuccess ? LOG_TYPES.SUCCESS : LOG_TYPES.ERROR;
  const message = isSuccess ? "Operation completed successfully" : "Operation failed with error";
  try {
    logger.writeLog(filePath, type, message);
    console.log("Log written:", path.relative(logsRoot, filePath), "-", type);
  } catch (err) {
    console.error("Failed to write log file:", err.message);
  }
}

createNewFolder();
writeRandomLog();

setInterval(createNewFolder, 60 * 1000);
setInterval(writeRandomLog, 10 * 1000);
