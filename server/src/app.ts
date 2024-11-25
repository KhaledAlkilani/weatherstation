import express from "express";
import cors from "cors";
import { Weather } from "./services/mqttClient";

export const app = express();
const clientURL = "http://localhost:5173";

app.use(
  cors({
    origin: clientURL,
    methods: ["GET"],
  })
);

app.get("/api/temperature-history", async (req, res) => {
  try {
    // Fetch the last 10 temperature records, sorted by timestamp (most recent first)
    const temperatureHistory = await Weather.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(temperatureHistory);
  } catch (error) {
    console.error("Error fetching temperature history:", error);
    res.status(500).json({ message: "Error fetching temperature history" });
  }
});

export default app;
