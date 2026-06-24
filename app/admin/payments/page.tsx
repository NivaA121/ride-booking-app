"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { CreditCard, Calendar } from "lucide-react";

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
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard size={20} className="text-primary-400" />
        <h1 className="text-2xl font-bold text-white">Payments Dashboard</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="dark-table">
          <thead>
            <tr>
              <th>Ride ID</th>
              <th>Rider</th>
              <th>Driver</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs">{p.ride_id}</td>
                <td className="font-mono text-xs">{p.rider_id}</td>
                <td className="font-mono text-xs">{p.driver_id}</td>
                <td className="font-semibold text-white">
                  ₹{p.amount / 100}
                </td>
                <td>
                  <span
                    className={
                      p.status === "paid"
                        ? "badge badge-paid"
                        : "badge badge-unpaid"
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar size={12} />
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
