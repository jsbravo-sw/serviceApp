const WebSocket = require("ws");


/*
Tengan cuidado cuando un cliente se desconecta, pues notificarlo (aunque esté desconectado) no tiene sentido.
*/
function WebSocketUtils() {
  const wsu = {};
  let clients = [];

  wsu.setWebSocket = (server) => {
    console.log("Setting up WebSocket");
    const wss = new WebSocket.Server({ server });
    wss.on("connection", (ws) => {
      console.log("New Connection");
      clients.push(ws);
      console.log("Clients", clients.length);
    });
   ws.on('close', function close(ws) {
  console.log('disconnected');
     clients = clients.filter(e => e !== ws);
  });
    
  };

  wsu.notifyAll = (data) => {
    console.log("notify all", clients.length);
    clients.forEach((ws) => ws.send(data));
  };
  return wsu;
}

module.exports = WebSocketUtils();
