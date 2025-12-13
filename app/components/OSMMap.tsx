"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});

export default function OSMMap({ pickup, dropoff }: any) {
  return (
    <MapContainer
      center={[pickup.lat, pickup.lon]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <Marker position={[pickup.lat, pickup.lon]} icon={markerIcon} />
      <Marker position={[dropoff.lat, dropoff.lon]} icon={markerIcon} />

      {/* Draw route line */}
      <Polyline
        positions={[
          [pickup.lat, pickup.lon],
          [dropoff.lat, dropoff.lon],
        ]}
        color="blue"
      />
    </MapContainer>
  );
}
