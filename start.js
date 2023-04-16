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
  // window.openDevTools();

  ipcMain.on("minimize", function (event, data) {
    window.minimize();
  });
  ipcMain.on("Close", function (event, data) {
    window.close();
  });

  // window.webContents.on("did-finish-load", function () {
  //   const contentSize = window.getContentSize();
  //   console.log(contentSize);
  //   const width = contentSize[0];
  //   const height = contentSize[1];
  //   window.setSize(width, height);
  // });
});
