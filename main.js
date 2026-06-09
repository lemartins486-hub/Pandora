const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

const USER_DOCS = path.join(os.homedir(), 'Documents', 'Pandora 2.0');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'logo.svg')
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  if (!fs.existsSync(USER_DOCS)) fs.mkdirSync(USER_DOCS, { recursive: true });

  createWindow();

  tray = new Tray(path.join(__dirname, 'assets', 'logo.svg'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir Pandora', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Sair', role: 'quit' }
  ]);
  tray.setToolTip('Pandora 2.0');
  tray.setContextMenu(contextMenu);

  const ok = globalShortcut.register('F6', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send('hotkey-pressed', 'F6');
    }
  });
  if (!ok) console.warn('Falha ao registrar atalho global F6');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
