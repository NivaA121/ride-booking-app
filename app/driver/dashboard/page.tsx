"use client";

import { useAuth } from "@clerk/nextjs";
import { useDriverRequests } from "@/app/hooks/useDriverRequests";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function DriverDashboard() {
  const { userId } = useAuth();
  const { rides, loading } = useDriverRequests();

  const [driverUUID, setDriverUUID] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState<string>("Loading...");
  const [activeRideId, setActiveRideId] = useState<string | null>(null);


  // ⭐ Step 1: Get Driver UUID
  // ⭐ Step 1: Get Driver UUID
useEffect(() => {
  if (!userId) return;

  async function fetchDriverUUID() {
    const { data, error } = await supabase
      .from("drivers")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.log("Driver not found — creating new driver record...");

      // ⭐ CREATE DRIVER AUTOMATICALLY
      const { data: newDriver } = await supabase
        .from("drivers")
        .insert({
          user_id: userId,
        })
        .select()
        .single();

      if (newDriver) {
        setDriverUUID(newDriver.id);
      }

      return;
    }

    setDriverUUID(data.id);
  }

  fetchDriverUUID();
}, [userId]);


  // ⭐ Step 2: Calculate Driver Rating
  useEffect(() => {
    if (!driverUUID) return;

    async function loadRatings() {
      const { data: ratings } = await supabase
        .from("ratings")
        .select("rating")
        .eq("driver_id", driverUUID);

      if (!ratings || ratings.length === 0) {
        setAvgRating("No ratings");
        return;
      }

      const total = ratings.reduce((sum, r) => sum + r.rating, 0);
      const avg = (total / ratings.length).toFixed(1);

      setAvgRating(avg);
    }

    loadRatings();
  }, [driverUUID]);

  // ⭐ Step 3: Driver LIVE GPS Tracking
  useEffect(() => {
  if (!userId) return;

  const watch = navigator.geolocation.watchPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      await supabase
        .from("driver_locations")
        .upsert({
          driver_id: userId,
          lat,
          lng,
          ride_id: activeRideId, // very important
          updated_at: new Date(),
        });
    },
    (err) => console.log("GPS Error:", err),
    { enableHighAccuracy: true }
  );

  return () => navigator.geolocation.clearWatch(watch);
}, [userId]);


  // ⭐ Accept Ride
  async function acceptRide(rideId: string) {
  const { data: driverRow } = await supabase
    .from("drivers")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!driverRow) {
    alert("Driver not found!");
    return;
  }

  // Fetch ride coords for fare calculation
  const { data: rideData, error: rideErr } = await supabase
    .from("rides")
    .select("pickup_lat, pickup_lng, drop_lat, drop_lng")
    .eq("id", rideId)
    .single();

  if (rideErr || !rideData) {
    console.error("❌ Ride data lookup failed:", rideErr);
    alert("Could not load ride details.");
    return;
  }

  // Call API to calculate fare
  const res = await fetch("/api/calculate-fare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pickup_lat: rideData.pickup_lat,
      pickup_lng: rideData.pickup_lng,
      drop_lat: rideData.drop_lat,
      drop_lng: rideData.drop_lng,
    }),
  });

  if (!res.ok) {
    alert("Failed to calculate fare.");
    return;
  }

  const { fare } = await res.json();

  // Update ride entry with driver + fare
  await supabase
    .from("rides")
    .update({
      driver_id: driverRow.id,
      status: "accepted",
      fare: fare,
    })
    .eq("id", rideId);

  alert(`Ride accepted! Fare: ₹${fare}`);
}



  if (!userId) return <p>Loading driver...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>

      {/* ⭐ Driver Rating Section */}
      <div className="mb-6 p-4 bg-white shadow rounded-lg border">
        <p className="text-lg">
          ⭐ Driver Rating:{" "}
          <span className="font-bold text-yellow-500">{avgRating}</span>
        </p>
      </div>

      {loading ? (
        <p>Loading rides...</p>
      ) : rides.length === 0 ? (
        <p>No ride requests available right now.</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride: any) => (
            <div
              key={ride.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <p>
                <strong>Pickup:</strong> {ride.pickup_location}
              </p>
              <p>
                <strong>Drop:</strong> {ride.drop_location}
              </p>

              <button
                onClick={() => acceptRide(ride.id)}
                className="mt-3 bg-black text-white px-4 py-2 rounded-lg"
              >
                Accept Ride
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
