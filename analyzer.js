const fs = require("fs");
const path = require("path");
const Logger = require("./logger");

const logsRoot = path.join(__dirname, "logs");

function printUsage() {
  const lines = [
    "Usage:",
    "  node analyzer.js [--type success|error|info]",
    "",
    "Options:",
    "  --type, -t   Filter logs by type",
    "  --help, -h   Show this help"
  ];
  console.log(lines.join("\n"));
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = {
    type: null,
    help: false
  };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--type" || arg === "-t") {
      const value = args[i + 1];
      if (!value) {
        throw new Error("Missing value for --type");
      }
      result.type = value.toLowerCase();
      i += 1;
    } else {
      throw new Error("Unknown argument: " + arg);
    }
  }
  return result;
}

async function readAllLogFiles(rootDir) {
  const entries = [];
  try {
    const dirItems = await fs.promises.readdir(rootDir, { withFileTypes: true });
    for (const item of dirItems) {
      if (item.isDirectory()) {
        const folderPath = path.join(rootDir, item.name);
        const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".log")) {
            entries.push(path.join(folderPath, file.name));
          }
        }
      }
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    console.error("Error reading logs directory:", err.message);
    return [];
  }
  return entries;
}

async function analyzeLogs(filterType) {
  const files = await readAllLogFiles(logsRoot);
  if (files.length === 0) {
    console.log("No logs found in", logsRoot);
    return;
  }

  const counters = {
    totalEntries: 0,
    malformedLines: 0,
    byType: {}
  };

  const allowedTypes = Object.values(Logger.TYPES);
  allowedTypes.forEach(t => {
    counters.byType[t] = 0;
  });

  let filesProcessed = 0;

  for (const filePath of files) {
    let content;
    try {
      content = await fs.promises.readFile(filePath, "utf8");
    } catch (err) {
      console.error("Cannot read file", filePath + ":", err.message);
      continue;
    }
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      let parsed;
      try {
        parsed = JSON.parse(trimmed);
      } catch (err) {
        counters.malformedLines += 1;
        continue;
      }
      if (!parsed || typeof parsed.type !== "string") {
        counters.malformedLines += 1;
        continue;
      }
      const type = parsed.type.toLowerCase();
      if (!allowedTypes.includes(type)) {
        counters.malformedLines += 1;
        continue;
      }
      counters.totalEntries += 1;
      counters.byType[type] += 1;
    }
    filesProcessed += 1;
  }

  console.log("Log analysis summary");
  console.log("Logs root:", logsRoot);
  console.log("Files processed:", filesProcessed);
  console.log("Total valid entries:", counters.totalEntries);
  console.log("Malformed or skipped lines:", counters.malformedLines);
  console.log("Counts by type:");
  allowedTypes.forEach(t => {
    console.log("  " + t + ":", counters.byType[t]);
  });

  if (filterType) {
    if (!allowedTypes.includes(filterType)) {
      console.log("");
      console.log("Filter type", filterType, "is not known.");
      console.log("Allowed types:", allowedTypes.join(", "));
      return;
    }
    console.log("");
    console.log("Filtered by type =", filterType);
    console.log("Matching entries:", counters.byType[filterType]);
  }
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv);
  } catch (err) {
    console.error("Argument error:", err.message);
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printUsage();
    return;
  }

  if (options.type) {
    const allowed = Object.values(Logger.TYPES);
    if (!allowed.includes(options.type)) {
      console.error("Unknown type:", options.type);
      console.error("Allowed types:", allowed.join(", "));
      process.exitCode = 1;
      return;
    }
  }

  await analyzeLogs(options.type);
}

main();
