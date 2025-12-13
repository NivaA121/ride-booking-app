"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type Driver = {
  id: string;
  user_id: string;
  is_verified: boolean;
  vehicle_model: string;
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    supabase.from("drivers").select("*").then(({ data }) => {
      setDrivers(data ?? []);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Drivers</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">User ID</th>
            <th className="p-3">Is Verified</th>
            <th className="p-3">Vehicle</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-3">{d.user_id}</td>
              <td className="p-3">
                {d.is_verified ? (
                  <span className="text-green-600 font-semibold">Verified</span>
                ) : (
                  <span className="text-red-600 font-semibold">Pending</span>
                )}
              </td>
              <td className="p-3">{d.vehicle_model}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
