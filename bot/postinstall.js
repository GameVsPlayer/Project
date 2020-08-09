const AdmZip = require('adm-zip');
const fs = require("fs");
const path = require("path")
if (!fs.existsSync(path.join(__dirname, `/temp/`))) {
    fs.mkdirSync(path.join(__dirname, `/temp/`));
}
async function dl() {
    const request = require("request");
    await new Promise((resolve, reject) => {
        if (!fs.existsSync(path.join(__dirname, `/temp/Calculator.zip`))) {
            console.log("Download of PP Calculator started!");
            let file = fs.createWriteStream(path.join(__dirname, `/temp/Calculator.zip`));
            const start = new Date().getTime();

            let stream = request({
                    uri: "https://www.dropbox.com/s/9is9es6szcxvcm0/Calculator.zip?dl=1"
                }).pipe(file)
                .on('finish', () => {
                    console.log(`Downloaded PP Calculator in ${(new Date().getTime() - start) / 1000} Seconds`);
                    file.emit('close');
                    resolve();
                })
                .on('error', (error) => {
                    reject(error)
                })

        } else resolve();
    });
    if (!fs.existsSync(path.join(__dirname, `/built`))) {
        fs.mkdirSync(path.join(__dirname, `/built/`));
    }
    if (!fs.existsSync(path.join(__dirname, `built/PP`))) {
        fs.mkdirSync(path.join(__dirname, `built/PP/`));
    }
    if (!fs.existsSync(path.join(__dirname, `built/PP/PerformanceCalculator.dll`))) {
        console.log("Extraction Start!");
        new Promise((resolve, reject) => {
            const start2 = new Date();
            let zip = new AdmZip(path.join(__dirname, `/temp/Calculator.zip`));
            zip.extractAllTo(path.join(__dirname, `built/PP`));
            resolve();
            console.log(`Extraction complete in ${(new Date().getTime() - Number(start2)) / 1000} Seconds!`);
        })
    };

}

dl()