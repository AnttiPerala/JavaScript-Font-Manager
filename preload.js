const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js is loaded');

contextBridge.exposeInMainWorld('electron', {
    getFonts: async () => {
        // If getFonts is asynchronous, you may want to use ipcRenderer.invoke
        return ipcRenderer.invoke('get-fonts');
    },
    getResourcesPath: () => {
        const resourcesPath = process.argv.find(arg => arg.startsWith('resourcesPath=')).split('=')[1];
        return resourcesPath;
    }
    // You can expose other functionalities here as well.
});
