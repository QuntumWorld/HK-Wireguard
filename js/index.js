const { ipcRenderer } = require("electron");
const servers = require('./js/servers');
const { connect, disconnect } = require("./js/HK_Client/client");
const notifier = require('node-notifier');

document.addEventListener("DOMContentLoaded", function() {

const mini = document.querySelector(".btns .mini");
const closeWin = document.querySelector(".btns .close img");
const onOffImg = document.querySelector(".on_off img");
const burgerBtn = document.querySelector(".burger_btn");
// fill the table with severs name and ip
const tableBody = document.querySelector(".table_body");
let hideDrop;

addServersToTable(servers, tableBody);

// Add an event listener for btn buttons
onOffImg.addEventListener("click", toggleOnOff);
// Add an event listener to the minimize button
mini.addEventListener("click", () => ipcRenderer.send("minimize"));
// Add an event listener to the close button
closeWin.addEventListener("click",()=> ipcRenderer.send("Close"));

burgerBtn.addEventListener('click',showDrop);




// Define a function to toggle the state of the on/off button
function toggleOnOff() {
  console.log("turn on clicked")
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

  // your form submission code here
});

function addServersToTable(servers, tableBody) {
  servers.servers.forEach((server) => {
    const box = document.createElement("div"); box.className = "box";
    const flag = document.createElement("i");  flag.className = "flag " + server.flag;
    const countryName = document.createElement("span"); countryName.textContent = server.name;
    const ip = document.createElement("p"); ip.textContent = server.ip;
    box.appendChild(flag);
    box.appendChild(countryName);
    box.appendChild(ip);
    tableBody.appendChild(box);

    // Add an event listener to the box
    box.addEventListener("click", () => {
      // Update the container element with the corresponding server information
      const container = document.querySelector("div.body div.top div.container");
      // Clear any existing content
      container.innerHTML = "";

      // Create a new HTML string with the server information
      const  VPNinfohtml = `
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
      `;

      // Set the HTML string as the content of the "container" element
      container.innerHTML = VPNinfohtml;
    });
  });
}
/*
// handling the drop menu button
const htmlForum = `
  <div id="drop_menu">
    <form action="#">
      <input type="text" placeholder="Interface name" />
      <input type="text" placeholder="Subnet range" />
     <button type="button" class="btn btn-primary"><i class="bi bi-save"></i> Save</button>
      <button type="button" class="btn btn-secondary" id="hideDrop"><i class="bi bi-x"> close </i></button>
    </form>
  </div>
`;
const dropMenuBtnhtml=`<img src="img/Frame 462.png" alt="">`
function hideDropMenu(){
  setTimeout(() => {
    burgerBtn.innerHTML = dropMenuBtnhtml;
  }, 10);
}


*/
function showDrop(){
  /*burgerBtn.innerHTML = "";
  burgerBtn.innerHTML=htmlForum
  hideDrop=document.querySelector("#hideDrop");
  hideDrop.addEventListener('click',hideDropMenu)
  */
  notifier.notify({
    title: 'HK-Wireguard',
    message: 'the menu Comming soon',
    //icon: path.join(__dirname, 'coulson.jpg'), // path to the icon image
    sound: true, // plays a sound when the notification is displayed
    wait: true // waits for the user to click the notification before continuing
  });
}