
const net = require("net");
const kyber = require("./kyber512");
const wireguard = require("./wireguard");
const AES_GCM = require("./AES_GCM");
const exec = require("child_process").exec;
const ClientWireguardKeyPair = wireguard.wireguardKeypair.generateKeypair();
const ClientWgPublicKey = ClientWireguardKeyPair.publicKey;
const ClientWgPrivateKey = ClientWireguardKeyPair.privateKey;
const onOffImg = document.querySelector(".on_off img");
let Encapsulation_C = "";
let SharedSecret = "";
let timekyberkeygen = "t";
let client_publickeyKyber = "t"
let client_privatekeyKyber = "t"
let theServerKyberPK = "";// wait for the server to send the public key

// To generate a public and private key pair (pk, sk) using kyber



function connect() {
  console.log("connect")
 /* executeCommand('/home/marrok/Desktop/HK-Wireguard/js/HK_Client/kyberWithC/avx2/example')
    .then((stdout) => {
      keypair = stdout.split('@@');
      timekyberkeygen = keypair[0];
      client_publickeyKyber = Buffer.from(keypair[1], 'hex')
      client_privatekeyKyber = Buffer.from(keypair[2], 'hex')

     

    })
    .catch((error) => {
      console.log(error);
    });*/
    const publickey_privatekey = kyber.KeyGen512();
    const client_publickeyKyber= publickey_privatekey[0];
    const client_privatekeyKyber = publickey_privatekey[1];
    const client = net.createConnection({ host: "206.189.18.1", port: 8080, highWaterMark: 4000 }, async () => {

      client.write(Buffer.from(client_publickeyKyber)); // client start send the  kyber public key to the server
    });

    client.on("data", async (data) => {
      if (data.length == 800) { // if the data length is 800 then it is the server kyber public key
        theServerKyberPK = data; //  put the server kyber public key in the variable
      } else if (data.length == 768) { //  if the data length is 768 then it is the encapsulation

        Encapsulation_C = data; //  put the encapsulation in the variable

        SharedSecret = kyber.Decrypt512(Encapsulation_C, client_privatekeyKyber); // genrate the shared secret using the encapsulation and the client private key

        const encryptedClientWgPublicKey = AES_GCM.encryptAES_GCM(ClientWgPublicKey, SharedSecret); // encrypt the Client wg public key using the shared secret

        const encryptedClientWgPublicKeytoSend = Buffer.concat([encryptedClientWgPublicKey.encrypted, Buffer.from("|:"),
        encryptedClientWgPublicKey.iv, Buffer.from("|:"),
        encryptedClientWgPublicKey.tag]);//  put the encrypted data, iv and tag in one buffer
        client.write(Buffer.from(encryptedClientWgPublicKeytoSend));
      } else if (data.length == 80) {
        const [encrypted, iv, tag] = Bufferspliter(data);

        const ServerWgPublicKey = AES_GCM.decryptAES_GCM(encrypted, SharedSecret, iv, tag); // decrypt the wg public key using the shared secret

        configureWireguardClient(ClientWgPrivateKey, ServerWgPublicKey, "206.189.18.1:52533", "52533", "0.0.0.0/0");
        onOffImg.src = "img/on.svg";
      }

    });

}
function disconnect() {

  exec("sudo wg-quick down PqWg1");
  console.log("disconnect")
  onOffImg.src = "img/off.svg";
}






function configureWireguardClient(clientPrivateKey, serverPublicKey, serverEndpoint, clientListenPort, allowedIPs) {

  //PostUp = iptables -A FORWARD -i ${clientWgInterface} -j ACCEPT; iptables -t nat -A POSTROUTING -o ${clientConnectedInterface} -j MASQUERADE
  // PostDown = iptables -D FORWARD -i ${clientWgInterface} -j ACCEPT; iptables -t nat -D POSTROUTING -o ${clientConnectedInterface}  -j MASQUERADE

  // Generate the WireGuard configuration file
  const wgConfig = `
[Interface]
PrivateKey = ${clientPrivateKey}
Address =10.160.0.2/24 # Replace with your chosen IP address
DNS = 8.8.8.8 # Replace with your desired DNS server(s)
ListenPort = ${clientListenPort}
SaveConfig = true
[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${serverEndpoint}
AllowedIPs = ${allowedIPs}
  `.trim();

  // Write the configuration file to disk
  exec(`sudo sh -c 'echo "${wgConfig}" > /etc/wireguard/PqWg1.conf'`);
  // Enable IP forwarding
  exec("sudo sed -i s/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/g /etc/sysctl.conf");
  exec("sudo sysctl -p");
  // Start the WireGuard interface using wg-quick
  exec("sudo wg-quick up PqWg1");
}
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}


function Bufferspliter(data) {

  const separator = Buffer.from("|:");
  const parts = [];
  let start = 0;
  for (let i = 0; i < data.length; i++) {
    if (data.slice(i, i + separator.length).equals(separator)) {
      parts.push(data.slice(start, i));
      start = i + separator.length;
    }
  }
  if (start < data.length) {
    parts.push(data.slice(start));
  }
  return parts;
}
exports.connect = connect;
exports.disconnect = disconnect;
