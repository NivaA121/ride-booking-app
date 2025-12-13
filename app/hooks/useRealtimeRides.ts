"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export function useRealtimeRides() {
  useEffect(() => {
    const channel = supabase
      .channel("ride-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        (payload) => {
          console.log("🚕 Ride updated:", payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
