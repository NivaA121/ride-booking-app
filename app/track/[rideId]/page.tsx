"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import LiveMap from "@/app/components/LiveMap";
import { Navigation, Satellite } from "lucide-react";

export default function TrackRide() {
  const { rideId } = useParams();

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
          if (payload.new?.ride_id === rideId) {
            console.log("📍 Driver updated location:", payload.new);
            setDriverLoc(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Navigation size={20} className="text-primary-400" />
          Live Tracking
        </h1>
        {driverLoc && (
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="text-sm text-green-400 font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="map-wrapper" style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}>
        <LiveMap location={driverLoc} />
      </div>

      {/* Driver location info */}
      {driverLoc && (
        <div className="glass-card p-4 mt-4 flex items-center gap-3 animate-slide-up">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center">
            <Satellite size={18} className="text-primary-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Driver Coordinates</p>
            <p className="text-sm text-slate-300 font-mono">
              {driverLoc.lat.toFixed(6)}, {driverLoc.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
