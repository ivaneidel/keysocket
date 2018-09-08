const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8080 });
const { exec } = require("child_process");
const ks = require("node-key-sender");

wss.on("connection", function(ws) {
  console.log('Nueva conexion');
  ws.on("message", function(message) {
    console.log("received: %s", message);
    ks.sendCombination(["control", "t"]);
  });
});
