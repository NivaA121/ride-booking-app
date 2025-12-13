// app/rides/page.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

export default function RiderRidesPage() {
  const { userId } = useAuth();

  const [riderUUID, setRiderUUID] = useState<string | null>(null);
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);

  // -------------------------------------------------------
  // 1️⃣ Fetch rider UUID
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // 2️⃣ Fetch latest ride
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // 3️⃣ Realtime Fare / Payment Updates
  // -------------------------------------------------------
  useEffect(() => {
    if (!riderUUID) return;

    const channel = supabase
      .channel("ride-fare-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        (payload: { new: any }) => {
          const updated = payload.new;
          // update UI only for this rider's rides
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

  // -------------------------------------------------------
  // 4️⃣ Start Stripe Checkout (client-side)
  // -------------------------------------------------------
  async function startPayment() {
    if (!ride || !ride.fare || ride.is_paid) return;

    try {
      setCreatingSession(true);

      // Create checkout session on server. Server should return a sessionUrl.
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

      // Redirect user to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error("startPayment error:", err);
      alert("Payment failed to start. See console.");
      setCreatingSession(false);
    }
  }

  // -------------------------------------------------------
  // 5️⃣ UI
  // -------------------------------------------------------
  if (loading) return <p className="p-4">Loading your ride...</p>;
  if (!ride) return <p className="p-4">You have no rides yet.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Ride</h1>

      <div className="p-5 border rounded-xl shadow bg-white">
        <p>
          <strong>Pickup:</strong> {ride.pickup_location}
        </p>

        <p>
          <strong>Dropoff:</strong> {ride.drop_location}
        </p>

        <p className="mt-2">
          <strong>Status:</strong>{" "}
          <span
            className={`font-bold ${
              ride.status === "completed"
                ? "text-purple-600"
                : ride.status === "accepted"
                ? "text-green-600"
                : ride.status === "requested"
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            {ride.status}
          </span>
        </p>

        {/* ⭐ FARE */}
        <p className="mt-3 text-lg">
          <strong>Fare:</strong>{" "}
          {ride.fare ? (
            <span className="text-black font-bold">₹{ride.fare}</span>
          ) : (
            <span className="text-indigo-600">calculating...</span>
          )}
        </p>

        {/* ⭐ Pay Now - only when not paid */}
        {!ride.is_paid && ride.fare && (
          <button
            onClick={startPayment}
            disabled={creatingSession}
            className={`mt-4 w-full ${
              creatingSession ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-3 rounded-lg font-semibold`}
          >
            {creatingSession ? "Redirecting to Checkout..." : `Pay Now ₹${ride.fare}`}
          </button>
        )}

        {/* ⭐ If Stripe/Server supplied a receipt URL after payment show it */}
        {ride.receipt_url && (
          <a
            href={ride.receipt_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block text-center bg-blue-600 text-white py-3 rounded-lg"
          >
            View Receipt (Hosted)
          </a>
        )}

        {/* ⭐ If paid -> allow downloading server-generated PDF receipt */}
        {ride.is_paid && (
          <div className="mt-4">
            <p className="text-green-700 font-semibold">✅ Payment Completed</p>

            <button
              
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Download Receipt (PDF)
            </button>
          </div>
        )}

        {/* ⭐ Track Ride */}
        <div className="mt-4">
          <Link href={`/track/${ride.id}`} className="text-blue-600 underline">
            Track Ride
          </Link>
        </div>
      </div>
    </div>
  );
}
