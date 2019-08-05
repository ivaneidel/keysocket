let ws = false;
let upVolKey = false;
let posXStart = -1;
let posYStart = -1;

const conectarConServidor = () => {
  let sip = document.getElementById("serverip").value;
  let sp = document.getElementById("serverport").value;
  ws = new WebSocket(`ws://${sip}:${sp}`);
  ws.onopen = () => {
    console.log("Conexión establecida");
  };
  ws.onclose = () => {
    console.log("Conexión terminada");
    document.getElementById("conexion-establecida").innerHTML =
      "Conexión terminada";
  };
  ws.onmessage = ({ data }) => {
    const content = JSON.parse(data);
    if (content.type === "CONNECTION_START") {
      document.getElementById("conexion-establecida").innerHTML =
        content.message;
    } else if (content.type === "BATTERY_PCTG") {
      document.getElementById("batpctg").innerHTML = `${content.message}%`;
    }
  };
};

// const enviaTexto = event => {
//   if (ws) ws.send(event.value[event.value.length - 1]);
// };

const enviaBoton = (codigo, combinacion = false) => {
  if (ws) {
    if (!combinacion) upVolKey = codigo;
    ws.send(["teclado", codigo, combinacion]);
  }
};

const cerrarConexion = () => {
  if (ws) ws.close();
};

const touchInit = ev => {
  // console.log("Touch init");
  posXStart = ev.touches[0].clientX;
  posYStart = ev.touches[0].clientY;
};

const touchMove = ev => {
  // console.log(ev);
  // console.log(
  //   posXStart - ev.touches[0].clientX,
  //   posYStart - ev.touches[0].clientY
  // );
  if (ws)
    ws.send([
      "mouse",
      posXStart - ev.touches[0].clientX,
      posYStart - ev.touches[0].clientY
    ]);
};

const touchEnd = ev => {
  // console.log("Touch end");
};

const hacerClick = () => {
  if (ws) ws.send(["mouse", "click"]);
};

const getBatteryPercentage = () => {
  if (ws) ws.send("getBatteryPercentage");
};

const mostrarTeclado = () => {
  document.querySelector("#grilla-botones").style.display = "flex";
  document.querySelector("#hacer-click").style.display = "none";
  document.querySelector("#mouse-section").style.display = "none";
};
const mostrarMouse = () => {
  document.querySelector("#grilla-botones").style.display = "none";
  document.querySelector("#hacer-click").style.display = "flex";
  document.querySelector("#mouse-section").style.display = "flex";
};

document.addEventListener(
  "deviceready",
  () => {
    console.log("dev ready");

    // document.getElementById("accion-voldown").value
    // document.getElementById("accion-volup").value

    window.addEventListener(
      "volumebuttonslistener",
      ev => {
        if (ws) {
          ws.send(
            ev.signal === "volume-down"
              ? ["space", false]
              : [upVolKey ? upVolKey : "enter", false]
          );
        }
        return false;
      },
      false
    );
  },
  false
);
