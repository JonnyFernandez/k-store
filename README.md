# ⚡ K-Store — Configuración con Electron

Esta guía explica cómo ejecutar y empaquetar tu aplicación K-Store, que combina:

🧠 Backend: Node.js (API Express)

💻 Frontend: React + Vite

🪟 Escritorio: Electron

## _Estructura del Proyecto:_

```
k-store/
├── api/
│   ├── src/
│   │   └── index.js         # Punto de entrada del backend
│   ├── package.json         # Contiene "start": "node src/index.js"
│
├── client/
│   ├── src/                 # Código del frontend (React)
│   ├── package.json         # Contiene "start": "vite"
│
├── index.js                 # Punto de entrada de Electron
└── package.json             # Package principal que orquesta todo

```

## 🚀 Scripts disponibles

🔧 1. Iniciar en modo desarrollo: `npm start`

Este comando:

Levanta el servidor backend (api/src/index.js)

Levanta el frontend de Vite (http://localhost:5173)

Abre la ventana de Electron apuntando al frontend

💡 Si ves una pantalla en blanco, espera unos segundos hasta que Vite termine de iniciar.\*

## 2. Empaquetar la aplicación (modo producción)

- Primero, genera el build del frontend:

```
cd client
npm run build
cd ..
```

-Luego, instala el empaquetador de Electron:

```
`npm install --save-dev electron-packager`
```

-Y ejecuta:

```
npm run package
```

Esto generará una versión ejecutable de tu aplicación para escritorio en la carpeta dist/.

## 🧩 Archivo principal: index.js (Electron)

```
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let apiProcess;

const isDev = !app.isPackaged; // Detecta si estamos en desarrollo

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173' // App servida por Vite en dev
    : `file://${path.join(__dirname, 'client/dist/index.html')}`; // App empaquetada en prod

  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', () => (mainWindow = null));

  if (isDev) mainWindow.webContents.openDevTools(); // DevTools solo en desarrollo
};

// Iniciar backend (API)
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
  if (apiProcess) apiProcess.kill(); // Cierra el backend al cerrar la app
});

```

## 🧰 Scripts recomendados en package.json principal

```
{
  "scripts": {
    "dev:client": "npm run start --prefix client",
    "dev:api": "npm run start --prefix api",
    "start": "concurrently \"cross-env BROWSER=none npm run dev:client\" \"npm run dev:api\" \"wait-on http://localhost:5173 && electron .\"",
    "package": "npm run build --prefix client && electron-packager . k-store --platform=win32 --arch=x64 --out=dist --overwrite"
  }
}
```
