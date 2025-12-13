"use client";

import { useAuth } from "@clerk/nextjs";
import { useDriverLocation } from "../hooks/useDriverLocation";
import { useDriverRides } from "../hooks/useDriverRides";
import { useRealtimeDriver } from "../hooks/useRealtimeDriver";
import { useRealtimeRides } from "../hooks/useRealtimeRides";
import supabase from "@/lib/supabaseClient";


import dynamic from "next/dynamic";

// Leaflet must load on client only
const DriverMap = dynamic(() => import("@/app/components/DriverMap"), {
  ssr: false,
});

export default function DashboardPage() {
  const { userId } = useAuth();

  // 🛰 Live GPS tracking of the driver
  const { lat, lng } = useDriverLocation(userId!);

  useRealtimeDriver(userId!);   // 👈 Add this
  useRealtimeRides();


  // 🚕 Fetch rides assigned to the driver
  const { rides, loading } = useDriverRides();


  async function acceptRide(rideId: string) {
  await supabase
    .from("rides")
    .update({ status: "accepted" })
    .eq("id", rideId);

  alert("Ride accepted!");
}

async function completeRide(rideId: string) {
  await supabase
    .from("rides")
    .update({ status: "completed" })
    .eq("id", rideId);

  alert("Ride completed!");
}


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome back 👋</h1>

      <p>
        <strong>Driver ID:</strong> {userId}
      </p>

      {/* 🗺 MAP SECTION */}
      {lat && lng ? (
        <div className="mt-6">
          <DriverMap lat={lat} lng={lng} />
        </div>
      ) : (
        <p className="text-gray-500 mt-6">Getting GPS location…</p>
      )}

      {/* 🚕 RIDE REQUESTS */}
      <h2 className="text-xl font-semibold mt-10">Your Ride Requests</h2>

      {loading ? (
        <p className="text-gray-500">Loading rides…</p>
      ) : rides.length === 0 ? (
        <p className="text-gray-500 mt-2">No rides assigned yet…</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rides.map((ride) => (

            <li key={ride.id} className="p-4 border rounded-lg shadow">
  <p>
    <strong>Pickup:</strong> {ride.pickup_location}
  </p>

  <p>
    <strong>Dropoff:</strong> {ride.drop_location}
  </p>

  <p>
    <strong>Status:</strong> {ride.status}
  </p>

  {/* ACTION BUTTONS */}
  {ride.status === "requested" && (
    <button
      onClick={() => acceptRide(ride.id)}
      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Accept Ride
    </button>
  )}

  {ride.status === "accepted" && (
    <button
      onClick={() => completeRide(ride.id)}
      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Complete Ride
    </button>
  )}
</li>


          ))}
        </ul>
      )}
    </div>
  );
}
