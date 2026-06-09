const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pandoraAPI', {
  send: (channel, data) => {
    const valid = ['save-transcript', 'request-config'];
    if (valid.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return Promise.reject(new Error('Canal inválido'));
  },
  on: (channel, cb) => {
    const valid = ['hotkey-pressed'];
    if (valid.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    }
  }
});
