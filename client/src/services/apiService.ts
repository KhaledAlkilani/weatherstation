import axios, { AxiosError, AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.109:5000/api",
  timeout: 5000,
});

export async function getWeatherData() {
  try {
    const response: AxiosResponse = await apiClient.get("/weather");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error fetching weather data. ${err.response?.data}`);
  }
}

// export const createWebSocket = (
//   url: string,
//   onData: (data: any) => void,
//   onError: (error: any) => void
// ) => {
//   const ws = new WebSocket(url);
//   console.log(`Connecting to WebSocket: ${url}`);

//   ws.onopen = () => {
//     console.log("WebSocket connected.");
//   };

//   ws.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       onData(data);
//     } catch (error) {
//       onError("Error parsing WebSocket data");
//     }
//   };

//   ws.onerror = (error) => {
//     console.error("WebSocket error:", error);
//     onError(`WebSocket connection error: ${error}`);
//   };

//   ws.onclose = () => {
//     console.log("WebSocket connection closed.");
//   };

//   return ws;
// };
