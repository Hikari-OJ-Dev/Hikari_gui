const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadURL: (url) => ipcRenderer.send("load-url", url),
  sendMessage: (message) => ipcRenderer.sendSync(message),
  send:(channel, data) => ipcRenderer.sendSync(channel, data),
  onMessage: (channel, message) => ipcRenderer.on(channel, message),
});
