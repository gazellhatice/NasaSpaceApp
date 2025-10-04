import React from "react";

export default function GranuleTimelineSlider({ items = [], value = 0, onChange }) {
  if (!items.length) return null;
  return (
    <div className="granule-slider">
      <input
        type="range"
        min={0} max={items.length - 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="granule-ticks">
        {items.map((it, i) => (
          <span key={it.id} className={`tick ${i === value ? "active" : ""}`} title={it.title}>
            {new Date(it.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        ))}
      </div>
    </div>
  );
}
