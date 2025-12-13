"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Payments fetch error:", error);
          setPayments([]);
          return;
        }
        setPayments(data || []);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payments Dashboard</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Ride ID</th>
            <th className="p-3 text-left">Rider</th>
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.ride_id}</td>
              <td className="p-3">{p.rider_id}</td>
              <td className="p-3">{p.driver_id}</td>
              <td className="p-3 font-semibold">₹{p.amount / 100}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    p.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="p-3">
                {new Date(p.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
