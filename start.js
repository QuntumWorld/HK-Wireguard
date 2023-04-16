const { app, BrowserWindow, ipcMain } = require("electron");

app.whenReady().then(() => {
  const window = new BrowserWindow({
    resizable: false,
    frame: false,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // enableRemoteModule: true, // add this line
      // devTools: true, // add this line for open dev console
    },
  });

  window.loadFile("index.html");

  ipcMain.on("minimize", function (event, data) {
    window.minimize();
  });
  ipcMain.on("Close", function (event, data) {
    window.close();
  });

  
});
