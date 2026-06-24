"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Home,
  Loader2,
  MapPin,
  Banknote,
  CreditCard,
  Sparkles,
} from "lucide-react";

interface RideInfo {
  id: string;
  fare: number | null;
  pickup_location: string;
  drop_location: string;
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rideId = searchParams.get("ride_id");
  const method = searchParams.get("method");
  const fareParam = searchParams.get("fare");
  const pickupParam = searchParams.get("pickup");
  const dropoffParam = searchParams.get("dropoff");

  const [verifying, setVerifying] = useState(true);
  const [ride, setRide] = useState<RideInfo | null>(null);

  /* ── Load ride info from URL params (mock — no Supabase) ── */
  useEffect(() => {
    // Simulate a brief verification delay for UX
    const timer = setTimeout(() => {
      if (rideId) {
        // First try localStorage (most accurate), then fall back to URL params
        try {
          const all = JSON.parse(localStorage.getItem("mock_rides") || "[]");
          const found = all.find((r: { id: string }) => r.id === rideId);
          if (found) {
            setRide({
              id: found.id,
              fare: found.fare ?? Number(fareParam ?? 0),
              pickup_location: found.pickup_location ?? pickupParam ?? "Pickup",
              drop_location: found.drop_location ?? dropoffParam ?? "Dropoff",
            });
            setVerifying(false);
            return;
          }
        } catch {}

        // Fallback: use URL params directly
        setRide({
          id: rideId,
          fare: fareParam ? Number(fareParam) : null,
          pickup_location: pickupParam ?? "Pickup Location",
          drop_location: dropoffParam ?? "Dropoff Location",
        });
      }
      setVerifying(false);
    }, 1500);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideId]);

  const isCash = method === "cash";

  return (
    <div className="payment-done-page">
      {/* Background effects */}
      <div className="payment-done-bg">
        <div className="payment-done-blob payment-done-blob-1" />
        <div className="payment-done-blob payment-done-blob-2" />
        <div className="payment-done-blob payment-done-blob-3" />
      </div>

      {/* Confetti particles */}
      <div className="payment-done-confetti" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="payment-done-particle"
            style={{
              ["--x" as string]: `${Math.random() * 100}vw`,
              ["--delay" as string]: `${Math.random() * 2}s`,
              ["--duration" as string]: `${2 + Math.random() * 3}s`,
              ["--color" as string]: [
                "#f5b900",
                "#00e6b4",
                "#ec4899",
                "#8b5cf6",
                "#22d3ee",
              ][Math.floor(Math.random() * 5)],
            }}
          />
        ))}
      </div>

      <div className="payment-done-card">
        {verifying ? (
          <div className="payment-done-verifying">
            <Loader2 size={40} className="payment-done-spinner" />
            <h2 className="payment-done-verifying-title">
              Verifying Payment...
            </h2>
            <p className="payment-done-verifying-sub">
              Please wait while we confirm your transaction.
            </p>
          </div>
        ) : (
          <>
            {/* Success icon */}
            <div className="payment-done-icon-wrap">
              <div className="payment-done-icon-ring" />
              <div className="payment-done-icon-bg">
                <CheckCircle2 size={44} />
              </div>
              <Sparkles
                size={20}
                className="payment-done-sparkle payment-done-sparkle-1"
              />
              <Sparkles
                size={16}
                className="payment-done-sparkle payment-done-sparkle-2"
              />
              <Sparkles
                size={14}
                className="payment-done-sparkle payment-done-sparkle-3"
              />
            </div>

            {/* Title */}
            <h1 className="payment-done-title">Payment Successful!</h1>
            <p className="payment-done-subtitle">
              {isCash
                ? "Your cash payment has been confirmed. Enjoy your ride!"
                : "Your payment has been processed securely."}
            </p>

            {/* Ride details card */}
            {ride && (
              <div className="payment-done-details">
                {/* Fare */}
                <div className="payment-done-fare-row">
                  <span className="payment-done-fare-label">Total Fare</span>
                  <span className="payment-done-fare-amount">
                    ₹{ride.fare?.toFixed(2) ?? "—"}
                  </span>
                </div>

                {/* Route */}
                <div className="payment-done-route">
                  <div className="payment-done-route-item">
                    <div className="payment-done-route-dot pickup" />
                    <div>
                      <span className="payment-done-route-label">Pickup</span>
                      <span className="payment-done-route-value">
                        {ride.pickup_location}
                      </span>
                    </div>
                  </div>
                  <div className="payment-done-route-line" />
                  <div className="payment-done-route-item">
                    <div className="payment-done-route-dot dropoff" />
                    <div>
                      <span className="payment-done-route-label">Drop-off</span>
                      <span className="payment-done-route-value">
                        {ride.drop_location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div className="payment-done-method">
                  {isCash ? (
                    <Banknote size={16} />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  <span>
                    Paid via {isCash ? "Cash" : method === "upi" ? "UPI" : "Card"}
                  </span>
                </div>
              </div>
            )}

            {/* Go home button */}
            <button
              className="payment-done-home-btn"
              onClick={() => router.push("/dashboard")}
            >
              <Home size={18} />
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
