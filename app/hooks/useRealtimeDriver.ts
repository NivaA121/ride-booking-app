"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export function useRealtimeDriver(driverId: string) {
  useEffect(() => {
    if (!driverId) return;

    const channel = supabase
      .channel("drivers-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "drivers" },
        (payload) => {
          console.log("🔥 Driver Updated:", payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);
}
