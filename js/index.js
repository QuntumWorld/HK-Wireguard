const { ipcRenderer } = require("electron");

const mini = document.querySelector(".btns .mini");
const closeWin = document.querySelector(".btns .close img");

closeWin.addEventListener("click", function () {
  ipcRenderer.send("Close", "someData");
});

mini.addEventListener("click", function () {
  // ipc.send("Close", "someData"); you cand send data
  ipcRenderer.send("minimize");
});
