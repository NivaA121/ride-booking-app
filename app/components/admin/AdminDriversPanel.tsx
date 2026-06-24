"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Car, CheckCircle2, Clock } from "lucide-react";

type Driver = {
  id: string;
  user_id: string;
  is_verified: boolean;
  vehicle_model: string;
};

export default function AdminDriversPanel() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    supabase.from("drivers").select("*").then(({ data }) => {
      setDrivers(data ?? []);
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Car size={20} className="text-primary-400" />
        <h2 className="text-2xl font-bold text-white">Drivers</h2>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="dark-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Status</th>
              <th>Vehicle</th>
            </tr>
          </thead>

          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-slate-500 py-8">
                  No drivers found
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs">{d.user_id}</td>
                  <td>
                    {d.is_verified ? (
                      <span className="badge badge-accepted flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="badge badge-unpaid flex items-center gap-1 w-fit">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td>{d.vehicle_model || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
