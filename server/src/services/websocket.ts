import WebSocket from "ws";
import { addClient, latestValues } from "./mqttClient";

// Sets up the WebSocket server to broadcast the latest values for all configured MQTT topics.
export const setupWebSocketServer = (wss: WebSocket.Server) => {
  wss.on("connection", (ws) => {
    console.log("Client connected");
    addClient(ws);

    // Send the latest values for all topics to the newly connected client.
    ws.send(JSON.stringify({ ...latestValues }));

    ws.on("close", () => console.log("Client disconnected"));
  });
};
