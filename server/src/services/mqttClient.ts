import fs from "fs";
import path from "path";
import mqtt from "mqtt";
import WebSocket from "ws";

// Active WebSocket clients for real-time updates
const clients: WebSocket[] = [];

// Latest values per Modbus topic
export const latestValues: { [key: string]: any } = {};

// Load Modbus topic configuration
const modbusConfigPath = path.join(
  __dirname,
  "../PLC.Config/modbusTopics.json"
);
const modbusConfig = JSON.parse(fs.readFileSync(modbusConfigPath, "utf-8"));

// MQTT connection
export const mqttClient = mqtt.connect("mqtt://127.0.0.1:1883");

mqttClient.on("connect", () => {
  console.log("✓ MQTT connected to broker");

  // Subscribe to configured topics
  modbusConfig.modbus.registers.forEach((register: any) => {
    mqttClient.subscribe(register.topic, (err) => {
      if (err) {
        console.error(`✗ Failed to subscribe to ${register.topic}:`, err);
      } else {
        console.log(`→ Subscribed to ${register.topic}`);
      }
    });
  });
});

// Handle incoming MQTT messages and forward via WebSocket
mqttClient.on("message", (topic, message) => {
  const value = message.toString();

  const matched = modbusConfig.modbus.registers.find(
    (r: any) => r.topic === topic
  );

  if (matched) {
    latestValues[matched.name] = value;
    sendToClients(latestValues);
  }
});

// Send latest values to all connected WebSocket clients
const sendToClients = (payload: Record<string, any>) => {
  clients.forEach((ws) => ws.send(JSON.stringify(payload)));
};

// Add a new WebSocket client
export const addClient = (ws: WebSocket): void => {
  clients.push(ws);
};
