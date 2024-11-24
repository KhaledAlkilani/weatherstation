import fs from "fs";
import { Request, Response } from "express";
// import { weatherDataCache } from "../services/mqttClient"; // Import the cached weather data

// export const getWeatherData = (req: Request, res: Response) => {
//   fs.readFile("weatherData.json", "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading JSON file:", err);
//       return res.status(500).json({ error: "Failed to retrieve weather data" });
//     }
//     res.json(JSON.parse(data));
//   });
// };

// export const getWeatherData = (req: Request, res: Response): void => {
//   if (weatherDataCache.temperature !== null) {
//     res.json(weatherDataCache); // Send cached weather data
//   } else {
//     res.status(404).json({ error: "Weather data is not yet available" });
//   }
// };
