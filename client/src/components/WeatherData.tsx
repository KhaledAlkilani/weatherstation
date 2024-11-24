import { useState, useEffect } from "react";
import { WeatherData } from "../models/WeatherModel";

const WeatherStation = () => {
  const [temperature, setTemperature] = useState<WeatherData | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send("getTemperature");
    };

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.temperature) {
        setTemperature(data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Weather Station</h1>
      {temperature ? (
        <div>
          <p>Temperature: {temperature.temperature} °C</p>
        </div>
      ) : (
        <p style={{ color: "white" }}>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherStation;
