"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type Ride = {
  id: string;
  pickup_location: string;
  drop_location: string;
  status: string;
  fare: number | null;
};

export default function AdminRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    supabase.from("rides").select("*").then(({ data }) => {
      setRides(data ?? []);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">All Rides</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Pickup</th>
            <th className="p-3">Dropoff</th>
            <th className="p-3">Status</th>
            <th className="p-3">Fare</th>
          </tr>
        </thead>

        <tbody>
          {rides.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.pickup_location}</td>
              <td className="p-3">{r.drop_location}</td>
              <td className="p-3 text-blue-600">{r.status}</td>
              <td className="p-3">₹{r.fare ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
