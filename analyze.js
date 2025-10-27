const fs = require('fs').promises;
const path = require('path');

async function analyzeLogs() {
    const logTypes = ['error', 'info', 'warn'];
    const counts = { error: 0, info: 0, warn: 0 };

    try {
        const files = await fs.readdir('.');
        const logDirs = files.filter(f => f.startsWith('NodeTest'));

        for (const dir of logDirs) {
            const dirPath = path.join('.', dir);
            const logFiles = await fs.readdir(dirPath);

            for (const file of logFiles) {
                if (!file.startsWith('log_')) continue;

                const filePath = path.join(dirPath, file);
                const content = await fs.readFile(filePath, 'utf8');

                for (const type of logTypes) {
                    if (content.includes(type)) {
                        counts[type]++;
                        break;
                    }
                }
            }
        }

        console.log('Log analyzed');
        console.log(`Error: ${counts.error}`);
        console.log(`Info:  ${counts.info}`);
        console.log(`Warn:  ${counts.warn}`);

    } catch (err) {
        console.error('Log error:', err);
    }
}

analyzeLogs();
