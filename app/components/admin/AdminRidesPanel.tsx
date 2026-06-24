"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Route } from "lucide-react";

type Ride = {
  id: string;
  pickup_location: string;
  drop_location: string;
  status: string;
  fare: number | null;
};

export default function AdminRidesPanel() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    supabase.from("rides").select("*").then(({ data }) => {
      setRides(data ?? []);
    });
  }, []);

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
      <div className="flex items-center gap-2 mb-6">
        <Route size={20} className="text-primary-400" />
        <h2 className="text-2xl font-bold text-white">All Rides</h2>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="dark-table">
          <thead>
            <tr>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Status</th>
              <th>Fare</th>
            </tr>
          </thead>

          <tbody>
            {rides.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-slate-500 py-8">
                  No rides found
                </td>
              </tr>
            ) : (
              rides.map((r) => (
                <tr key={r.id}>
                  <td>{r.pickup_location}</td>
                  <td>{r.drop_location}</td>
                  <td>
                    <span className={getStatusBadge(r.status)}>
                      {r.status}
                    </span>
                  </td>
                  <td className="font-semibold text-white">
                    {r.fare ? `₹${r.fare}` : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
