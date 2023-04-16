const { ipcRenderer } = require("electron");

const mini = document.querySelector(".btns .mini");
const closeWin = document.querySelector(".btns .close img");



const onOffImg = document.querySelector(".on_off img");

onOffImg.addEventListener("click", function () {
  if (onOffImg.src.endsWith("img/off.svg")) {
    onOffImg.src = "img/on.svg";
  } else {
    onOffImg.src = "img/off.svg";
  }
});




closeWin.addEventListener("click", function () {
  ipcRenderer.send("Close", "someData");
});

mini.addEventListener("click", function () {
  // ipc.send("Close", "someData"); you cand send data
  ipcRenderer.send("minimize");
});
