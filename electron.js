console.log('electron.js is being executed'); // Integrated log here

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const server = express();
const fs = require('fs'); // Import the fs module if you are using it.

console.log('Expected fonts folder in production:', path.join(__dirname, 'path_to_your_fonts_folder'));


let resourcesPath = app.isPackaged 
    ? path.join(app.getAppPath(), 'resources') 
    : __dirname;


console.log('Path to preload.js:', path.join(__dirname, 'preload.js'));

let mainWindow;
function createWindow() {
    console.log('createWindow function is being called');
    console.log('Path to preload.js:', path.join(__dirname, 'preload.js'));

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [`isAppPackaged=${app.isPackaged}`, `resourcesPath=${resourcesPath}`],

        }
    });

    console.log('BrowserWindow has been created');
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    } else {
        mainWindow.loadURL('http://localhost:3000');
    }
    
    console.log('loadURL has been called');

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

// Handle 'get-fonts' ipc channel
ipcMain.handle('get-fonts', async (event) => {
    try {
        const fontsFolder = path.join(__dirname, 'public', 'fonts');
        const fonts = await fs.promises.readdir(fontsFolder);
        return fonts;
    } catch (err) {
        console.error('Error reading font files:', err);
        throw err; // This will be sent as an error to the renderer process
    }
});

// Set up the Express server only if the app is not packaged.
if (!app.isPackaged) {
    server.use('/public', express.static('public'));
    
    server.get('/fonts', (req, res) => {
        const fontsFolder = path.join(__dirname, 'public', 'fonts');
        fs.readdir(fontsFolder, (err, files) => {
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
}