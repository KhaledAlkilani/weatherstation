import { useState, useEffect } from "react";
import { WeatherData } from "../models/WeatherModel";

const WeatherStation = () => {
  const [temperature, setTemperature] = useState<WeatherData | null>(null);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     // Create a function to fetch weather data and handle loading and errors
  //     const fetchWeatherData = () => {
  //       setLoading(true);
  //       getWeatherData()
  //         .then((data) => {
  //           setWeatherData(data);
  //           console.log(data);
  //           setError(null);
  //           setLoading(false);
  //         })
  //         .catch((error: any) => {
  //           setError(error.message || error);
  //           setLoading(false);
  //         });
  //     };

  //     // Set interval to fetch data every 5 seconds
  //     const interval = setInterval(fetchWeatherData, 2000);

  //     // Cleanup interval on component unmount
  //     return () => clearInterval(interval);
  //   }, []);

  //   useEffect(() => {
  //     const ws = createWebSocket(
  //       "ws://192.168.1.109:5000",
  //       (data: WeatherData) => {
  //         console.log("WebSocket received data:", data);
  //         setWeatherData(data);
  //         setError(null);
  //       },
  //       (error: string) => {
  //         console.error("WebSocket error:", error);
  //         setError(error);
  //       }
  //     );

  //     return () => {
  //       ws.close();
  //     };
  //   }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000"); // Connect to WebSocket server

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send("getTemperature"); // Request temperature from the server
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
