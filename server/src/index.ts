import app from "./app";
import { Server } from "http";
import WebSocket from "ws";
import { setupWebSocketServer } from "./services/websocket";
import { startModbusPolling } from "./services/modbusReader";

const port = 5000;

const server: Server = app.listen(port, () => {
  console.log(`Server listening on http://127.0.0.1:${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });
setupWebSocketServer(wss);

startModbusPolling();
