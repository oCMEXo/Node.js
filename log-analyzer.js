const fs = require("fs");
const path = require("path");
const { LOG_TYPES } = require("./lib/logger");

const logsRoot = path.join(__dirname, "logs");

function printUsage() {
  console.log("Usage: node log-analyzer.js [--type success|error] [--help]");
}

function parseArgs(argv) {
  const result = { type: null, help: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      return result;
    }
    if (arg === "--type" && i + 1 < argv.length) {
      const value = argv[i + 1];
      if (value === LOG_TYPES.SUCCESS || value === LOG_TYPES.ERROR) {
        result.type = value;
        i += 1;
        continue;
      } else {
        console.log('Unknown type value:', value);
        printUsage();
        process.exit(1);
      }
    } else if (arg.startsWith("--type=")) {
      const value = arg.split("=", 2)[1];
      if (value === LOG_TYPES.SUCCESS || value === LOG_TYPES.ERROR) {
        result.type = value;
        continue;
      } else {
        console.log('Unknown type value:', value);
        printUsage();
        process.exit(1);
      }
    } else {
      console.log("Unknown argument:", arg);
      printUsage();
      process.exit(1);
    }
  }
  return result;
}

function collectLogFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectLogFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files;
}

function analyzeLogs(filterType) {
  if (!fs.existsSync(logsRoot)) {
    console.log("Logs directory does not exist. Nothing to analyze.");
    return;
  }
  const files = collectLogFiles(logsRoot);
  if (files.length === 0) {
    console.log("No log files found.");
    return;
  }
  let total = 0;
  const counts = {};
  counts[LOG_TYPES.SUCCESS] = 0;
  counts[LOG_TYPES.ERROR] = 0;

  for (const filePath of files) {
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch (err) {
      console.log("Cannot read file:", filePath, "-", err.message);
      continue;
    }
    const lines = content.split("\n").filter(line => line.trim().length > 0);
    for (const line of lines) {
      let entry;
      try {
        entry = JSON.parse(line);
      } catch (err) {
        console.log("Malformed log entry in file:", filePath);
        continue;
      }
      if (!entry || typeof entry.type !== "string") {
        continue;
      }
      const type = entry.type;
      if (!counts.hasOwnProperty(type)) {
        counts[type] = 0;
      }
      counts[type] += 1;
      total += 1;
    }
  }

  if (total === 0) {
    console.log("No valid log entries found.");
    return;
  }

  if (filterType) {
    const count = counts[filterType] || 0;
    console.log("Filtered by type:", filterType);
    console.log("Count:", count);
  } else {
    console.log("Total log entries:", total);
    Object.keys(counts).forEach(type => {
      console.log(`${type}: ${counts[type]}`);
    });
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printUsage();
    return;
  }
  analyzeLogs(args.type);
}

main();
