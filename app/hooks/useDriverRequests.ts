"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export interface Ride {
  id: string;
  pickup_location: string;
  drop_location: string;
  status: string;
  rider_id: string;
  pickup_lat: number;
  pickup_lng: number;
}

export function useDriverRequests() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------
  // 1️⃣ Fetch all "requested" rides
  // ----------------------------------------------
  async function fetchRides() {
    setLoading(true);

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "requested")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading rides:", error);
    }

    setRides(data || []);
    setLoading(false);
  }

  // ----------------------------------------------
  // 2️⃣ Run once + enable realtime updates
  // ----------------------------------------------
  useEffect(() => {
    fetchRides();

    const channel = supabase
      .channel("driver-rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
        },
        () => fetchRides()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rides, loading };
}
