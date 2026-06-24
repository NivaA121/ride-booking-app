"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import NominatimInput from "@/app/components/NominatimInput";
import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Car,
  Gem,
  ArrowLeft,
  Zap,
  User,
  Phone,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const OSMMap = dynamic(() => import("../../components/OSMMap"), {
  ssr: false,
});

/* ── Floating yellow ball type ── */
interface Ball {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
}

/* ── Animated background component ── */
function FloatingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animFrame = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Create balls
    const NUM_BALLS = 8;
    const REPEL_RADIUS = 180;
    const REPEL_STRENGTH = 8;
    const MAX_SPEED = 6;

    ballsRef.current = Array.from({ length: NUM_BALLS }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 40 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 3.5,
      opacity: 0.55 + Math.random() * 0.4,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      const balls = ballsRef.current;
      const mouse = mouseRef.current;

      for (const ball of balls) {
        // Mouse repulsion
        const dx = ball.x - mouse.x;
        const dy = ball.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const effectRadius = REPEL_RADIUS + ball.size;

        if (dist < effectRadius && dist > 0) {
          const force = (1 - dist / effectRadius) * REPEL_STRENGTH;
          ball.vx += (dx / dist) * force;
          ball.vy += (dy / dist) * force;
        }

        // Apply friction so balls slow down after being pushed
        ball.vx *= 0.98;
        ball.vy *= 0.98;

        // Cap speed
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed > MAX_SPEED) {
          ball.vx = (ball.vx / speed) * MAX_SPEED;
          ball.vy = (ball.vy / speed) * MAX_SPEED;
        }

        // Keep a minimum drift so balls don't stop completely
        if (speed < 0.3) {
          ball.vx += (Math.random() - 0.5) * 0.5;
          ball.vy += (Math.random() - 0.5) * 0.5;
        }

        // Move
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off edges — clamp inside
        if (ball.x - ball.size < 0) {
          ball.x = ball.size;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x + ball.size > canvas!.width) {
          ball.x = canvas!.width - ball.size;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y - ball.size < 0) {
          ball.y = ball.size;
          ball.vy = Math.abs(ball.vy);
        } else if (ball.y + ball.size > canvas!.height) {
          ball.y = canvas!.height - ball.size;
          ball.vy = -Math.abs(ball.vy);
        }

        // Draw solid circle
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 185, 0, ${ball.opacity})`;
        ctx.fill();
      }

      animFrame.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="booking-canvas"
      aria-hidden="true"
    />
  );
}

export default function RequestRidePage() {
  const { userId } = useAuth();
  const router = useRouter();

  /* ── Form state ── */
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [carType, setCarType] = useState<"sedan" | "luxury">("sedan");

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  /* ── Ride request (mock — no Supabase) ── */
  async function handleRideRequest() {
    if (!pickupCoords || !dropoffCoords) {
      alert("Please select valid pickup & dropoff locations.");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    // Simulate a short network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate a mock ride and store it so the Driver panel can see it
    const mockRideId = `mock_${Date.now()}`;
    const mockRide = {
      id: mockRideId,
      pickup_location: pickup,
      drop_location: dropoff,
      pickup_lat: pickupCoords.lat,
      pickup_lng: pickupCoords.lon,
      drop_lat: dropoffCoords.lat,
      drop_lng: dropoffCoords.lon,
      status: "requested",
      fare: null,
      rider_id: "mock_rider",
    };

    // Persist to localStorage so DriverPanel can display it
    const existing = JSON.parse(localStorage.getItem("mock_rides") || "[]");
    existing.unshift(mockRide);
    localStorage.setItem("mock_rides", JSON.stringify(existing));
    // Notify other tabs/components
    window.dispatchEvent(new Event("mock_rides_updated"));

    const params = new URLSearchParams({
      rideId: mockRideId,
      pickup: pickup,
      dropoff: dropoff,
    });

    router.push(`/user/ride-waiting?${params.toString()}`);
  }

  // Show map preview when both locations are selected
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      setShowMap(true);
    }
  }, [pickupCoords, dropoffCoords]);

  return (
    <div className="booking-page">
      {/* Animated background */}
      <FloatingBalls />

      {/* Back button */}
      <Link href="/dashboard" className="booking-back-btn" id="booking-back-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </Link>

      {/* Main content */}
      <div className="booking-container">
        {/* ─── LEFT SIDE: Hero text ─── */}
        <div className="booking-hero">
          <h1 className="booking-hero-title">
            Your Ride is Just a
            <br />
            <span className="booking-hero-accent">Click Away</span>
          </h1>

          <p className="booking-hero-desc">
            Book a safe, comfortable, and affordable cab instantly. Whether
            you&apos;re traveling within the city, going outstation, or need an
            airport pickup – we&apos;ve got you covered. Choose your ride, enter
            your details, and get ready to travel hassle-free!
          </p>

          <button
            className="booking-readmore-btn"
            onClick={() => {
              const formEl = document.getElementById("booking-form-card");
              formEl?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Read More
          </button>
        </div>

        {/* ─── RIGHT SIDE: Booking form ─── */}
        <div className="booking-form-card" id="booking-form-card">
          {/* Passenger Details */}
          <h2 className="booking-section-title">Passenger Details</h2>
          <div className="booking-row">
            <div className="booking-input-wrap">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="booking-input"
                id="booking-name"
              />
              <User size={16} className="booking-input-icon" />
            </div>
            <div className="booking-input-wrap">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="booking-input"
                id="booking-mobile"
              />
              <Phone size={16} className="booking-input-icon" />
            </div>
          </div>

          {/* Pickup Details */}
          <h2 className="booking-section-title">Pickup Details</h2>
          <div className="booking-row">
            <div className="booking-nominatim-wrap">
              <NominatimInput
                label=""
                value={pickup}
                onChange={setPickup}
                onSelect={(lat, lon, n) => {
                  setPickup(n);
                  setPickupCoords({ lat, lon });
                }}
              />
            </div>
            <div className="booking-nominatim-wrap">
              <NominatimInput
                label=""
                value={dropoff}
                onChange={setDropoff}
                onSelect={(lat, lon, n) => {
                  setDropoff(n);
                  setDropoffCoords({ lat, lon });
                }}
              />
            </div>
          </div>
          <div className="booking-row">
            <div className="booking-input-wrap">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="booking-input"
                id="booking-date"
              />
              <Calendar size={16} className="booking-input-icon" />
            </div>
            <div className="booking-input-wrap">
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="booking-input"
                id="booking-time"
              />
              <Clock size={16} className="booking-input-icon" />
            </div>
          </div>

          {/* Trip Type & Car Type */}
          <div className="booking-row">
            <div className="booking-toggle-group">
              <label className="booking-toggle-label">Trip Type</label>
              <div className="booking-toggle-row">
                <button
                  className={`booking-toggle-btn ${tripType === "one-way" ? "booking-toggle-active" : ""}`}
                  onClick={() => setTripType("one-way")}
                  id="trip-oneway"
                >
                  One Way
                </button>
                <button
                  className={`booking-toggle-btn ${tripType === "round-trip" ? "booking-toggle-active" : ""}`}
                  onClick={() => setTripType("round-trip")}
                  id="trip-roundtrip"
                >
                  Round Trip
                </button>
              </div>
            </div>
            <div className="booking-toggle-group">
              <label className="booking-toggle-label">Car Type</label>
              <div className="booking-toggle-row">
                <button
                  className={`booking-toggle-btn ${carType === "sedan" ? "booking-toggle-active" : ""}`}
                  onClick={() => setCarType("sedan")}
                  id="car-sedan"
                >
                  <Car size={14} />
                  Sedan
                </button>
                <button
                  className={`booking-toggle-btn ${carType === "luxury" ? "booking-toggle-active" : ""}`}
                  onClick={() => setCarType("luxury")}
                  id="car-luxury"
                >
                  <Gem size={14} />
                  Luxury Car
                </button>
              </div>
            </div>
          </div>

          {/* Book Now */}
          <button
            onClick={handleRideRequest}
            disabled={isSubmitting}
            className="booking-submit-btn"
            id="booking-submit"
          >
            {isSubmitting ? (
              <>
                <Zap size={18} className="animate-spin" />
                Booking...
              </>
            ) : (
              "Book Now"
            )}
          </button>
        </div>
      </div>

      {/* Map preview below (shows when both locations set) */}
      {showMap && pickupCoords && dropoffCoords && (
        <div className="booking-map-section">
          <h2 className="booking-map-title">
            <Navigation size={18} />
            Route Preview
          </h2>
          <div className="booking-map-wrapper">
            <OSMMap pickup={pickupCoords} dropoff={dropoffCoords} />
          </div>
        </div>
      )}
    </div>
  );
}
