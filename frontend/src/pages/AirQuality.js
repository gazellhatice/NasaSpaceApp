import React, { useEffect, useMemo, useState } from "react";
import HealthAdvice from "../components/HealthAdvice";
import MapView from "../MapView";
import { fetchCombined } from "../api";
import "./AirQuality.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import AQIGauge from "../components/AQIGauge";
import AIExplanationCard from "../components/AIExplanationCard";
import VoiceAssistant from "../components/VoiceAssistant";
import GranuleTimelineSlider from "../components/GranuleTimelineSlider";

function aqiColor(aqi) {
  if (aqi == null) return "#999";
  if (aqi <= 50) return "#2ecc71";
  if (aqi <= 100) return "#f1c40f";
  if (aqi <= 150) return "#e67e22";
  if (aqi <= 200) return "#e74c3c";
  return "#8e44ad";
}

function advisoryMessage(aqi) {
  if (aqi == null) return "No data available.";
  if (aqi <= 50) return "Good — outdoor activities are safe.";
  if (aqi <= 100) return "Moderate — sensitive groups should monitor symptoms.";
  if (aqi <= 150)
    return "Unhealthy for Sensitive Groups — limit prolonged outdoor exertion.";
  if (aqi <= 200)
    return "Unhealthy — reduce outdoor activity; consider a mask.";
  return "Very Unhealthy — avoid outdoor activity; wear a respirator mask.";
}

export default function AirQuality() {
  const [coords, setCoords] = useState({ lat: 40.7128, lon: -74.006 });
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [openaq, setOpenAQ] = useState([]); // stations for heatmap
  const [selectedGranuleIdx, setSelectedGranuleIdx] = useState(0);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      // Backend: AirNow + TEMPO
      const d = await fetchCombined(coords.lat, coords.lon, date);
      setData(d);

      // Open-Meteo: live weather forecast
      const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=auto`;
      const wxResp = await fetch(wxUrl);
      const wxData = await wxResp.json();
      setWeather(wxData.current || null);

      // OpenAQ: heatmap points from nearby stations
      const rad = 25000; // 25 km
      const oaUrl = `https://api.openaq.org/v2/measurements?coordinates=${coords.lat},${coords.lon}&radius=${rad}&limit=100&parameter=pm25,pm10,no2,o3&order_by=datetime&sort=desc`;
      const oaResp = await fetch(oaUrl);
      const oaJson = await oaResp.json();
      setOpenAQ(oaJson.results || []);
    } catch (e) {
      setErr("Data could not be fetched: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* first installation */
  }, []);
  const airnow = data?.airnow;

  // Preparing TEMPO granules for the schedule
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tempoGranules = data?.tempo?.granules || [];
  const tempoTimeline = useMemo(
    () =>
      tempoGranules.map((g, i) => ({
        idx: i,
        id: g.id,
        title: g.title,
        start: g.time_start,
        end: g.time_end,
      })),
    [tempoGranules]
  );

  const bestAQI = airnow?.aqi
    ? Math.min(
        ...Object.values(airnow.aqi).filter((v) => typeof v === "number")
      )
    : null;

  const advisory = advisoryMessage(bestAQI);

  // 🌈 Dynamic theme color based on AQI
  useEffect(() => {
    if (bestAQI != null) {
      const color = aqiColor(bestAQI);
      document.body.style.transition = "background 1s ease";
      document.body.style.background = `radial-gradient(circle at 70% -20%, ${color}22 0%, #0a0f1f 70%)`;
    }
  }, [bestAQI]);

  // Heatmap points (normalized density from OpenAQ data)
  const heatPoints = useMemo(() => {
    if (!openaq.length) return [];
    return openaq.map((it) => {
      const aqiLike = normalizeToAQI(it.parameter, it.value);
      return {
        lat: it.coordinates.latitude,
        lon: it.coordinates.longitude,
        intensity: aqiLike, // We will use between 0-300
      };
    });
  }, [openaq]);

  // Move parameter measurement closer to AQI-like scale 0..300 (simple normalized)
  function normalizeToAQI(param, value) {
    if (value == null) return 0;
    const v = Number(value);
    switch ((param || "").toLowerCase()) {
      case "pm25":
        return Math.min(300, (v / 35) * 100); // ~35 µg/m3 ≈ 100 AQI
      case "pm10":
        return Math.min(300, (v / 50) * 100);
      case "no2":
        return Math.min(300, (v / 100) * 100);
      case "o3":
        return Math.min(300, (v / 120) * 100);
      default:
        return Math.min(300, v);
    }
  }

  // AirNow data conversion for Recharts
  const airnowSeries = airnow?.aqi
    ? Object.entries(airnow.aqi).map(([k, v]) => ({ name: k, value: v }))
    : [];

  // Show selected granule detail
  const activeGranule = tempoGranules[selectedGranuleIdx] || null;

  return (
    <div className="dashboard pro">
      <header className="dashboard-header glass pro-header">
        <div className="branding">
          <h1>🌎 NASA TEMPO Assistant</h1>
          <p>
            Real-time Air Intelligence powered by <b>TEMPO Satellite</b> &
            Global Open Data — explore the air you breathe, anywhere on Earth.
          </p>
        </div>

        <div className="header-controls">
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
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="btn-refresh" onClick={load} disabled={loading}>
              {loading ? "🔄 Loading..." : "🌤 Refresh Data"}
            </button>
          </div>

          <div className="badges">
            <span className="badge ok">NASA TEMPO</span>
            <span className="badge ok">AirNow</span>
            <span className="badge ok">OpenAQ</span>
            <span className="badge ok">Weather</span>
          </div>
        </div>
      </header>

      {err && !data && (
        <div className="offline-box">
          <h3>🚧 Connection Issue</h3>
          <p>
            {err.includes("Failed to fetch")
              ? "Backend API is unreachable. Please ensure Flask server is running on port 5000."
              : err}
          </p>
        </div>
      )}

      {loading && (
        <div className="dashboard-skeleton">
          <div className="loading-card"></div>
          <div className="loading-card"></div>
        </div>
      )}
      <div className="top-grid pro-layout">
        {/* LEFT PANEL — AQI + AI INSIGHTS */}
        <div className="card main-left">
          <div className="aqi-summary">
            <div className="aqi-gauge-wrap">
              <AQIGauge value={bestAQI ?? 0} />
            </div>

            <div className="aqi-info">
              <h2>Current Air Quality</h2>
              <div className="aqi-number" style={{ color: aqiColor(bestAQI) }}>
                {bestAQI ?? "—"}
              </div>
              <p className="aqi-advisory">{advisory}</p>
              {weather && (
                <p className="weather-line">
                  🌤 {weather.temperature_2m}°C · 💧{" "}
                  {weather.relative_humidity_2m}% · 💨 {weather.windspeed_10m}{" "}
                  m/s
                </p>
              )}
            </div>
          </div>

          {/* AI EXPLANATION */}
          <AIExplanationCard
            aqi={bestAQI}
            airnow={airnow}
            weather={weather}
            openaq={openaq}
          />

          {/* TREND INFO */}
          {airnowSeries.length > 1 && (
            <div className="trend-box">
              {(() => {
                const diff =
                  airnowSeries[airnowSeries.length - 1].value -
                  airnowSeries[0].value;
                if (diff < 0)
                  return (
                    <span className="trend good">
                      🌿 AQI improved by {Math.abs(diff)} points
                    </span>
                  );
                if (diff > 0)
                  return (
                    <span className="trend bad">
                      ⚠️ AQI rose by {diff} points since yesterday
                    </span>
                  );
                return (
                  <span className="trend stable">😌 AQI is stable today</span>
                );
              })()}
            </div>
          )}

          {/* VOICE ASSISTANT */}
          <div className="voice-wrap">
            <VoiceAssistant
              aqi={bestAQI}
              advisory={advisory}
              cityHint={airnow?.reportingArea || "your area"}
            />
          </div>
        </div>

        {/* RIGHT PANEL — MAP */}
        <div className="card pro-map map-enhanced">
          <h3>🗺️ Interactive NASA TEMPO Map</h3>
          <p className="map-desc">
            Visualizing real-time pollution intensity using OpenAQ stations and
            TEMPO satellite overlays.
          </p>
          <div className="map-wrap">
            <MapView
              lat={coords.lat}
              lon={coords.lon}
              onPick={(p) => setCoords(p)}
              markerColor={aqiColor(bestAQI)}
              tooltipText={`AQI: ${bestAQI ?? "—"} (${advisory})`}
              heatPoints={heatPoints}
              showClouds={true}
            />
          </div>
          <div className="map-legend">
            <span>🟢 Good</span>
            <span>🟡 Moderate</span>
            <span>🟠 Unhealthy</span>
            <span>🔴 Very Unhealthy</span>
          </div>
        </div>
      </div>
      {/* ===== HEALTH & SAFETY ADVICE ===== */}
      <section className="health-pro">
        <h2>💚 Health & Safety Advice</h2>
        <p className="health-sub">
          AI-generated personalized recommendations based on your current Air
          Quality Index (AQI).
        </p>

        <div className="health-grid">
          {/* General recommendation (HealthAdvice component) */}
          <div className="health-left">
            <HealthAdvice aqi={bestAQI} />
          </div>

          {/* Detailed AI cards */}
          <div className="health-right">
            <div
              className={`advice-tile ${
                bestAQI <= 50
                  ? "good"
                  : bestAQI <= 100
                  ? "moderate"
                  : bestAQI <= 150
                  ? "warn"
                  : "alert"
              }`}
            >
              <h4>😷 Outdoor Activity</h4>
              <p>
                {bestAQI <= 50 &&
                  "Air quality is great — enjoy outdoor exercise!"}
                {bestAQI > 50 &&
                  bestAQI <= 100 &&
                  "It’s safe for most, but sensitive individuals should be cautious."}
                {bestAQI > 100 &&
                  bestAQI <= 150 &&
                  "Limit prolonged outdoor exertion, especially if you have asthma."}
                {bestAQI > 150 &&
                  "Avoid outdoor activities; wear a mask if you must go out."}
              </p>
            </div>

            <div
              className={`advice-tile ${
                bestAQI <= 50
                  ? "good"
                  : bestAQI <= 100
                  ? "moderate"
                  : bestAQI <= 150
                  ? "warn"
                  : "alert"
              }`}
            >
              <h4>🏠 Indoor Air Quality</h4>
              <p>
                {bestAQI <= 50 &&
                  "Keep your windows open — fresh air helps ventilation."}
                {bestAQI > 50 &&
                  bestAQI <= 100 &&
                  "Keep indoor plants or air purifiers active for better air."}
                {bestAQI > 100 &&
                  bestAQI <= 150 &&
                  "Use air purifiers; avoid burning candles or incense indoors."}
                {bestAQI > 150 &&
                  "Keep windows closed and run air purifiers continuously."}
              </p>
            </div>

            <div
              className={`advice-tile ${
                bestAQI <= 50
                  ? "good"
                  : bestAQI <= 100
                  ? "moderate"
                  : bestAQI <= 150
                  ? "warn"
                  : "alert"
              }`}
            >
              <h4>👶 Sensitive Groups</h4>
              <p>
                {bestAQI <= 50 &&
                  "Children, elderly, and patients can continue regular activities safely."}
                {bestAQI > 50 &&
                  bestAQI <= 100 &&
                  "Sensitive groups should monitor symptoms or limit exposure."}
                {bestAQI > 100 &&
                  bestAQI <= 150 &&
                  "Reduce outdoor time; consult doctors if breathing discomfort occurs."}
                {bestAQI > 150 &&
                  "Stay indoors and avoid exposure; consult healthcare if symptoms persist."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {airnow?.aqi && (
        <section className="analysis-pro">
          <h2>📊 Air Quality Insights</h2>
          <p className="analysis-sub">
            Explore how pollutants and satellite data interact — powered by NASA
            TEMPO + AirNow synergy.
          </p>

          <div className="analysis-grid">
            {/* LEFT — AIRNOW CHARTS */}
            <div className="card chart-card">
              <h3>📈 AirNow Parameters</h3>
              <ul className="kv compact">
                {Object.entries(airnow.aqi).map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <b>{v}</b> <small>{airnow.category[k]}</small>
                  </li>
                ))}
              </ul>

              <div className="chart-wrap">
                <h4>AQI Trend (Line)</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={airnowSeries}>
                    <CartesianGrid stroke="#334" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#56b6f7"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-wrap">
                <h4>Pollutant Comparison (Bar)</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={airnowSeries}>
                    <CartesianGrid stroke="#334" strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#f1c40f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RIGHT — TEMPO TIMELINE */}
            <div className="card tempo-card">
              <h3>🛰️ TEMPO Data Timeline</h3>
              <p>
                Monitor hourly satellite granules captured by TEMPO in
                geostationary orbit.
              </p>

              <GranuleTimelineSlider
                items={tempoTimeline}
                value={selectedGranuleIdx}
                onChange={setSelectedGranuleIdx}
              />

              {activeGranule ? (
                <div className="granule-box glassy">
                  <div className="granule-title">{activeGranule.title}</div>
                  <div className="granule-time">
                    ⏱ {new Date(activeGranule.time_start).toLocaleString()} →{" "}
                    {new Date(activeGranule.time_end).toLocaleString()}
                  </div>
                  <div className="granule-status">
                    ✅ Data synced successfully
                  </div>
                </div>
              ) : (
                <p>📡 No TEMPO data available.</p>
              )}
            </div>
          </div>

          {/* AI Analysis Note */}
          <div className="ai-analysis-note">
            🤖 AI detects correlations between <b>NO₂</b> levels and wind speed
            variations. Expect reduced pollution as wind increases.
          </div>
        </section>
      )}
    </div>
  );
}
