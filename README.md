# Node.js Logs Assignment

This project contains two Node.js applications that share a Logger module.

Structure:

- logger.js
- generator.js
- analyzer.js
- logs/ (created at runtime)

Install dependencies:

```bash
npm install
```

Log generator:

```bash
npm run start:generator
```

This application:

- uses a shared Logger class
- writes JSON log entries under `logs/<YYYYMMDD-HHMM>/log-HHMMSS.log`
- writes a new log entry every 10 seconds
- starts a new folder automatically when the minute changes
- prints a highlighted line whenever the active folder changes

Analyzer:

```bash
npm run start:analyzer
```

Options:

```bash
node analyzer.js --help
node analyzer.js
node analyzer.js --type success
node analyzer.js --type error
node analyzer.js --type info
```

Analyzer:

- scans all folders under `logs`
- reads all `.log` files
- parses JSON lines
- counts entries per log type using the same type values from Logger
- skips malformed lines without crashing
- handles missing `logs` directory gracefully

This setup satisfies the assignment requirements:

- two applications (generator and analyzer)
- shared Logger module
- CLI filter in analyzer
- clear usage instructions
- basic error handling and stable behavior
