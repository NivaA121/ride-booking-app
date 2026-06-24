"use client";

import { useDriverRequests } from "@/app/hooks/useDriverRequests";
import { useEffect, useState } from "react";
import { Star, Navigation, Zap, Loader2, CheckCircle2 } from "lucide-react";

export default function DriverPanel() {
  const { rides, loading } = useDriverRequests();

  const [avgRating] = useState<string>("4.8");
  const [acceptedRides, setAcceptedRides] = useState<Set<string>>(new Set());
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  // ⭐ Accept Ride (mock — no Supabase)
  async function acceptRide(rideId: string) {
    setIsAccepting(rideId);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a random fare ₹80–₹300
    const fare = Math.floor(80 + Math.random() * 220);

    // Update the ride status in localStorage
    try {
      const all = JSON.parse(localStorage.getItem("mock_rides") || "[]");
      const updated = all.map((r: { id: string; status: string; fare: number | null }) =>
        r.id === rideId ? { ...r, status: "accepted", fare } : r
      );
      localStorage.setItem("mock_rides", JSON.stringify(updated));

      // Notify the user's ride-waiting page (cross-tab via storage, same-tab via custom event)
      window.dispatchEvent(new Event("mock_rides_updated"));
      // Force a storage event for cross-tab (same-origin pages listen to this)
      localStorage.setItem("mock_last_accepted", JSON.stringify({ rideId, fare, ts: Date.now() }));
    } catch (e) {
      console.error("Failed to update mock ride:", e);
    }

    setAcceptedRides((prev) => new Set(prev).add(rideId));
    setIsAccepting(null);
    alert(`✅ Ride accepted! Fare: ₹${fare}`);
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
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
          {rides.map((ride) => (
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
