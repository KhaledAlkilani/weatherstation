// MongoDB for saving weather data.
import mongoose from "mongoose";
// MQTT client for subscribing to topics and receiving messages.
import mqtt from "mqtt";
// WebSocket server client to handle communication with clients.
import WebSocket from "ws";

// Define the structure for weather data
interface WeatherData {
  temperature: number;
  humidity: number;
}

// Stores the most recent temperature and humidity values received from MQTT topics for use in WebSocket updates and database storage.
let weatherData: WeatherData = { temperature: 0, humidity: 0 };

// Clients array: Holds all active WebSocket clients connected to the server, such as web browser where we display received real-time weather data.
// Other websocket clients could be: mobile applications or IoT device that sends or receives data.
// These clients will receive real-time updates on weather data.
const clients: WebSocket[] = [];

// MongoDB connection setup
// Connects to the MongoDB database to store weather data (WeatherStation database).
const mongoURI = "mongodb://localhost:27017/WeatherStation";
// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Weather data schema
// Defines the MongoDB schema for storing weather data, including temperature, humidity, and timestamp.
const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Weather = mongoose.model("Weather", weatherSchema);

// Creates a connection to the MQTT broker using the provided IP address
const mqttClient = mqtt.connect("mqtt://172.16.1.144:1883");

// Connect to MQTT and subscribe to topics
// Listens for the successful connection to the MQTT broker
// and subscribes to weather/temperature and weather/humidity topics.
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  mqttClient.subscribe("weather/temperature", (err) => {
    if (err) {
      console.error("Error subscribing to weather/temperature topic:", err);
    } else {
      console.log("Subscribed to weather/temperature topic");
    }
  });

  mqttClient.subscribe("weather/humidity", (err) => {
    if (err) {
      console.error("Error subscribing to weather/humidity topic:", err);
    } else {
      console.log("Subscribed to weather/humidity topic");
    }
  });
});

// Handles incoming messages from the subscribed MQTT topics. It parses the message data and updates tempData and humidityData accordingly.
// Once both temperature and humidity are received, it sends the data to WebSocket clients and saves it in the MongoDB database.
mqttClient.on("message", (topic, message) => {
  const payload = message.toString();
  try {
    const parsedData: WeatherData = JSON.parse(payload);

    if (topic === "weather/temperature" && parsedData.temperature) {
      // Initialize or update the weather data object
      weatherData = {
        ...weatherData, // Preserve previous data
        temperature: parsedData.temperature, // Update temperature
      };
    }

    if (topic === "weather/humidity" && parsedData.humidity) {
      // Update humidity if received
      weatherData = {
        ...weatherData,
        humidity: parsedData.humidity, // Update humidity
      };
    }

    // Ensure both temperature and humidity are available
    if (
      weatherData &&
      weatherData.temperature &&
      weatherData.humidity !== undefined
    ) {
      // Send data to clients
      sendToClients(weatherData.temperature, weatherData.humidity);

      // Save the data to MongoDB
      const newWeatherData = new Weather({
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        timestamp: new Date(),
      });

      newWeatherData
        .save()
        .then(() => {
          console.log("Weather data saved to database:", {
            temperature: weatherData?.temperature,
            humidity: weatherData?.humidity,
          });
        })
        .catch((err) => {
          console.error("Error saving weather data to database:", err);
        });
    }
  } catch (error) {
    console.error("Failed to parse incoming message:", payload);
  }
});

// Function to send data to WebSocket clients
// Sends the temperature and humidity data to all connected WebSocket clients.
const sendToClients = (temperature: number, humidity: number): void => {
  clients.forEach((ws) => {
    ws.send(JSON.stringify({ temperature, humidity }));
  });
};

// Add WebSocket client to the list for receiving updates
// Adds a new WebSocket client to the clients array when a new client connects.
export const addClient = (ws: WebSocket): void => {
  clients.push(ws);
};

// Start the MQTT client
// A placeholder function that logs when the MQTT client is connected, ensuring the MQTT client stays connected.
export const startMqttClient = (): void => {
  mqttClient.on("connect", () => {
    console.log("MQTT Client connected");
  });
};
