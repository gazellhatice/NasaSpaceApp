import React, { useMemo } from "react";

function trendText(airnow, weather, openaq) {
  if (!airnow?.aqi) return "Insufficient data to explain conditions.";
  const pm25 = airnow.aqi["PM2.5"];
  const no2 = airnow.aqi["NO2"] || airnow.aqi["NO₂"];
  const o3  = airnow.aqi["O3"]  || airnow.aqi["O₃"];

  const triggers = [];
  if (pm25 > 100) triggers.push("PM2.5 levels are high, likely from local combustion or stagnant air.");
  if (no2 > 80)   triggers.push("NO₂ is elevated — traffic or industrial emissions may be influencing air quality.");
  if (o3 > 100)   triggers.push("O₃ is high — sunny, warm conditions can intensify ozone formation.");

  if (weather?.windspeed_10m && weather.windspeed_10m > 6 && pm25 > 75) {
    triggers.push("Despite stronger winds, particulate levels remain elevated — possible regional transport.");
  }
  if (!triggers.length) return "Air quality is generally stable with no strong pollutant drivers detected.";
  return triggers.join(" ");
}

export default function AIExplanationCard({ aqi, airnow, weather, openaq }) {
  const text = useMemo(() => trendText(airnow, weather, openaq), [airnow, weather, openaq]);
  const tone = aqi <= 100 ? "ok" : aqi <= 150 ? "warn" : "alert";
  return (
    <div className={`card ai-card ${tone}`}>
      <h3>💬 AI Insight</h3>
      <p>{text}</p>
    </div>
  );
}
