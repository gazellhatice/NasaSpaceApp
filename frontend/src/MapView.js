import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickToSet({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

export default function MapView({ lat, lon, onPick }) {
  const [center] = useState([lat, lon]);
  return (
    <MapContainer center={center} zoom={10} style={{ height: 380, width: "100%", borderRadius: 12 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[lat, lon]} icon={markerIcon}>
        <Popup>
          Selected Location <br /> {lat.toFixed(4)}, {lon.toFixed(4)}
        </Popup>
      </Marker>
      <ClickToSet onPick={onPick} />
    </MapContainer>
  );
}
