#!/usr/bin/node

let port =
  process.argv.indexOf("--port") >= 0 &&
  process.argv[process.argv.indexOf("--port") + 1]
    ? process.argv[process.argv.indexOf("--port") + 1]
    : 8080;

const os = require("os");
const ifaces = os.networkInterfaces();
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({
  port: port
});
const ks = require("node-key-sender");

let ipActual = "";

Object.keys(ifaces).forEach(ifname => {
  let alias = 0;
  ifaces[ifname].forEach(iface => {
    if ("IPv4" !== iface.family || iface.internal !== false) return;
    if (alias < 1) ipActual = iface.address;
    ++alias;
  });
});

console.log(`Servidor corriendo en ws://${ipActual}:${port}`);

wss.on("connection", (ws, req) => {
  console.log(
    `Conexión establecida con id: '${req.headers["sec-websocket-key"]}'`
  );
  ws.send(`Conexión establecida con id: '${req.headers["sec-websocket-key"]}'`);

  ws.on("message", message => {
    console.log("received: %s", message);
    ks.sendKey(message);
  });
});
