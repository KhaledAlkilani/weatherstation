import { useState, useEffect } from "react";
import { WeatherData } from "../models/WeatherModel";
import weatherDataIcon from "../assets/temperature-icon.svg";
import humidityIcon from "../assets/humidity-icon.svg";

const API_URL = `ws://${window.location.hostname}:5000`;

const WeatherStation = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const ws = new WebSocket(API_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send("getweatherData");
    };

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      // Check if both weatherData and humidity are present
      if (data.temperature && data.humidity && data.pressure) {
        // Set weatherData for real-time display
        setWeatherData({
          temperature: data.temperature,
          humidity: data.humidity,
          pressure: data.pressure,
          timestamp: new Date().toISOString(),
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={styles.title}>Weather Station</h1>
      {weatherData ? (
        <div style={styles.weatherDataAndIcon}>
          <img src={weatherDataIcon} alt="weatherData icon" width={30} />
          <p style={styles.weatherData}>
            Current weatherData: {weatherData.temperature}
          </p>
          <img src={humidityIcon} alt="Humidity icon" width={30} />
          <p style={styles.humidity}>Humidity: {weatherData.humidity}</p>
          <img src={humidityIcon} alt="Humidity icon" width={30} />
          <p style={styles.humidity}>Pressure: {weatherData.pressure}</p>
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
  weatherDataAndIcon: {
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
  weatherData: {
    fontSize: 22,
    color: "rgba(255, 255, 255, 0.87)",
  },
  humidity: {
    fontSize: 22,
    color: "rgba(255, 255, 255, 0.87)",
  },
  historyTitle: {
    fontSize: "1.5em",
    color: "rgba(255, 255, 255, 0.87)",
  },
  historyList: {
    listStyleType: "none",
    padding: 0,
  },
  historyItem: {
    fontSize: "1.1em",
    marginBottom: 5,
  },
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#242424",
  margin: "0 auto",
  padding: 0,
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};
