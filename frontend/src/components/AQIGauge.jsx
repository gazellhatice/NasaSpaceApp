import React from "react";

export default function AQIGauge({ value = 0 }) {
  const v = Math.max(0, Math.min(300, Number(value) || 0));
  const pct = v / 300; // 0..1
  const dash = 440; // stroke length
  const filled = dash * pct;

  const color =
    v <= 50 ? "#2ecc71" :
    v <= 100 ? "#f1c40f" :
    v <= 150 ? "#e67e22" :
    v <= 200 ? "#e74c3c" : "#8e44ad";

  return (
    <div className="gauge">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="70" stroke="#222" strokeWidth="16" fill="none" opacity="0.2" />
        <circle
          cx="90" cy="90" r="70"
          stroke={color} strokeWidth="16" fill="none"
          strokeDasharray={`${filled} ${dash}`}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="95" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff">{Math.round(v)}</text>
        <text x="90" y="120" textAnchor="middle" fontSize="12" fill="#ccc">AQI</text>
      </svg>
    </div>
  );
}
