"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function RiderHistoryPage() {
  const { userId } = useAuth();
  const [riderUUID, setRiderUUID] = useState<string | null>(null);
  const [rides, setRides] = useState<any[]>([]);

  // 1️⃣ Fetch real rider UUID
  useEffect(() => {
    if (!userId) return;

    async function fetchUUID() {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (data) setRiderUUID(data.id);
    }

    fetchUUID();
  }, [userId]);

  // 2️⃣ Fetch all rides
  useEffect(() => {
    if (!riderUUID) return;

    async function fetchRides() {
      const { data } = await supabase
        .from("rides")
        .select("*")
        .eq("rider_id", riderUUID)
        .order("created_at", { ascending: false });

      setRides(data || []);
    }

    fetchRides();
  }, [riderUUID]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ride History</h1>

      {rides.length === 0 && <p>No past rides found.</p>}

      <div className="space-y-4">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="border p-4 rounded-lg shadow bg-white"
          >
            <p><strong>Pickup:</strong> {ride.pickup_location}</p>
            <p><strong>Drop:</strong> {ride.drop_location}</p>
            <p><strong>Status:</strong> {ride.status}</p>
            <p><strong>Fare:</strong> ₹{ride.fare ?? "N/A"}</p>
            <p className="text-gray-500 text-sm">
              {new Date(ride.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
