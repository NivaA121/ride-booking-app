"use client";

import { useAuth } from "@clerk/nextjs";
import { useDriverRequests } from "@/app/hooks/useDriverRequests";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Star, MapPin, Navigation, Zap, Loader2, CheckCircle2 } from "lucide-react";

export default function DriverDashboard() {
  const { userId } = useAuth();
  const { rides, loading } = useDriverRequests();

  const [driverUUID, setDriverUUID] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState<string>("Loading...");
  const [activeRideId, setActiveRideId] = useState<string | null>(null);

  const [acceptedRides, setAcceptedRides] = useState<Set<string>>(new Set());
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

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
            ride_id: activeRideId,
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
    setIsAccepting(rideId);
    
    const { data: driverRow } = await supabase
      .from("drivers")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!driverRow) {
      alert("Driver not found!");
      setIsAccepting(null);
      return;
    }

    const { data: rideData, error: rideErr } = await supabase
      .from("rides")
      .select("pickup_lat, pickup_lng, drop_lat, drop_lng")
      .eq("id", rideId)
      .single();

    if (rideErr || !rideData) {
      console.error("❌ Ride data lookup failed:", rideErr);
      alert("Could not load ride details.");
      setIsAccepting(null);
      return;
    }

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
      setIsAccepting(null);
      return;
    }

    const { fare } = await res.json();

    await supabase
      .from("rides")
      .update({
        driver_id: driverRow.id,
        status: "accepted",
        fare: fare,
      })
      .eq("id", rideId);

    setAcceptedRides((prev) => new Set(prev).add(rideId));
    setIsAccepting(null);
    alert(`Ride accepted! Fare: ₹${fare}`);
  }

  if (!userId)
    return (
      <div className="p-6 animate-fade-in">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-24 w-full mb-4" />
        <div className="skeleton h-24 w-full" />
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 gradient-text">
        Driver Dashboard
      </h1>

      {/* Rating Card */}
      <div className="glass-card p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-400/20 flex items-center justify-center">
          <Star size={24} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Your Rating</p>
          <p className="text-2xl font-bold text-yellow-400">{avgRating}</p>
        </div>
      </div>

      {/* Ride Requests */}
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap size={18} className="text-primary-400" />
        Incoming Requests
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-5">
              <div className="skeleton h-4 w-3/4 mb-3" />
              <div className="skeleton h-4 w-2/3 mb-3" />
              <div className="skeleton h-10 w-32" />
            </div>
          ))}
        </div>
      ) : rides.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Navigation size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">
            No ride requests available right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride: any) => (
            <div
              key={ride.id}
              className="glass-card p-5 animate-slide-up"
            >
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500 mr-1">Pickup:</span>
                    {ride.pickup_location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-pink" />
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500 mr-1">Drop:</span>
                    {ride.drop_location}
                  </p>
                </div>
              </div>

              {acceptedRides.has(ride.id) ? (
                <div className="btn-success opacity-80 text-sm flex items-center justify-center gap-2 w-max cursor-default">
                  <CheckCircle2 size={16} />
                  Accepted
                </div>
              ) : (
                <button
                  onClick={() => acceptRide(ride.id)}
                  disabled={isAccepting === ride.id}
                  className="btn-success text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-max"
                >
                  {isAccepting === ride.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Zap size={14} />
                  )}
                  {isAccepting === ride.id ? "Accepting..." : "Accept Ride"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
