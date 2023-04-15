const electron = require("electron");
const { app, BrowserWindow } = electron;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true, // add this line
      devTools: false, // add this line
    },
  });

  mainWindow.setMenuBarVisibility(false); // add this line
  mainWindow.loadFile("index.html");

  mainWindow.webContents.on("did-finish-load", function () {
    const contentSize = mainWindow.getContentSize();
    console.log(contentSize);
    const width = contentSize[0] + 145;
    const height = contentSize[1];

    mainWindow.setSize(width, height);
  });
}
app.on("ready", function () {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Code to set up your VPN interface using your VPN library goes here.
