"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* Helper: wraps each character in an animated <span> */
function AnimatedLetters({
  text,
  startIndex,
  className,
}: {
  text: string;
  startIndex: number;
  className?: string;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={startIndex + i}
          className={`hero-letter ${className ?? ""}`}
          style={{ animationDelay: `${(startIndex + i) * 45}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

export default function HeroSection() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Small delay so the browser paints the initial frame first
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const line1 = "Your Ride,";
  const line2 = "Anytime –";
  const line3 = "Anywhere";

  return (
    <section className="hero-section" id="hero-section">
      {/* Background image */}
      <div className="hero-bg">
        <img src="/hero-bg.png" alt="" aria-hidden="true" />
        <div className="hero-bg-overlay" />
      </div>

      {/* Decorative amber glow */}
      <div className="hero-glow" />

      {/* Content */}
      <div className="hero-content">
        {/* Left — text */}
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="hero-title-line">
              <AnimatedLetters text={line1} startIndex={0} />
            </span>
            <span className="hero-title-line">
              <AnimatedLetters
                text={line2}
                startIndex={line1.length}
                className="hero-title-accent-letter"
              />
            </span>
            <span className="hero-title-line">
              <AnimatedLetters
                text={line3}
                startIndex={line1.length + line2.length}
                className="hero-title-accent-letter"
              />
            </span>
          </h1>

          <p className="hero-subtitle">
            Book Your Cab In Seconds And Travel With Comfort, Reliability, And
            Peace Of Mind.
          </p>

          <Link href="/user/request" className="hero-btn" id="hero-book-btn">
            Book A Taxi
          </Link>
        </div>

        {/* Right — animated car */}
        <div className={`hero-car-wrapper ${animate ? "hero-car-animate" : ""}`}>
          <img
            src="/hero-car.png"
            alt="Yellow taxi cab"
            className="hero-car-img"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
