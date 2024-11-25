import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Function to fetch the temperature history
export const fetchTemperatureHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/temperature-history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching temperature history:", error);
    throw error;
  }
};
