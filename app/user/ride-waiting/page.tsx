"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Banknote,
  User,
  Car,
  Shield,
  Zap,
} from "lucide-react";

/* ── Types ── */
interface RideData {
  id: string;
  status: string;
  fare: number | null;
  pickup_location: string;
  drop_location: string;
}

/* ── Stars helper ── */
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 70}%`,
    size: `${1 + Math.random() * 3}px`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
  }));
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function RideWaitingPage() {
  return (
    <Suspense
      fallback={
        <div className="ride-wait-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Loading your trip...</div>
        </div>
      }
    >
      <RideWaitingContent />
    </Suspense>
  );
}

function RideWaitingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rideId = searchParams.get("rideId");
  const pickupParam = searchParams.get("pickup") ?? "Pickup Location";
  const dropoffParam = searchParams.get("dropoff") ?? "Dropoff Location";

  /* ── State ── */
  const [ride, setRide] = useState<RideData | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [showText, setShowText] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "upi" | "card"
  >("cash");
  const [driverAccepted, setDriverAccepted] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* Memoize stars so they don't regenerate on re-render */
  const stars = useMemo(() => generateStars(60), []);

  /* ── Seed mock ride data + listen for driver acceptance ── */
  useEffect(() => {
    if (!rideId) return;

    // Build a mock ride object from URL params — no Supabase needed
    const mockRide: RideData = {
      id: rideId,
      status: "requested",
      fare: null,
      pickup_location: pickupParam,
      drop_location: dropoffParam,
    };
    setRide(mockRide);

    // Check if already accepted (e.g. page refresh)
    function checkAccepted() {
      try {
        const all = JSON.parse(localStorage.getItem("mock_rides") || "[]");
        const found = all.find((r: { id: string; status: string; fare: number | null }) => r.id === rideId);
        if (found && found.status === "accepted" && found.fare !== null) {
          setRide({ ...mockRide, status: "accepted", fare: found.fare });
          setDriverAccepted(true);
        }
      } catch {}
    }

    checkAccepted();

    // Listen for driver accepting (same-tab custom event or cross-tab storage event)
    function onUpdate() { checkAccepted(); }
    window.addEventListener("mock_rides_updated", onUpdate);
    window.addEventListener("storage", onUpdate);

    return () => {
      window.removeEventListener("mock_rides_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideId]);


  /* ── Animation timeline ── */
  useEffect(() => {
    // Start the scene flying up after a short delay
    const flyTimer = setTimeout(() => {
      setSceneReady(true);
    }, 300);

    // Show text after scene settles
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 2500);

    return () => {
      clearTimeout(flyTimer);
      clearTimeout(textTimer);
    };
  }, []);


  /* ── Payment handler (mock — no Stripe) ── */
  const handlePayment = useCallback(async () => {
    if (!ride) return;
    setPaymentLoading(true);

    // Simulate a brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate directly to the success page with all data in URL params
    const params = new URLSearchParams({
      ride_id: ride.id,
      method: paymentMethod,
      fare: String(ride.fare ?? 0),
      pickup: ride.pickup_location,
      dropoff: ride.drop_location,
    });

    router.push(`/payment-success?${params.toString()}`);
  }, [ride, paymentMethod, router]);


  /* ── No rideId fallback ── */
  if (!rideId) {
    return (
      <div className="ride-wait-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#fff", zIndex: 10 }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>No ride found</h2>
          <Link href="/user/request" className="ride-wait-back" style={{ position: "relative" }}>
            <ArrowLeft size={18} />
            <span>Book a Ride</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-wait-page">
      {/* ─── Top Navigation ─── */}
      <nav className="ride-wait-topnav">
        <div className="ride-wait-topnav-brand" onClick={() => router.push("/dashboard")}>
          <div className="ride-wait-topnav-logo">
            <Zap size={16} />
          </div>
          <span className="ride-wait-topnav-name">RideFlow</span>
        </div>

        <div className="ride-wait-topnav-tabs">
          <button
            className="ride-wait-topnav-tab ride-wait-topnav-tab-active"
          >
            <User size={15} />
            <span>User</span>
          </button>
          <button
            className="ride-wait-topnav-tab"
            onClick={() => router.push(`/dashboard?tab=driver${rideId ? `&returnRideId=${rideId}` : ""}`)}
          >
            <Car size={15} />
            <span>Driver</span>
          </button>
          <button
            className="ride-wait-topnav-tab"
            onClick={() => router.push(`/dashboard?tab=admin${rideId ? `&returnRideId=${rideId}` : ""}`)}
          >
            <Shield size={15} />
            <span>Admin</span>
          </button>
        </div>

        <div style={{ width: 48 }} />
      </nav>

      {/* ─── Background — switches between waiting and accepted states ─── */}
      <div className="ride-wait-space-bg">
        <Image
          src="/waiting-bg.png"
          alt="Space background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="ride-wait-space-overlay" />
      </div>

      {/* ─── Twinkling stars ─── */}
      <div className="ride-wait-stars" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            className="ride-wait-star"
            style={{
              left: star.left,
              top: star.top,
              ["--star-size" as string]: star.size,
              ["--star-duration" as string]: star.duration,
              ["--star-delay" as string]: star.delay,
            }}
          />
        ))}
      </div>

      {/* ─── Planets ─── */}
      <div className="ride-wait-planet ride-wait-planet-1" aria-hidden="true">
        <Image
          src="/planet1-final.png"
          alt="Planet"
          width={220}
          height={220}
          priority
        />
      </div>
      <div className="ride-wait-planet ride-wait-planet-2" aria-hidden="true">
        <Image
          src="/planet2-final.png"
          alt="Planet"
          width={180}
          height={180}
          priority
        />
      </div>

      {/* ─── UFO ─── */}
      <div className="ride-wait-ufo" aria-hidden="true">
        <Image src="/ufo-final.png" alt="UFO" width={140} height={140} priority />
      </div>

      {/* ─── Text overlay ─── */}
      <div className={`ride-wait-text ${showText ? "visible" : ""}`}>
        <p className="ride-wait-subtitle">Space for thinking</p>
        <h1 className="ride-wait-title">
          Get ready
          <br />
          for your
          <br />
          <span className="ride-wait-title-accent">trip</span>
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════
           WAITING STATE — Astronaut + Bottom Card
           (shown before driver accepts, planet is in the background image)
           ═══════════════════════════════════════════════════ */}
      {!driverAccepted && (
        <>
          {/* Astronaut sitting on planet horizon */}
          <div className={`ride-wait-planet-astronaut ${sceneReady ? "visible" : ""}`}>
            <Image
              src="/astronaut-blue.png"
              alt="Astronaut"
              width={180}
              height={270}
              className="ride-wait-astronaut-img"
              priority
              unoptimized
            />
          </div>

          {/* Waiting card centered at bottom */}
          <div className={`ride-wait-bottom-card ${sceneReady ? "visible" : ""}`}>
            <div className="ride-wait-panel" id="ride-wait-panel">
              <div>
                <div className="ride-wait-status">
                  <div className="ride-wait-status-dot" />
                  <span className="ride-wait-status-text">
                    Waiting for driver
                    <span className="ride-wait-searching-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </span>
                </div>
                <p className="ride-wait-status-sub">
                  Hang tight! A driver will accept your ride shortly.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════
           ACCEPTED STATE — Astronaut + Rope + Card Scene
           (shown after driver accepts)
           ═══════════════════════════════════════════════════ */}
      {driverAccepted && (
        <div className={`ride-wait-scene ${sceneReady ? "scene-fly-up" : ""}`}>
          {/* ── Astronaut ── */}
          <div className="ride-wait-astronaut-wrapper">
            <Image
              src="/astronaut-blue.png"
              alt="Astronaut"
              width={260}
              height={390}
              className="ride-wait-astronaut-img"
              priority
              unoptimized
            />
          </div>

          {/* ── Rope (SVG) ── */}
          <svg
            className="ride-wait-rope-svg"
            viewBox="0 0 80 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ropeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f0c040" />
                <stop offset="30%" stopColor="#d4a020" />
                <stop offset="60%" stopColor="#c89418" />
                <stop offset="100%" stopColor="#f0c840" />
              </linearGradient>
              <filter id="ropeGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f0c040" floodOpacity="0.6" />
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>
            {/* Main thick rope strand */}
            <path
              d="M 40 0 C 35 40, 50 60, 45 100 C 40 140, 35 160, 40 200"
              fill="none"
              stroke="url(#ropeGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#ropeGlow)"
            />
            {/* Highlight strand */}
            <path
              d="M 43 0 C 38 40, 53 60, 48 100 C 43 140, 38 160, 43 200"
              fill="none"
              stroke="#ffe080"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Dark edge strand */}
            <path
              d="M 37 0 C 32 40, 47 60, 42 100 C 37 140, 32 160, 37 200"
              fill="none"
              stroke="#8a6010"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Twist texture marks */}
            <path d="M 37 20 Q 44 25, 38 32" fill="none" stroke="#ffe080" strokeWidth="1.5" opacity="0.6" />
            <path d="M 42 55 Q 52 60, 44 68" fill="none" stroke="#ffe080" strokeWidth="1.5" opacity="0.6" />
            <path d="M 47 90 Q 52 97, 44 104" fill="none" stroke="#ffe080" strokeWidth="1.5" opacity="0.6" />
            <path d="M 42 125 Q 38 133, 40 142" fill="none" stroke="#ffe080" strokeWidth="1.5" opacity="0.6" />
            <path d="M 37 160 Q 40 167, 38 175" fill="none" stroke="#ffe080" strokeWidth="1.5" opacity="0.6" />
          </svg>

          {/* ── Payment card with hole ── */}
          <div className="ride-wait-card-container">
            {/* Hole at top center of card */}
            <div className="ride-wait-card-hole">
              <div className="ride-wait-card-hole-inner" />
            </div>

            <div
              className="ride-wait-panel fare-revealed"
              id="ride-wait-panel"
            >
              <div className="ride-wait-fare-section">
                {/* Header with fare */}
                <div className="ride-wait-fare-header">
                  <div>
                    <p className="ride-wait-fare-label">Estimated Fare</p>
                    <p className="ride-wait-fare-amount">
                      ₹{ride?.fare?.toFixed(2) ?? "—"}
                    </p>
                  </div>
                  <div className="ride-wait-accepted-badge">
                    <CheckCircle2 size={14} />
                    Driver Accepted
                  </div>
                </div>

                {/* Route summary */}
                <div className="ride-wait-fare-route">
                  <span className="ride-wait-fare-route-dot pickup" />
                  <span style={{ maxWidth: "35%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ride?.pickup_location ?? "Pickup"}
                  </span>
                  <ArrowRight size={14} className="ride-wait-fare-route-arrow" />
                  <span className="ride-wait-fare-route-dot dropoff" />
                  <span style={{ maxWidth: "35%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ride?.drop_location ?? "Dropoff"}
                  </span>
                </div>

                {/* Payment method selection */}
                <p className="ride-wait-payment-label">Payment Method</p>
                <div className="ride-wait-payment-row">
                  <button
                    className={`ride-wait-payment-btn ${paymentMethod === "cash" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cash")}
                    id="payment-cash"
                  >
                    <Banknote size={16} />
                    Cash
                  </button>
                  <button
                    className={`ride-wait-payment-btn ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                    id="payment-upi"
                  >
                    <Smartphone size={16} />
                    UPI
                  </button>
                  <button
                    className={`ride-wait-payment-btn ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                    id="payment-card"
                  >
                    <CreditCard size={16} />
                    Card
                  </button>
                </div>

                {/* Pay button */}
                <button
                  className="ride-wait-pay-btn"
                  onClick={handlePayment}
                  id="ride-wait-pay"
                  disabled={paymentLoading}
                  style={{ opacity: paymentLoading ? 0.7 : 1 }}
                >
                  <Wallet size={18} />
                  {paymentLoading
                    ? "Processing..."
                    : paymentMethod === "cash"
                      ? "Pay on Arrival"
                      : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
