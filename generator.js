const fs = require('fs').promises;
const path = require('path');

async function Generator(){
    let log = ['error', 'info', 'warn'];


    let CountDir = 0
    let CurrentDir = ''

    async function CreateFolder() {
        CountDir++
        CurrentDir = `NodeTest${CountDir}`
        try {
            return fs.mkdir(CurrentDir);
        } catch (err) {
            console.log(err);
        }
    }

    await CreateFolder();

    setInterval(CreateFolder, 60000);

    setInterval(async () => {
        if (!CurrentDir) return;


        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `log_${timestamp}.txt`;
        const filePath = path.join(CurrentDir, fileName);
        const logMessage = log[Math.floor(Math.random() * log.length)]

        try {
            await fs.writeFile(filePath, `Create LogDir ${filePath}: ${logMessage}`);
            console.log(`Create LogDir ${filePath}: ${logMessage}`);
        } catch (error) {
            console.log(error);
        }
    }, 10000)

}

Generator();
module.exports = Generator;