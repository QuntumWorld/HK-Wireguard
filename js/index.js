const { ipcRenderer ,Menu } = require("electron");



const servers = require('./js/servers');
const { connect, disconnect } = require("./js/HK_Client/client");


const mini = document.querySelector(".btns .mini");
const closeWin = document.querySelector(".btns .close img");

const onOffImg = document.querySelector(".on_off img");
const burgerBtn = document.querySelector(".burger_btn");
const hideDrop =document.querySelector("#hideDrop");





// fill the table with severs name and ip
const tableBody = document.querySelector(".table_body");
servers.servers.forEach((server) => {
  const box = document.createElement("div");
  box.className = "box";
  const flag = document.createElement("i");
  flag.className = "flag " + server.flag;
  const countryName = document.createElement("span");
  countryName.textContent = server.name;
  const ip = document.createElement("p");
  ip.textContent = server.ip;

  box.appendChild(flag);
  box.appendChild(countryName);
  box.appendChild(ip);

  tableBody.appendChild(box);
});



// Add an event listener to each box element in the table
const boxElements = document.querySelectorAll(".box");
boxElements.forEach((box, index) => {
  // Get the server information for the current box
  const server = servers.servers[index];

  // Add an event listener to the box
  box.addEventListener("click", () => {
    // Update the container element with the corresponding server information
    const container = document.querySelector("div.body div.top div.container");
    // Find the "container" element

    // Clear any existing content
    container.innerHTML = "";

    // Create a new HTML string with the server information
    const htmlString = `
      <div class="title">
        <h2>${server.name}</h2>
        <h4>${server.name}</h4>
      </div>
      <div class="info">

      <div class="protocol">
      <h3>Wireguard</h3>
      <h5>PROTOCOL</h5>
    </div>
        <div class="ip">
          <h3>${server.ip}</h3>
          <h5>IP</h5>
        </div>
        <div class="on_off">
                <img src="img/off.svg" alt=""  id="on_off_button" />
              </div>
              <div class="upload">
                <h3>${server.upload_speed} MB/s</h3>
                <h5>UPLOAD</h5>
              </div>
              <div class="download">
                <h3>${server.download_speed}MB/s</h3>
                <h5>DOWNLOAD</h5>
              </div>
            </div>
      </div>
    `;

    // Set the HTML string as the content of the "container" element
    container.innerHTML = htmlString;
  });
});


// Define a function to toggle the state of the on/off button
function toggleOnOff() {
  // Get the current state of the button
  const isOff = onOffImg.src.endsWith("img/off.svg");
  console.log(isOff)

  // If the button is currently on, set it to off
  if (isOff) {
    // Connect to the HK_Client service
    connect();

  } else {
    // If the button is currently off, set it to on
    disconnect()

  }
}
function showDrop(){
  burgerBtn.innerHTML = "";
  const htmlForum=`
  <div id="drop_menu">
  <form action="#">
    <input type="text" placeholder="Interface name" />
    <input type="text" placeholder="Subnet range" />
    <button id= "hideDrop">Close</button>
  </form>
</div>
  `
 
  burgerBtn.innerHTML=htmlForum
  document.addEventListener("DOMContentLoaded", function() {
    hideDrop.addEventListener('click',hideDropMenu)
  });
  
}

function hideDropMenu(){
  console.log("test")
  const  temphtml=`<img src="img/Frame 462.png" alt="">`
  burgerBtn.innerHTML=temphtml;

}

// Add an event listener to the on/off button
onOffImg.addEventListener("click", toggleOnOff);

// Add an event listener to the close button
closeWin.addEventListener("click", () => {
  // Send a message to the main process to close the window
  
  ipcRenderer.send("Close");
});



burgerBtn.addEventListener('click',showDrop);



// Add an event listener to the minimize button
mini.addEventListener("click", () => {
  // Send a message to the main process to minimize the window
  ipcRenderer.send("minimize");
});


