import { useState, useEffect } from "react";
import { WeatherData } from "../models/WeatherModel";
import temperatureIcon from "../assets/temperature-icon.svg";
import { fetchTemperatureHistory } from "../services/apiServices";

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
  const [temperatureHistoryList, setTemperatureHistoryList] = useState<
    WeatherData[]
  >([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send("getTemperature");
    };

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.temperature && data.humidity) {
        setTemperature({
          temperature: data.temperature,
          humidity: data.humidity,
          timestamp: new Date().toISOString(),
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    // Fetch temperature history when the component mounts
    const fetchHistory = async () => {
      try {
        const data = await fetchTemperatureHistory();
        setTemperatureHistoryList(data);
      } catch (error) {
        console.error("Failed to fetch temperature history:", error);
      }
    };

    fetchHistory();

    // Set interval to fetch temperature history every 5 seconds
    const intervalId = setInterval(() => {
      fetchHistory();
    }, 5000); // 5000 ms = 5 seconds

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      ws.close();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={styles.title}>Weather Station</h1>
      {temperature ? (
        <div style={styles.temperatureAndIcon}>
          <img src={temperatureIcon} alt="Temperature icon" width={30} />
          <p style={styles.temperature}>
            Current Temperature: {temperature.temperature} °C
          </p>
          <p style={styles.humidity}>Humidity: {temperature.humidity} %</p>
        </div>
      ) : (
        <p style={{ color: "rgba(255, 255, 255, 0.87)" }}>
          Loading weather data...
        </p>
      )}
      {/* Show the temperature history */}
      <div style={styles.historyContainer}>
        <h2 style={styles.historyTitle}>Temperature History</h2>
        {temperatureHistoryList.length > 0 ? (
          <ul style={styles.historyList}>
            {temperatureHistoryList.map((entry, index) => (
              <li key={index} style={styles.historyItem}>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>:{" "}
                {entry.temperature} °C
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "white" }}>No temperature history available</p>
        )}
      </div>
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
  humidity: {
    fontSize: 22,
    color: "rgba(255, 255, 255, 0.87)",
  },
  historyContainer: {
    marginTop: 20,
    color: "white",
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
