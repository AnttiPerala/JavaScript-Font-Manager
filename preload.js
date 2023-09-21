console.log('preload.js is loaded');


const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    isAppPackaged: process.argv.includes('--isAppPackaged=true')
});
