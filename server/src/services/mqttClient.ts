// import fs from "fs";
// import mqtt from "mqtt";
// import { websocketClients } from "./WebSocket";

// const MQTT_BROKER_URL = "mqtt://localhost:1883";
// const MQTT_TOPIC = "weather/data";

// const setupMQTT = () => {
//   const mqttClient = mqtt.connect(MQTT_BROKER_URL);

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     mqttClient.subscribe(MQTT_TOPIC, (err) => {
//       if (err) {
//         console.error("Error subscribing to MQTT topic:", err);
//       } else {
//         console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
//       }
//     });
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === MQTT_TOPIC) {
//       try {
//         const weatherData = JSON.parse(message.toString());
//         console.log("Received weather data:", weatherData);

//         // Save data to file
//         fs.writeFile(
//           "weatherData.json",
//           JSON.stringify(weatherData, null, 2),
//           (err) => {
//             if (err) {
//               console.error("Error saving weather data to file:", err);
//             } else {
//               console.log("Weather data successfully written to file.");
//             }
//           }
//         );

//         // Broadcast to WebSocket clients
//         const dataToSend = JSON.stringify(weatherData);
//         websocketClients.forEach((client) => {
//           client.send(dataToSend);
//         });
//       } catch (err) {
//         console.error("Error parsing MQTT message:", err);
//       }
//     }
//   });

//   return mqttClient;
// };

// export default setupMQTT;

// import fs from "fs";
// import mqtt from "mqtt";
// import { websocketClients } from "./WebSocket";

// const MQTT_BROKER_URL = "mqtt://192.168.1.109:1883";
// const MQTT_TOPIC = "weather/temperature";

// const setupMQTT = () => {
//   const mqttClient = mqtt.connect(MQTT_BROKER_URL);

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     mqttClient.subscribe(MQTT_TOPIC, (err) => {
//       if (err) {
//         console.error("Error subscribing to MQTT topic:", err);
//       } else {
//         console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
//       }
//     });
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === MQTT_TOPIC) {
//       try {
//         // Try to parse the incoming message
//         let weatherData;
//         const messageStr = message.toString();

//         // Check if the message is already JSON
//         try {
//           weatherData = JSON.parse(messageStr);
//         } catch (e) {
//           // If not JSON, create a JSON object
//           weatherData = { temperature: parseFloat(messageStr) };
//         }

//         // Validate the data
//         if (
//           typeof weatherData.temperature !== "number" ||
//           isNaN(weatherData.temperature)
//         ) {
//           throw new Error("Invalid temperature value");
//         }

//         console.log("Processed weather data:", weatherData);

//         // Save data to file
//         fs.writeFile(
//           "weatherData.json",
//           JSON.stringify(weatherData, null, 2),
//           (err) => {
//             if (err) {
//               console.error("Error saving weather data to file:", err);
//             } else {
//               console.log("Weather data successfully written to file.");
//             }
//           }
//         );

//         // Broadcast to WebSocket clients
//         const dataToSend = JSON.stringify(weatherData);
//         websocketClients.forEach((client) => {
//           if (client.readyState === client.OPEN) {
//             try {
//               client.send(dataToSend);
//             } catch (error) {
//               console.error("Failed to send data to WebSocket client:", error);
//             }
//           }
//         });
//       } catch (err) {
//         console.error(
//           "Error processing MQTT message:",
//           err,
//           "Raw message:",
//           message.toString()
//         );
//       }
//     }
//   });

//   return mqttClient;
// };

// export default setupMQTT;

// import fs from "fs";
// import mqtt from "mqtt";

// const MQTT_BROKER_URL = "mqtt://192.168.1.109:1883";
// const MQTT_TOPIC = "weather/temperature";

// let weatherDataCache: { temperature: number | null } = { temperature: null };

// const setupMQTT = () => {
//   const mqttClient = mqtt.connect(MQTT_BROKER_URL);

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     mqttClient.subscribe(MQTT_TOPIC, (err) => {
//       if (err) {
//         console.error("Error subscribing to MQTT topic:", err);
//       } else {
//         console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
//       }
//     });
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === MQTT_TOPIC) {
//       try {
//         let weatherData;
//         const messageStr = message.toString();

//         // Check if the message is already JSON
//         try {
//           weatherData = JSON.parse(messageStr);
//         } catch (e) {
//           // If not JSON, create a JSON object with temperature
//           weatherData = { temperature: parseFloat(messageStr) };
//         }

//         // Validate the data
//         if (
//           typeof weatherData.temperature !== "number" ||
//           isNaN(weatherData.temperature)
//         ) {
//           throw new Error("Invalid temperature value");
//         }

//         console.log("Processed weather data:", weatherData);

//         // Save data to file (optional)
//         fs.writeFile(
//           "weatherData.json",
//           JSON.stringify(weatherData, null, 2),
//           (err) => {
//             if (err) {
//               console.error("Error saving weather data to file:", err);
//             } else {
//               console.log("Weather data successfully written to file.");
//             }
//           }
//         );

//         // Cache the latest weather data for the REST API
//         weatherDataCache = weatherData;
//       } catch (err) {
//         console.error(
//           "Error processing MQTT message:",
//           err,
//           "Raw message:",
//           message.toString()
//         );
//       }
//     }
//   });

//   return mqttClient;
// };

// export default setupMQTT;

// export { weatherDataCache };

// import fs from "fs";
// import mqtt from "mqtt";

// // MQTT Broker settings
// const MQTT_BROKER_URL = "mqtt://192.168.1.109:1883";
// const MQTT_TOPIC = "weather/temperature";

// // Cache to store weather data
// let weatherDataCache: { temperature: number | null } = { temperature: null };

// const setupMQTT = () => {
//   const mqttClient = mqtt.connect(MQTT_BROKER_URL);

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     mqttClient.subscribe(MQTT_TOPIC, (err) => {
//       if (err) {
//         console.error("Error subscribing to MQTT topic:", err);
//       } else {
//         console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
//       }
//     });
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === MQTT_TOPIC) {
//       try {
//         let weatherData;
//         const messageStr = message.toString();

//         // Check if the message is already JSON
//         try {
//           weatherData = JSON.parse(messageStr);
//         } catch (e) {
//           // If not JSON, parse the message as a temperature value
//           weatherData = { temperature: parseFloat(messageStr) };
//         }

//         // Validate the temperature data
//         if (
//           typeof weatherData.temperature !== "number" ||
//           isNaN(weatherData.temperature)
//         ) {
//           throw new Error("Invalid temperature value");
//         }

//         console.log("Processed weather data:", weatherData);

//         // Update cached weather data
//         weatherDataCache = weatherData;

//         // Optional: Save the data to a file (you can remove this if unnecessary)
//         fs.writeFile(
//           "weatherData.json",
//           JSON.stringify(weatherData, null, 2),
//           (err) => {
//             if (err) {
//               console.error("Error saving weather data to file:", err);
//             } else {
//               console.log("Weather data saved to file.");
//             }
//           }
//         );
//       } catch (err) {
//         console.error(
//           "Error processing MQTT message:",
//           err,
//           "Raw message:",
//           message.toString()
//         );
//       }
//     }
//   });

//   return mqttClient;
// };

// export default setupMQTT;
// export { weatherDataCache }; // Export cached data for use in REST API

// import fs from "fs";
// import mqtt from "mqtt";

// // MQTT Broker settings
// const MQTT_BROKER_URL = "mqtt://192.168.1.109:1883";
// const MQTT_TOPIC = "weather/temperature";

// // Cache to store weather data
// let weatherDataCache: { temperature: number | null } = { temperature: null };

// const setupMQTT = () => {
//   const mqttClient = mqtt.connect(MQTT_BROKER_URL);

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     mqttClient.subscribe(MQTT_TOPIC, (err) => {
//       if (err) {
//         console.error("Error subscribing to MQTT topic:", err);
//       } else {
//         console.log(`Subscribed to MQTT topic: ${MQTT_TOPIC}`);
//       }
//     });
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === MQTT_TOPIC) {
//       try {
//         let weatherData;
//         const messageStr = message.toString();

//         // Check if the message is already JSON
//         try {
//           weatherData = JSON.parse(messageStr);
//         } catch (e) {
//           // If not JSON, parse the message as a temperature value
//           weatherData = { temperature: parseFloat(messageStr) };
//         }

//         // Validate the temperature data
//         if (
//           typeof weatherData.temperature !== "number" ||
//           isNaN(weatherData.temperature)
//         ) {
//           throw new Error("Invalid temperature value");
//         }

//         console.log("Processed weather data:", weatherData);

//         // Update cached weather data
//         weatherDataCache = weatherData;

//         // Optional: Save the data to a file (you can remove this if unnecessary)
//         fs.writeFile(
//           "weatherData.json",
//           JSON.stringify(weatherData, null, 2),
//           (err) => {
//             if (err) {
//               console.error("Error saving weather data to file:", err);
//             } else {
//               console.log("Weather data saved to file.");
//             }
//           }
//         );
//       } catch (err) {
//         console.error(
//           "Error processing MQTT message:",
//           err,
//           "Raw message:",
//           message.toString()
//         );
//       }
//     }
//   });

//   return mqttClient;
// };

// export default setupMQTT;
// export { weatherDataCache }; // Export cached data for use in REST API

import mqtt from "mqtt";
import WebSocket from "ws";

const clients: WebSocket[] = [];

const mqttClient = mqtt.connect("mqtt://192.168.1.109:1883");

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
