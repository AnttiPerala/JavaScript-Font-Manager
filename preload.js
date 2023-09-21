const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js is loaded');

contextBridge.exposeInMainWorld('electron', {
    getFonts: async () => {
        // If getFonts is asynchronous, you may want to use ipcRenderer.invoke
        return ipcRenderer.invoke('get-fonts');
    },
    // You can expose other functionalities here as well.
});
