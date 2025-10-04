import React from "react";
import "./HealthAdvice.css";

export default function HealthAdvice({ aqi }) {
  const getAdvice = (aqi) => {
    if (aqi == null) return null;
    if (aqi <= 50)
      return {
        health: "Air is clean — perfect for deep breathing or meditation.",
        sport: "Great time for outdoor runs, cycling, or nature walks.",
        nutrition: "Stay hydrated and eat fresh fruits & vegetables.",
        home: "Open your windows to refresh indoor air."
      };
    if (aqi <= 100)
      return {
        health: "Air quality is moderate — sensitive individuals stay aware.",
        sport: "Light outdoor exercise is fine; avoid long intense sessions.",
        nutrition: "Eat foods rich in vitamin C and E (orange, almonds, spinach).",
        home: "Ventilate rooms during morning hours."
      };
    if (aqi <= 150)
      return {
        health: "Unhealthy for sensitive groups — asthma or heart patients should limit outdoor exposure.",
        sport: "Prefer indoor workouts: yoga, stretching, or pilates.",
        nutrition: "Include antioxidant-rich foods (green tea, berries, broccoli).",
        home: "Use an air purifier if possible; keep plants indoors."
      };
    if (aqi <= 200)
      return {
        health: "Unhealthy — avoid prolonged outdoor activity.",
        sport: "Switch to indoor fitness sessions.",
        nutrition: "Drink more water, add turmeric or ginger to meals.",
        home: "Keep windows closed during peak hours; use HEPA filters."
      };
    return {
      health: "Hazardous! Stay indoors and monitor your health.",
      sport: "No outdoor activity recommended.",
      nutrition: "Consume antioxidant-rich meals; avoid processed food.",
      home: "Run an air purifier and keep windows sealed."
    };
  };

  const advice = getAdvice(aqi);
  if (!advice) return null;

  return (
    <div className="health-advice">
      <h3>🌿 Personalized Health & Wellness Tips</h3>
      <div className="advice-grid">
        <div className="advice-card">
          <h4>🩺 Health</h4>
          <p>{advice.health}</p>
        </div>
        <div className="advice-card">
          <h4>🏃‍♀️ Sport</h4>
          <p>{advice.sport}</p>
        </div>
        <div className="advice-card">
          <h4>🥗 Nutrition</h4>
          <p>{advice.nutrition}</p>
        </div>
        <div className="advice-card">
          <h4>🏡 Home</h4>
          <p>{advice.home}</p>
        </div>
      </div>
    </div>
  );
}
