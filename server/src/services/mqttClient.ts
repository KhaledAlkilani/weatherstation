import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import mqtt from "mqtt";
import WebSocket from "ws";

// --- Configuration-driven MQTT to WebSocket bridge ---
// This service subscribes to all MQTT topics defined in the config file,
// keeps the latest value for each key, and broadcasts updates to all connected WebSocket clients.

// Holds all active WebSocket clients for real-time updates.
const clients: WebSocket[] = [];

// MongoDB setup for optional data persistence (example: WeatherStation database).
const mongoURI = "mongodb://localhost:27017/WeatherStation";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Example schema for weather data (can be extended for other data types).
const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const Weather = mongoose.model("Weather", weatherSchema);

// Load MQTT topics from config file.
const configPath = path.join(__dirname, "../config/mqttTopics.json");
const mqttTopics: Record<string, any> = JSON.parse(
  fs.readFileSync(configPath, "utf-8")
);

// Recursively extract all topic strings from config.
const extractTopics = (obj: any): string[] => {
  const topics: string[] = [];
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      topics.push(obj[key]);
    } else if (typeof obj[key] === "object") {
      topics.push(...extractTopics(obj[key]));
    }
  }
  return topics;
};
const allTopics = extractTopics(mqttTopics);

// Connect to MQTT broker and subscribe to all topics from config.
const mqttClient = mqtt.connect("mqtt://172.16.2.141:1883");
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  allTopics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (err) console.error(`Failed to subscribe to ${topic}`);
      else console.log(`Subscribed to ${topic}`);
    });
  });
});

// Stores the latest value for each key defined in the config.
export const latestValues: { [key: string]: any } = {};

// Handle incoming MQTT messages and update latestValues map.
mqttClient.on("message", (topic, message) => {
  console.log(`⟵ MQTT on ${topic}: ${message}`);
  let parsed: any;
  try {
    parsed = JSON.parse(message.toString());
  } catch {
    return;
  }

  // Find the config key for this topic and update its value.
  for (const sec of Object.values(mqttTopics)) {
    for (const key of Object.keys(sec as object)) {
      if ((sec as any)[key] === topic) {
        latestValues[key] = parsed[key] ?? parsed;
      }
    }
  }

  // Broadcast the updated map to all clients.
  sendToClients(latestValues);
});

// Broadcasts the latest values to all connected WebSocket clients.
const sendToClients = (payload: Record<string, any>) => {
  clients.forEach((ws) => ws.send(JSON.stringify(payload)));
};

// Adds a new WebSocket client to the clients array.
export const addClient = (ws: WebSocket): void => {
  clients.push(ws);
};

// Optional: Ensures the MQTT client stays connected.
export const startMqttClient = (): void => {
  mqttClient.on("connect", () => {
    console.log("MQTT Client connected");
  });
};
