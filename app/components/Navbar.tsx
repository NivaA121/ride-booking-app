"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass-navbar sticky top-0 z-20 w-full h-16 flex items-center px-6 justify-between">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink opacity-60" />

      <h1 className="text-lg font-semibold text-white/90">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* Notification bell (decorative) */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-pink" />
        </button>

        {/* User button */}
        <div className="ring-2 ring-primary-500/30 rounded-full transition-all duration-300 hover:ring-primary-400/60">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
