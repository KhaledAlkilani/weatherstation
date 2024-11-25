import WebSocket from "ws";
import { addClient } from "./mqttClient";

// Setup WebSocket server to handle incoming connections
export const setupWebSocketServer = (wss: WebSocket.Server) => {
  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    // Add new WebSocket client to the list to receive future updates
    addClient(ws);

    // Send initial connection message to the client
    ws.send(JSON.stringify({ message: "Connected to WebSocket server" }));

    // Handle WebSocket disconnections
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
