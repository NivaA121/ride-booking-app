"use client";

import { useEffect, useState } from "react";

export function useDriverLocation(driverId: string) {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    if (!driverId) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        console.log("📍 Driver GPS:", latitude, longitude);

        await fetch("/api/drivers/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driver_id: driverId,
            lat: latitude,
            lng: longitude,
          }),
        });
      },

      (err) => console.error("GPS error:", err),

      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [driverId]);

  return { lat, lng };
}
