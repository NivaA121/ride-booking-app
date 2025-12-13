"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
});

export default function LiveMap({ location }: any) {
  if (!location) {
    return <p>Waiting for driver location...</p>;
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[location.lat, location.lng]}
        icon={driverIcon}
      >
        <Popup>Driver Current Location</Popup>
      </Marker>
    </MapContainer>
  );
}
