"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function DriverHistoryPage() {
  const { userId } = useAuth();
  const [driverUUID, setDriverUUID] = useState<string | null>(null);
  const [rides, setRides] = useState<any[]>([]);

  // 1️⃣ Fetch driver UUID
  useEffect(() => {
    if (!userId) return;

    async function loadUUID() {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (data) setDriverUUID(data.id);
    }

    loadUUID();
  }, [userId]);

  // 2️⃣ Fetch rides assigned to driver
  useEffect(() => {
    if (!driverUUID) return;

    async function loadRides() {
      const { data } = await supabase
        .from("rides")
        .select("*")
        .eq("driver_id", driverUUID)
        .order("created_at", { ascending: false });

      setRides(data || []);
    }

    loadRides();
  }, [driverUUID]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Driver Ride History</h1>

      {rides.length === 0 && <p>No rides found.</p>}

      <div className="space-y-4">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="border p-4 rounded-lg shadow bg-white"
          >
            <p><strong>Pickup:</strong> {ride.pickup_location}</p>
            <p><strong>Drop:</strong> {ride.drop_location}</p>
            <p><strong>Status:</strong> {ride.status}</p>
            <p><strong>Fare Earned (80%):</strong> ₹{ride.fare ? ride.fare * 0.8 : "N/A"}</p>
            <p className="text-gray-500 text-sm">
              {new Date(ride.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
