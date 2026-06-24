"use client";

import { useEffect, useState } from "react";

export interface Ride {
  id: string;
  pickup_location: string;
  drop_location: string;
  status: string;
  rider_id: string;
  pickup_lat: number;
  pickup_lng: number;
  drop_lat: number;
  drop_lng: number;
  fare: number | null;
}

function loadRidesFromStorage(): Ride[] {
  try {
    const raw = localStorage.getItem("mock_rides");
    if (!raw) return [];
    const all: Ride[] = JSON.parse(raw);
    // Only show rides that are still "requested"
    return all.filter((r) => r.status === "requested");
  } catch {
    return [];
  }
}

export function useDriverRequests() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setRides(loadRidesFromStorage());
    setLoading(false);
  }

  useEffect(() => {
    // Initial load
    refresh();

    // Listen for same-tab updates (dispatched by request/page.tsx)
    window.addEventListener("mock_rides_updated", refresh);
    // Listen for cross-tab updates via storage event
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("mock_rides_updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rides, loading };
}
