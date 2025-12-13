"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import supabase from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import NominatimInput from "@/app/components/NominatimInput";

// Load map only on client
const OSMMap = dynamic(() => import("../../components/OSMMap"), {
  ssr: false,
});

export default function RequestRidePage() {
  const { userId } = useAuth();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null);

  // --------------------------------------------------------------------
  // ⭐ Handle Ride Request
  // --------------------------------------------------------------------
  async function handleRideRequest() {
    if (!pickupCoords || !dropoffCoords) {
      alert("Please select valid pickup & dropoff locations.");
      return;
    }

    // --------------------------------------------------------------------
    // 1️⃣ Fetch or Auto-Create Rider UUID in Supabase (users table)
    // --------------------------------------------------------------------
    const { data: riderRow, error: riderError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    let riderUUID = riderRow?.id;

    if (!riderUUID) {
      console.log("Rider not found — creating new user record...");

      const { data: newRider, error: newRiderError } = await supabase
        .from("users")
        .insert({
          clerk_id: userId,
        })
        .select()
        .single();

      if (newRiderError) {
        console.error("Failed to create rider:", newRiderError);
        alert("Failed to create rider profile.");
        return;
      }

      riderUUID = newRider.id;
    }

    // --------------------------------------------------------------------
    // 2️⃣ Insert Ride Request
    // --------------------------------------------------------------------
    const { error } = await supabase.from("rides").insert({
      rider_id: riderUUID,
      driver_id: null,
      pickup_location: pickup,
      drop_location: dropoff,
      pickup_lat: pickupCoords.lat,
      pickup_lng: pickupCoords.lon,
      drop_lat: dropoffCoords.lat,
      drop_lng: dropoffCoords.lon,
      fare: null,
      status: "requested",
    });

    if (error) {
      console.error("Insert Error:", error);
      alert("Failed to request ride.");
      return;
    }

    alert("Ride requested!");
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-8">Request a Ride</h1>

      <NominatimInput
        label="Pickup Location"
        value={pickup}
        onChange={setPickup}
        onSelect={(lat, lon, name) => {
          setPickup(name);
          setPickupCoords({ lat, lon });
        }}
      />

      <NominatimInput
        label="Drop-off Location"
        value={dropoff}
        onChange={setDropoff}
        onSelect={(lat, lon, name) => {
          setDropoff(name);
          setDropoffCoords({ lat, lon });
        }}
      />

      <button
        onClick={handleRideRequest}
        className="w-full mt-6 bg-black text-white py-3 rounded-lg"
      >
        Request Ride
      </button>

      {pickupCoords && dropoffCoords && (
        <div className="mt-8">
          <OSMMap pickup={pickupCoords} dropoff={dropoffCoords} />
        </div>
      )}
    </div>
  );
}
