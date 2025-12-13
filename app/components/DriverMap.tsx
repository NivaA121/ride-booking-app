"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { useEffect, useState } from "react";

import type { LatLngExpression, Icon } from "leaflet";

// Fix Leaflet icon missing issue
const driverIcon: Icon = L.icon({
  iconUrl: "/car.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Props
interface DriverMapProps {
  lat: number;
  lng: number;
}

export default function DriverMap({ lat, lng }: DriverMapProps) {
  const [position, setPosition] = useState<LatLngExpression>([lat, lng]);

  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={position} icon={driverIcon}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
}
