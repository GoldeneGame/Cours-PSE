const { contextBridge, ipcRenderer } = require('electron');

const call = (name) => (...args) => ipcRenderer.invoke(name, ...args);

contextBridge.exposeInMainWorld('pse', {
  state: call('state'),
  setRoot: call('set-root'),
  list: call('list'),
  index: call('index'),
  openFile: call('open-file'),
  openLocal: call('open-local'),
  openExternal: call('open-external'),
  clearCache: call('clear-cache'),
  cacheSize: call('cache-size'),
  onStatus: (cb) => ipcRenderer.on('status', (_e, s) => cb(s)),
  // partie « Modules » : classes, enseignant, résultats
  jeux: (req) => ipcRenderer.invoke('jeux-api', req),
});
