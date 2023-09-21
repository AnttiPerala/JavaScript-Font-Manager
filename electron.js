console.log('electron.js is being executed'); // Integrated log here

const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const server = express();

let mainWindow;

function createWindow() {
    console.log('createWindow function is being called'); // Additional log here
    console.log('Path to preload.js:', path.join(__dirname, 'preload.js')); // Existing log here

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [`isAppPackaged=${app.isPackaged}`],
        }
    });

    console.log('BrowserWindow has been created'); // Additional log here
    mainWindow.loadURL('http://localhost:3000');
    console.log('loadURL has been called'); // Additional log here

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    console.log('app is ready'); // Additional log here
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// Set up the Express server
server.use('/public', express.static('public'));

server.get('/fonts', (req, res) => {
    const fontsFolder = app.isPackaged
        ? path.join(process.resourcesPath, 'public', 'fonts')
        : path.join(__dirname, 'public', 'fonts');
    require('fs').readdir(fontsFolder, (err, files) => {
        if (err) return res.status(500).send('Unable to read font files');
        res.json(files);
    });
});

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
