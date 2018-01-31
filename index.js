const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const isDir = (dir) => {
    try {
        const stat = fs.statSync(dir);
        return stat.isDirectory();
    } catch (err) {
        return false;
    }
};
const isFile = (file) => {
    try {
        const stat = fs.statSync(file);
        return stat.isFile();
    } catch (err) {
        return false;
    }
};

const app = express();
const jsonDir = path.join(__dirname, 'json');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/apidoc', express.static(path.join(__dirname, 'public')));
app.use('/json', express.static(jsonDir));

app.get('/json', (req, res) => {
    const swaggerJsons = {};
    const serviceNames = fs.readdirSync(jsonDir, 'utf-8');

    serviceNames.forEach((serviceName) => {
        const dirPath = path.join(jsonDir, serviceName);

        if (isDir(dirPath)) {
            const files = fs.readdirSync(dirPath, 'utf-8');
            const jsonFiles = [];

            files.forEach((filename) => {
                const filePath = path.join(dirPath, filename);
                if (isFile(filePath) && filename.indexOf('.json') >= 0) {
                    jsonFiles.push(filename);
                }
            });
            swaggerJsons[serviceName] = jsonFiles;
        }
    });

    res.send(JSON.stringify(swaggerJsons));
});
app.listen(3000, () => {
    console.log('Listening on port 3000!');
});