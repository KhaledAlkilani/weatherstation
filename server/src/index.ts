import app from "./app";
import { Server } from "http";
import WebSocket from "ws";
import { startMqttClient } from "./services/mqttClient";
import { setupWebSocketServer } from "./services/websocket";

const port = 5000;

const server: Server = app.listen(port, () => {
  console.log(`Server listening on http://172.16.1.144:${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });
setupWebSocketServer(wss);

// Start MQTT Client
startMqttClient();
