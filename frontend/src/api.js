// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Flask backend
});

// Combined data
export async function fetchCombined(lat, lon, date = null) {
  const params = { lat, lon };
  if (date) params.date = date;
  const { data } = await api.get("/combined", { params });
  return data;
}

// Forecast data
export async function fetchForecast(lat, lon, horizon = 6) {
  const params = { lat, lon, horizon };
  const { data } = await api.get("/forecast", { params });
  return data;
}
