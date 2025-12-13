"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import LiveMap from "@/app/components/LiveMap";


export default function TrackRide() {
  const { rideId } = useParams(); // Works in client components

  const [driverLoc, setDriverLoc] = useState<any>(null);

  useEffect(() => {
    if (!rideId) return;

    console.log("📡 Listening for driver location for ride:", rideId);

    const channel = supabase
      .channel("driver-location-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations",
        },
        (payload: any) => {
          // Only update if this ride matches
          if (payload.new?.ride_id === rideId) {
            console.log("📍 Driver updated location:", payload.new);
            setDriverLoc(payload.new);
          }
        }
      )
      .subscribe();

    // Cleanup when leaving page
    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  return (
  <div className="p-6">
    <h1 className="text-xl font-bold mb-4">Live Tracking</h1>

    <LiveMap location={driverLoc} />

    {driverLoc && (
      <p className="mt-4 text-gray-600">
        Driver at: <b>{driverLoc.lat}</b>, <b>{driverLoc.lng}</b>
      </p>
    )}
  </div>
);

}
