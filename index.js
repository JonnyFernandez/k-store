const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let apiProcess;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged; // true si estamos en desarrollo

  const startUrl = isDev
    ? 'http://localhost:5173' // Vite dev server
    : `file://${path.join(__dirname, 'client/dist/index.html')}`;


  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', () => (mainWindow = null));
};

// 🔥 Iniciar backend antes del frontend
const startServer = () => {
  console.log('Iniciando servidor Node...');
  apiProcess = spawn('node', ['api/src/index.js'], {
    cwd: __dirname,
    env: process.env,
    stdio: 'inherit',
  });
};

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (apiProcess) apiProcess.kill();
});
