// app/rides/page.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  CreditCard,
  CheckCircle2,
  FileText,
  Loader2,
  Car,
  Home,
} from "lucide-react";

export default function RiderRidesPage() {
  const { userId } = useAuth();

  const [riderUUID, setRiderUUID] = useState<string | null>(null);
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);

  // 1️⃣ Fetch rider UUID
  useEffect(() => {
    if (!userId) return;

    async function fetchUUID() {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (data?.id) setRiderUUID(data.id);
    }

    fetchUUID();
  }, [userId]);

  // 2️⃣ Fetch latest ride
  useEffect(() => {
    if (!riderUUID) return;

    async function fetchRide() {
      setLoading(true);

      const { data } = await supabase
        .from("rides")
        .select("*")
        .eq("rider_id", riderUUID)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) setRide(data);

      setLoading(false);
    }

    fetchRide();
  }, [riderUUID]);

  // 3️⃣ Realtime Fare / Payment Updates
  useEffect(() => {
    if (!riderUUID) return;

    const channel = supabase
      .channel("ride-fare-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        (payload: { new: any }) => {
          const updated = payload.new;
          if (updated && updated.rider_id === riderUUID) {
            setRide(updated);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [riderUUID]);

  // 4️⃣ Start Stripe Checkout
  async function startPayment() {
    if (!ride || !ride.fare || ride.is_paid) return;

    try {
      setCreatingSession(true);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ride_id: ride.id,
          amount: ride.fare,
          rider_id: ride.rider_id,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("create-checkout-session failed", res.status, text);
        alert("Failed to create checkout session. Check console.");
        setCreatingSession(false);
        return;
      }

      const data = await res.json();
      if (!data.sessionUrl) {
        console.error("create-checkout-session returned:", data);
        alert("Failed to create checkout session. Check console.");
        setCreatingSession(false);
        return;
      }

      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error("startPayment error:", err);
      alert("Payment failed to start. See console.");
      setCreatingSession(false);
    }
  }

  // 5️⃣ UI
  if (loading)
    return (
      <div className="p-6 max-w-xl mx-auto animate-fade-in">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="glass-card p-6 space-y-4">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-12 w-full mt-4" />
        </div>
      </div>
    );

  if (!ride)
    return (
      <div className="p-6 max-w-xl mx-auto text-center animate-fade-in">
        <div className="glass-card p-12">
          <Car size={48} className="text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">You have no rides yet.</p>
          <Link href="/user/request" className="btn-primary inline-block mt-6 text-sm">
            Request Your First Ride
          </Link>
        </div>
      </div>
    );

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      requested: "badge badge-requested",
      accepted: "badge badge-accepted",
      completed: "badge badge-completed",
    };
    return classes[status] || "badge badge-requested";
  };

  return (
    <div className="p-6 max-w-xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 gradient-text">My Ride</h1>

      <div className="glass-card p-6">
        {/* Locations */}
        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                Pickup
              </p>
              <p className="text-sm text-slate-200">{ride.pickup_location}</p>
            </div>
          </div>

          {/* Connecting line */}
          <div className="ml-[15px] w-[2px] h-4 bg-gradient-to-b from-green-400/40 to-accent-pink/40" />

          <div className="flex items-start gap-3">
            <div className="mt-1 w-8 h-8 rounded-lg bg-accent-pink/15 flex items-center justify-center flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-pink" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                Dropoff
              </p>
              <p className="text-sm text-slate-200">{ride.drop_location}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 my-5" />

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">Status</span>
          <span className={getStatusBadge(ride.status)}>{ride.status}</span>
        </div>

        {/* Fare */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-slate-400">Fare</span>
          {ride.fare ? (
            <span className="text-2xl font-bold gradient-text">
              ₹{ride.fare}
            </span>
          ) : (
            <span className="text-sm text-primary-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Calculating...
            </span>
          )}
        </div>

        {/* Pay Now */}
        {!ride.is_paid && ride.fare && (
          <button
            onClick={startPayment}
            disabled={creatingSession}
            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              creatingSession
                ? "bg-green-500/50 cursor-wait"
                : "btn-success shadow-glow-green hover:shadow-glow-green"
            }`}
          >
            <CreditCard size={18} />
            {creatingSession
              ? "Redirecting to Checkout..."
              : `Pay Now ₹${ride.fare}`}
          </button>
        )}

        {/* Receipt URL */}
        {ride.receipt_url && (
          <a
            href={ride.receipt_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 w-full btn-primary flex items-center justify-center gap-2 text-sm"
          >
            <FileText size={16} />
            View Receipt (Hosted)
          </a>
        )}

        {/* Payment completed */}
        {ride.is_paid && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 size={18} />
              <span className="font-semibold text-sm">Payment Completed</span>
            </div>

            <button className="w-full btn-primary flex items-center justify-center gap-2 text-sm">
              <FileText size={16} />
              Download Receipt (PDF)
            </button>
          </div>
        )}

        {/* Track Ride & Dashboard Links */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-3">
          <Link
            href={`/track/${ride.id}`}
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
          >
            <Navigation size={16} />
            Track Ride Live
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium"
          >
            <Home size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
