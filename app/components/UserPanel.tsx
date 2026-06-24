"use client";

import { useAuth } from "@clerk/nextjs";
import { useDriverLocation } from "../hooks/useDriverLocation";
import { useDriverRides } from "../hooks/useDriverRides";
import { useRealtimeDriver } from "../hooks/useRealtimeDriver";
import { useRealtimeRides } from "../hooks/useRealtimeRides";
import supabase from "@/lib/supabaseClient";
import HeroSection from "./HeroSection";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  Satellite,
  Car,
} from "lucide-react";

import dynamic from "next/dynamic";

const DriverMap = dynamic(() => import("@/app/components/DriverMap"), {
  ssr: false,
});

export default function UserPanel({ showHero = true }: { showHero?: boolean }) {
  const { userId } = useAuth();
  const guestId = "guest_user";
  const effectiveId = userId || guestId;
  const { lat, lng } = useDriverLocation(effectiveId);

  useRealtimeDriver(effectiveId);
  useRealtimeRides();

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

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      requested: "badge badge-requested",
      accepted: "badge badge-accepted",
      completed: "badge badge-completed",
    };
    return classes[status] || "badge badge-requested";
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      {showHero && <HeroSection />}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">
          Welcome back <span className="gradient-text">👋</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Here&apos;s an overview of your activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center">
            <Satellite size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">GPS Status</p>
            <div className="flex items-center gap-2">
              {lat && lng ? (
                <>
                  <span className="pulse-dot" />
                  <span className="text-sm font-semibold text-green-400">
                    Active
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-500">Connecting...</span>
              )}
            </div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-400/20 flex items-center justify-center">
            <Car size={22} className="text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Active Rides</p>
            <p className="text-2xl font-bold text-white">
              {rides.filter((r) => r.status !== "completed").length}
            </p>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-accent-pink" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-white">
              {rides.filter((r) => r.status === "completed").length}
            </p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {lat && lng ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Navigation size={18} className="text-primary-400" />
            Your Location
          </h2>
          <div className="map-wrapper" style={{ height: "400px" }}>
            <DriverMap lat={lat} lng={lng} />
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 mb-8 text-center">
          <div className="skeleton w-full h-64 mb-4" />
          <p className="text-slate-500">Getting GPS location…</p>
        </div>
      )}

      {/* Ride Requests */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Car size={18} className="text-primary-400" />
          Your Ride Requests
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card p-6">
                <div className="skeleton h-4 w-3/4 mb-3" />
                <div className="skeleton h-4 w-1/2 mb-3" />
                <div className="skeleton h-8 w-32" />
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Clock size={32} className="text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No rides assigned yet…</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {rides.map((ride) => (
              <li
                key={ride.id}
                className="glass-card p-5 animate-slide-up"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <p className="text-sm text-slate-300">
                        <span className="text-slate-500 mr-1">Pickup</span>
                        {ride.pickup_location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent-pink" />
                      <p className="text-sm text-slate-300">
                        <span className="text-slate-500 mr-1">Dropoff</span>
                        {ride.drop_location}
                      </p>
                    </div>
                  </div>
                  <span className={getStatusBadge(ride.status)}>
                    {ride.status}
                  </span>
                </div>

                <div className="flex gap-3 mt-4">
                  {ride.status === "requested" && (
                    <button
                      onClick={() => acceptRide(ride.id)}
                      className="btn-success text-sm px-4 py-2"
                    >
                      Accept Ride
                    </button>
                  )}

                  {ride.status === "accepted" && (
                    <button
                      onClick={() => completeRide(ride.id)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Complete Ride
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
