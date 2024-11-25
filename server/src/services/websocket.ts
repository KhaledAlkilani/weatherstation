// Import the WebSocket library and a function (addClient) to manage a list of connected clients, defined in mqttClient.ts.
import WebSocket from "ws";
import { addClient } from "./mqttClient";

// Setup WebSocket server to handle incoming connections
// Define a function to initialize the WebSocket server and handle incoming WebSocket connections.
export const setupWebSocketServer = (wss: WebSocket.Server) => {
  // Listen for new WebSocket client connections. When a client connects, this code runs.
  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    // Add new WebSocket client to the list to receive future updates
    // Add the newly connected WebSocket client to a list (managed by mqttClient.ts) so the server can send real-time updates to all connected clients.
    addClient(ws);

    // Send initial connection message to the client
    // Confirm to the client that the connection was successful by sending an initial message.
    ws.send(JSON.stringify({ message: "Connected to WebSocket server" }));

    // Handle WebSocket disconnections
    // Log a message when a client disconnects from the WebSocket server.
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
