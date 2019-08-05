let port =
  process.argv.indexOf("--port") >= 0 &&
  process.argv[process.argv.indexOf("--port") + 1]
    ? process.argv[process.argv.indexOf("--port") + 1]
    : 2806;

const os = require("os");
const ifaces = os.networkInterfaces();
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({
  port: port
});
const ks = require("node-key-sender");
const robot = require("robotjs");

let ipActual = "";

Object.keys(ifaces).forEach(ifname => {
  let alias = 0;
  ifaces[ifname].forEach(iface => {
    if ("IPv4" !== iface.family || iface.internal !== false) return;
    if (alias < 1) ipActual = iface.address;
    ++alias;
  });
});

const moveMouse = (x, y) => {
  let mousePos = robot.getMousePos();
  robot.moveMouse(mousePos.x - x, mousePos.y - y);
};

const getBatteryPercentage = callback => {
  const { exec } = require("child_process");
  exec(
    "acpi | awk '{print $4}' | awk -F '%,' '{print $1}'",
    (err, stdout, stderr) => {
      if (err) {
        return;
      }
      // console.log(`stderr: ${stderr}`);
      callback(stderr ? stderr : stdout ? stdout : false);
    }
  );
};

console.log(`Servidor corriendo en ws://${ipActual}:${port}`);

wss.on("connection", (ws, req) => {
  console.log(`Conexión ID: '${req.headers["sec-websocket-key"]}'`);
  ws.send(
    JSON.stringify({
      type: "CONNECTION_START",
      message: `Conexión ID: '${req.headers["sec-websocket-key"]}'`,
      id: `${req.headers["sec-websocket-key"]}`
    })
  );

  ws.on("message", message => {
    console.log(message);

    const parametros = message.split(",");
    const tipoEvento = parametros.splice(0, 1)[0];
    // console.log(tipoEvento);
    if (tipoEvento === "teclado") {
      const combinacion = parametros.splice(-1, 1)[0];
      if (parametros.length >= 2 && combinacion) {
        ks.sendCombination(parametros);
      } else {
        ks.sendKey(parametros[0]);
      }
    } else if (tipoEvento === "mouse") {
      if (parametros[0] === "click") {
        if (parametros[1] && parametros[1] === "right") {
          robot.mouseClick("right");
        } else {
          robot.mouseClick();
        }
      } else {
        moveMouse(parseInt(parametros[0]), parseInt(parametros[1]));
      }
    } else if (tipoEvento === "getBatteryPercentage") {
      getBatteryPercentage(val => {
        ws.send(
          JSON.stringify({
            type: "BATTERY_PCTG",
            message: val.trim()
          })
        );
      });
    }
    // console.log(parametros);
  });
});
