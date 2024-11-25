import { useState, useEffect } from "react";
import { WeatherData } from "../models/WeatherModel";
import temperatureIcon from "../assets/temperature-icon.svg";

const containerStyle: React.CSSProperties = {
  backgroundColor: "#242424",
  margin: "0 auto",
  padding: 0,
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

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
    <div style={containerStyle}>
      <h1 style={styles.title}>Weather Station</h1>
      {temperature ? (
        <div style={styles.temperatureAndIcon}>
          <img src={temperatureIcon} alt="Temperature icon" width={30} />
          <p style={styles.temperature}>
            Temperature: {temperature.temperature} °C
          </p>
        </div>
      ) : (
        <p style={{ color: "rgba(255, 255, 255, 0.87)" }}>
          Loading weather data...
        </p>
      )}
    </div>
  );
};

export default WeatherStation;

const styles = {
  temperatureAndIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  title: {
    color: "rgba(255, 255, 255, 0.87)",
    fontSize: "3.2em",
    lineHeight: 1.1,
  },
  temperature: {
    fontSize: 22,
    color: "rgba(255, 255, 255, 0.87)",
  },
};
