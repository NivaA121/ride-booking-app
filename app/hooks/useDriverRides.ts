"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@clerk/nextjs";

export interface Ride {
  id: string;
  pickup_location: string;
  drop_location: string;
  status: string;
  rider_id: string;
  pickup_lat: number;
  pickup_lng: number;
}

export function useDriverRides() {
  const { userId } = useAuth();

  const [driverUUID, setDriverUUID] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // 1️⃣ Ensure driver exists — auto create if missing
  // -------------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    async function ensureDriver() {
      const { data, error } = await supabase
        .from("drivers")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!data || error) {
        console.log("Driver not found — creating new driver...");

        const { data: newDriver } = await supabase
          .from("drivers")
          .insert({ user_id: userId })
          .select()
          .single();

        if (newDriver) {
          setDriverUUID(newDriver.id);
        }

        return;
      }

      setDriverUUID(data.id);
    }

    ensureDriver();
  }, [userId]);

  // -------------------------------------------------------
  // 2️⃣ Fetch rides AFTER driverUUID is set
  // -------------------------------------------------------
  async function fetchRides() {
    if (!driverUUID) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", driverUUID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading driver rides:", error);
    } else {
      setRides(data || []);
    }

    setLoading(false);
  }

  // -------------------------------------------------------
  // 3️⃣ Realtime updates for rides
  // -------------------------------------------------------
  useEffect(() => {
    if (!driverUUID) return;

    fetchRides();

    const channel = supabase
      .channel("driver-rides")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        () => fetchRides()
      )
      .subscribe();

    return () => {
    void supabase.removeChannel(channel);
};
  }, [driverUUID]); // 🔥 important!!!

  return { rides, loading };
}
