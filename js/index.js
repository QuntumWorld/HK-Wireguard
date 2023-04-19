const { ipcRenderer } = require("electron");

const { connect, disconnect } = require("./js/HK_Client/client");

const mini = document.querySelector(".btns .mini");
const closeWin = document.querySelector(".btns .close img");

const onOffImg = document.querySelector(".on_off img");

// Define a function to toggle the state of the on/off button
function toggleOnOff() {
  // Get the current state of the button
  const isOn = onOffImg.src.endsWith("img/on.svg");

  // If the button is currently on, set it to off
  if (isOn) {
    // Connect to the HK_Client service
     connect();
    onOffImg.src = "img/off.svg";
  } else {
    // If the button is currently off, set it to on
    onOffImg.src = "img/on.svg";
  }
}

// Add an event listener to the on/off button
onOffImg.addEventListener("click", toggleOnOff);

// Add an event listener to the close button
closeWin.addEventListener("click", () => {
  // Send a message to the main process to close the window
  ipcRenderer.send("Close");
});

// Add an event listener to the minimize button
mini.addEventListener("click", () => {
  // Send a message to the main process to minimize the window
  ipcRenderer.send("minimize");
});

