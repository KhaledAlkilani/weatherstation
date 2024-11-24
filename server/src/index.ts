

// const PORT = 5000;

// // Start the HTTP server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://192.168.1.109:${PORT}`);
// });

// Setup WebSocket
// setupWebSocket(server);

// Setup MQTT client
// setupMQTT();

// import app from "./app";
// import setupWebSocket from "./services/WebSocket";
// import setupMQTT from "./services/mqttClient";

// const PORT = 5000;

// // Start the HTTP server
// const server = app.listen(PORT, () => {
//   console.log(`Server is running on http://192.168.1.109:${PORT}`);
// });

// // Setup WebSocket
// setupWebSocket(server);

// // Setup MQTT client
// setupMQTT();

import app from "./app";
import { Server } from "http";
import WebSocket from "ws";
import { startMqttClient } from "./services/mqttClient";
import { setupWebSocketServer } from "./services/WebSocket";

const port = 5000;

const server: Server = app.listen(port, () => {
  console.log(`Server listening on http://192.168.1.109:${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });
setupWebSocketServer(wss);

// Start MQTT Client
startMqttClient();
