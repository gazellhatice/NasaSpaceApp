import React, { useState } from "react";
import { fetchForecast } from "../api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import AQIGauge from "../components/AQIGauge";
import AIExplanationCard from "../components/AIExplanationCard";
import "./Forecast.css";

export default function Forecast() {
  const [coords, setCoords] = useState({ lat: 40.7128, lon: -74.006 });
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadForecast() {
    try {
      setError("");
      setLoading(true);
      const f = await fetchForecast(coords.lat, coords.lon, 6);
      setForecast(f);
    } catch (e) {
      console.error("Forecast error:", e);
      setError("⚠️ Forecast data could not be fetched.");
    } finally {
      setLoading(false);
    }
  }

  const latestAQI =
    forecast?.predictions && forecast.predictions.length > 0
      ? Math.round(forecast.predictions.slice(-1)[0].aqi_pred)
      : null;

  return (
    <div className="forecast-page-pro">
      {/* Header */}
      <header className="forecast-header-pro glassy">
        <h1>🚀 AQI Forecast Dashboard</h1>
        <p>
          Predicting air quality trends using{" "}
          <span className="tempo">NASA TEMPO</span> +{" "}
          <span className="airnow">AirNow</span> +{" "}
          <span className="ai">AI Insight</span> 🌍
        </p>
      </header>

      {/* Control Panel */}
      <div className="control-card-pro">
        <h3>🌍 Location Selection</h3>
        <div className="inputs">
          <input
            type="number"
            value={coords.lat}
            step="0.0001"
            onChange={(e) =>
              setCoords({ ...coords, lat: parseFloat(e.target.value) })
            }
            placeholder="Latitude"
          />
          <input
            type="number"
            value={coords.lon}
            step="0.0001"
            onChange={(e) =>
              setCoords({ ...coords, lon: parseFloat(e.target.value) })
            }
            placeholder="Longitude"
          />
          <button
            className={`btn-primary-pro ${loading ? "loading" : ""}`}
            onClick={loadForecast}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Forecast"}
          </button>
        </div>
      </div>

      {error && <div className="error-box-pro">{error}</div>}

      {forecast && (
        <div className="results-pro">
          {/* TOP SECTION */}
          <div className="forecast-top-grid">
            {/* Gauge */}
            <div className="gauge-card-pro">
              <h3>🌡️ Latest AQI</h3>
              <AQIGauge value={latestAQI ?? 0} />
              <p className="gauge-label">
                {latestAQI
                  ? `${latestAQI <= 50
                      ? "Good"
                      : latestAQI <= 100
                      ? "Moderate"
                      : latestAQI <= 150
                      ? "Unhealthy for Sensitive Groups"
                      : "Unhealthy"
                    }`
                  : "No data"}
              </p>
            </div>

            {/* AI Explanation */}
            <AIExplanationCard
              aqi={latestAQI}
              airnow={{
                aqi: { Forecast: latestAQI },
                category: {
                  Forecast:
                    latestAQI <= 50
                      ? "Good"
                      : latestAQI <= 100
                      ? "Moderate"
                      : latestAQI <= 150
                      ? "Unhealthy for Sensitive Groups"
                      : "Unhealthy",
                },
              }}
              weather={{
                temperature_2m: 21,
                windspeed_10m: 4.5,
                relative_humidity_2m: 60,
              }}
              openaq={[]}
            />
          </div>

          {/* Advisory */}
          <div className="advisory-box-pro">
            <h3>🩺 Health Advisory</h3>
            <p>{forecast.advisory || "No advisory available."}</p>
          </div>

          {/* Predictions */}
          <div className="predictions-card-pro">
            <h3>📊 Predictions (Next Hours)</h3>
            {forecast.predictions && forecast.predictions.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Predicted AQI</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.predictions.map((p, i) => (
                    <tr key={i}>
                      <td>
                        {new Date(p.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td
                        style={{
                          color:
                            p.aqi_pred <= 50
                              ? "#2ecc71"
                              : p.aqi_pred <= 100
                              ? "#f1c40f"
                              : p.aqi_pred <= 150
                              ? "#e67e22"
                              : "#e74c3c",
                        }}
                      >
                        {Math.round(p.aqi_pred)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>📡 No forecast predictions available.</p>
            )}
          </div>

          {/* Chart */}
          {forecast.predictions && forecast.predictions.length > 0 && (
            <div className="chart-card-pro">
              <h3>🌤 AQI Forecast Chart</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={forecast.predictions.map((p) => ({
                    time: new Date(p.ts).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    AQI: p.aqi_pred,
                  }))}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.1)"
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="time" stroke="#a0b9e2" />
                  <YAxis stroke="#a0b9e2" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,31,0.9)",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="AQI"
                    stroke="#56b6f7"
                    strokeWidth={3}
                    dot={{ fill: "#56b6f7", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
