let ws = false;

const conectarConServidor = () => {
  let sip = document.getElementById("serverip").value;
  let sp = document.getElementById("serverport").value;
  ws = new WebSocket(`ws://${sip}:${sp}`);
  ws.onopen = () => {
    console.log("Conexión establecida");
  };
  ws.onmessage = message => {
    document.getElementById("conexion-establecida").innerHTML = message.data;
  };
};

const enviaTexto = event => {
  if (ws) ws.send(event.value[event.value.length - 1]);
};

document.addEventListener(
  "deviceready",
  () => {
    console.log("dev ready");

    window.addEventListener(
      "volumebuttonslistener",
      ev => {
        if (ws) {
          ws.send(
            ev.signal === "volume-down"
              ? document.getElementById("accion-voldown").value
              : document.getElementById("accion-volup").value
          );
        }
        return false;
      },
      false
    );
  },
  false
);
