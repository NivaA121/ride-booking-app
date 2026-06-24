"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { User, Car, Shield, Zap, LogIn } from "lucide-react";

export type TabId = "user" | "driver" | "admin";

interface TopNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isPublic?: boolean;
}

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "user", label: "User", icon: User },
  { id: "driver", label: "Driver", icon: Car },
  { id: "admin", label: "Admin", icon: Shield },
];

export default function TopNav({ activeTab, onTabChange, isPublic }: TopNavProps) {
  const { isSignedIn } = useAuth();

  return (
    <nav className="top-nav">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink opacity-60" />

      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-pink flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold gradient-text hidden sm:block">
          RideFlow
        </h1>
      </div>

      {/* Center: Tabs (only show for authenticated users) */}
      {!isPublic && (
        <div className="top-nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`top-nav-tab ${isActive ? "top-nav-tab-active" : ""}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Right: User button or Sign In */}
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <div className="ring-2 ring-primary-500/30 rounded-full transition-all duration-300 hover:ring-primary-400/60">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <SignInButton mode="modal">
            <button
              id="sign-in-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white text-sm font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
            >
              <LogIn size={16} />
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
