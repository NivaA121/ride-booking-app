"use client";

import TopNav from "./TopNav";
import HeroSection from "./HeroSection";

export default function HomePage() {
  return (
    <div className="homepage-snap-container">
      {/* ── Navbar + Hero ── */}
      <div className="homepage-snap-section">
        <TopNav activeTab="user" onTabChange={() => {}} isPublic />
        <HeroSection />
      </div>
    </div>
  );
}
