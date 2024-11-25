import mongoose from "mongoose";
import mqtt from "mqtt";
import WebSocket from "ws";

const clients: WebSocket[] = [];

// MongoDB connection setup
const mongoURI = "mongodb://localhost:27017/WeatherStation";
// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Weather data schema
const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Weather = mongoose.model("Weather", weatherSchema);

const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("weather/temperature", (err) => {
    if (err) {
      console.error("Error subscribing to weather/temperature topic:", err);
    } else {
      console.log("Subscribed to weather/temperature topic");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  if (topic === "weather/temperature") {
    const payload = message.toString();

    try {
      // Attempt to parse the message as JSON
      const parsedData = JSON.parse(payload);

      // Check if the temperature field is available and is a valid number
      const temperature = parseFloat(parsedData.temperature);

      if (isNaN(temperature)) {
        console.error(
          "Received invalid temperature data:",
          parsedData.temperature
        );
      } else {
        console.log("Real-time Temperature received: ", temperature);

        // Save to MongoDB
        const newWeather = new Weather({
          temperature: temperature,
          humidity: parsedData.humidity,
        });

        newWeather
          .save()
          .then(() => {
            console.log("Weather data saved to MongoDB");
          })
          .catch((err) => {
            console.error("Error saving weather data to MongoDB:", err);
          });

        // Send the parsed temperature to all WebSocket clients
        clients.forEach((ws) => {
          ws.send(JSON.stringify({ temperature }));
        });
      }
    } catch (error) {
      console.error("Failed to parse incoming message:", payload);
    }
  }
});

// Add WebSocket client to the list for receiving updates
export const addClient = (ws: WebSocket) => {
  clients.push(ws);
};

// Start the MQTT client
export const startMqttClient = () => {
  mqttClient.on("connect", () => {
    console.log("MQTT Client connected");
  });
};
