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
  const [openaq, setOpenAQ] = useState([]); // heatmap için istasyonlar
  const [selectedGranuleIdx, setSelectedGranuleIdx] = useState(0);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      // Backend: AirNow + TEMPO
      const d = await fetchCombined(coords.lat, coords.lon, date);
      setData(d);

      // Open-Meteo: anlık hava durumu
      const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=auto`;
      const wxResp = await fetch(wxUrl);
      const wxData = await wxResp.json();
      setWeather(wxData.current || null);

      // OpenAQ: yakın istasyonlardan ısı haritası noktaları
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
    load(); /* ilk yükleme */
  }, []);
  const airnow = data?.airnow;

  // TEMPO granüllerini zaman çizelgesine hazırlama
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

  // Isı haritası noktaları (OpenAQ verisinden normalize yoğunluk)
  const heatPoints = useMemo(() => {
    if (!openaq.length) return [];
    return openaq.map((it) => {
      const aqiLike = normalizeToAQI(it.parameter, it.value);
      return {
        lat: it.coordinates.latitude,
        lon: it.coordinates.longitude,
        intensity: aqiLike, // 0-300 arası kullanacağız
      };
    });
  }, [openaq]);

  // Parametre ölçümünü AQI-benzeri skala 0..300’a yaklaştır (basit normalize)
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

  // Recharts için AirNow veri dönüştürme
  const airnowSeries = airnow?.aqi
    ? Object.entries(airnow.aqi).map(([k, v]) => ({ name: k, value: v }))
    : [];

  // Seçili granül detayını göster
  const activeGranule = tempoGranules[selectedGranuleIdx] || null;

  return (
    <div className="dashboard pro">
      <header className="dashboard-header glass">
        <div className="branding">
          <h1>🚀 TEMPO Assistant</h1>
          <p>
            Real-time air quality intelligence dashboard with NASA TEMPO +
            AirNow + OpenAQ + Open-Meteo.
          </p>
        </div>
        <div className="header-actions">
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
            <button className="btn-primary" onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
          <div className="badges">
            <span className="badge ok">TEMPO</span>
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
      <div className="top-grid">
        <div className="card big-card">
          <div className="big-card-left">
            <div className="aqi-top">
              <AQIGauge value={bestAQI ?? 0} />
              <div className="aqi-meta">
                <div
                  className="aqi-number"
                  style={{ color: aqiColor(bestAQI) }}
                >
                  {bestAQI ?? "—"}
                </div>
                <div className="aqi-advisory">{advisory}</div>
                {weather && (
                  <div className="wx-line">
                    🌤 {weather.temperature_2m}°C · 💨 {weather.windspeed_10m}{" "}
                    m/s · 💧 {weather.relative_humidity_2m}%
                  </div>
                )}
                {airnowSeries.length > 1 && (
                  <div className="aqi-trend-line">
                    {(() => {
                      const trend =
                        airnowSeries[airnowSeries.length - 1].value -
                        airnowSeries[0].value;
                      if (trend < 0)
                        return (
                          <p>
                            🌤 AQI improved by {Math.abs(trend)} points since
                            yesterday.
                          </p>
                        );
                      if (trend > 0)
                        return (
                          <p>
                            ⚠️ AQI increased by {trend} points since yesterday.
                          </p>
                        );
                      return (
                        <p>😌 AQI remains stable compared to yesterday.</p>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="big-card-right">
            <AIExplanationCard
              aqi={bestAQI}
              airnow={airnow}
              weather={weather}
              openaq={openaq}
            />
            <VoiceAssistant
              aqi={bestAQI}
              advisory={advisory}
              cityHint={airnow?.reportingArea || "your area"}
            />
          </div>
        </div>

        <div className="map-card pro-map">
          <h3>🗺️ Interactive Map — Heatmap + Clouds</h3>
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
      </div>
      <div className="card health-wide">
        <HealthAdvice aqi={bestAQI} />
      </div>

      {airnow?.aqi && (
        <div className="cards-grid">
          <div className="card">
            <h3>AirNow Parameters</h3>
            <ul className="kv">
              {Object.entries(airnow.aqi).map(([k, v]) => (
                <li key={k}>
                  <span>{k}</span>
                  <b>{v}</b> <small>{airnow.category[k]}</small>
                </li>
              ))}
            </ul>

            <h4>AQI Trend</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={airnowSeries}>
                <CartesianGrid stroke="#334" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0b3d91"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

            <h4>AQI Comparison</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={airnowSeries}>
                <CartesianGrid stroke="#334" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f1c40f" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>🛰️ TEMPO Granules</h3>
            <p>Found: {tempoGranules.length}</p>

            <GranuleTimelineSlider
              items={tempoTimeline}
              value={selectedGranuleIdx}
              onChange={setSelectedGranuleIdx}
            />

            {activeGranule ? (
              <div className="granule-box">
                <div className="granule-title">{activeGranule.title}</div>
                <div className="granule-time">
                  {new Date(activeGranule.time_start).toLocaleString()} →{" "}
                  {new Date(activeGranule.time_end).toLocaleString()}
                </div>
              </div>
            ) : (
              <p>📡 No TEMPO data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
