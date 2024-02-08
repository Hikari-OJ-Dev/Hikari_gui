const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadURL: (url) => ipcRenderer.send("load-url", url),
  sendMessage: (message) => ipcRenderer.sendSync(message),
  onMessage: (channel, message) => ipcRenderer.on(channel, message),
});
