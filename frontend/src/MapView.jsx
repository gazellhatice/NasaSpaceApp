// src/MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Tooltip, CircleMarker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = (color = "#0b3d91") =>
  new L.DivIcon({
    className: "custom-pin",
    html: `<div class="pin" style="background:${color}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
  });

function ClickPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick && onPick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

export default function MapView({
  lat, lon, onPick, markerColor = "#0b3d91",
  tooltipText = "", heatPoints = [], showClouds = false
}) {
  const center = [lat, lon];

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="map-root">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Cloud overlay (CSS anim) */}
        {showClouds && <div className="cloud-overlay" />}

        {/* Heat map: station densities */}
        {heatPoints.map((p, idx) => {
          // radius and color according to density
          const intensity = Math.max(0, Math.min(300, p.intensity));
          const r = 10 + (intensity / 300) * 30; // 10..40 px
          const color =
            intensity <= 50 ? "#2ecc71" :
            intensity <= 100 ? "#f1c40f" :
            intensity <= 150 ? "#e67e22" :
            intensity <= 200 ? "#e74c3c" : "#8e44ad";
          return (
            <CircleMarker
              key={idx}
              center={[p.lat, p.lon]}
              radius={r}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.25, opacity: 0.6 }}
            />
          );
        })}

        {/* User PIN */}
        <Marker position={center} icon={markerIcon(markerColor)}>
          {tooltipText && <Tooltip direction="top">{tooltipText}</Tooltip>}
        </Marker>

        <ClickPicker onPick={onPick} />
      </MapContainer>
    </div>
  );
}
