"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Clock, MapPin, IndianRupee, Calendar } from "lucide-react";

export default function DriverHistoryPage() {
  const { userId } = useAuth();
  const [driverUUID, setDriverUUID] = useState<string | null>(null);
  const [rides, setRides] = useState<any[]>([]);

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

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      requested: "badge badge-requested",
      accepted: "badge badge-accepted",
      completed: "badge badge-completed",
    };
    return classes[status] || "badge badge-requested";
  };

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 gradient-text">Ride History</h1>
      <p className="text-slate-400 text-sm mb-8">
        Your completed and past rides
      </p>

      {rides.length === 0 && (
        <div className="glass-card p-10 text-center">
          <Clock size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No rides found.</p>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        {rides.length > 0 && (
          <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary-500/30 via-accent-purple/20 to-transparent" />
        )}

        <div className="space-y-4">
          {rides.map((ride, index) => (
            <div key={ride.id} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 mt-5">
                <div className="w-10 h-10 rounded-full bg-dark-700 border-2 border-primary-500/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary-400" />
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <p className="text-sm text-slate-300">{ride.pickup_location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent-pink" />
                      <p className="text-sm text-slate-300">{ride.drop_location}</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(ride.status)}>
                    {ride.status}
                  </span>
                </div>

                <div className="h-px bg-white/5 my-3" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee size={14} className="text-green-400" />
                    <span className="text-green-400 font-semibold">
                      ₹{ride.fare ? (ride.fare * 0.8).toFixed(0) : "N/A"}
                    </span>
                    <span className="text-slate-600 text-xs">(80% share)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={12} />
                    {new Date(ride.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
