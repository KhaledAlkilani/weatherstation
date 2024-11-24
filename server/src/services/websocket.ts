// import { IncomingMessage } from "http";
// import { Duplex } from "stream";
// import { WebSocketServer } from "ws";
// import WebSocket from "ws";

// export const websocketClients = new Set<WebSocket>();

// const setupWebSocket = (server: any) => {
//   const wss = new WebSocketServer({ noServer: true });

//   wss.on("connection", (ws) => {
//     websocketClients.add(ws);
//     console.log("New WebSocket client connected.");

//     ws.on("close", () => {
//       websocketClients.delete(ws);
//       console.log("WebSocket client disconnected.");
//     });
//   });

//   // Handle WebSocket upgrades
//   server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
//     wss.handleUpgrade(req, socket, head, (ws) => {
//       wss.emit("connection", ws, req);
//     });
//   });

//   return wss;
// };

// export default setupWebSocket;

// import { IncomingMessage } from "http";
// import { Duplex } from "stream";
// import { WebSocketServer } from "ws";
// import WebSocket from "ws";

// export const websocketClients = new Set<WebSocket>();

// const setupWebSocket = (server: any) => {
//   const wss = new WebSocketServer({ noServer: true });

//   wss.on("connection", (ws) => {
//     websocketClients.add(ws);
//     console.log("New WebSocket client connected.");

//     ws.on("close", () => {
//       websocketClients.delete(ws);
//       console.log("WebSocket client disconnected.");
//     });
//   });

//   // Handle WebSocket upgrades
//   server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
//     wss.handleUpgrade(req, socket, head, (ws) => {
//       wss.emit("connection", ws, req);
//       console.log(`Upgrade request received: ${req.url}`);
//     });
//   });

//   return wss;
// };

// export default setupWebSocket;

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

    // Listen for any messages from the client
    ws.on("message", (message: string) => {
      console.log("Received: ", message);
      // Handle specific WebSocket requests if needed (e.g., requesting temperature)
      if (message === "getTemperature") {
        // Send a mock temperature for the example, but in your case,
        // the real temperature will be pushed via MQTT
        ws.send(JSON.stringify({ temperature: "23.5°C" }));
      }
    });

    // Handle WebSocket disconnections
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
