"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Car,
  MapPin,
  LayoutDashboard,
  CreditCard,
  Shield,
  Users,
  Route,
  Settings,
  Zap,
} from "lucide-react";

const mainMenu = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "My Rides", path: "/rides", icon: Car },
  { name: "Request Ride", path: "/user/request", icon: MapPin },
  { name: "Driver Dashboard", path: "/driver/dashboard", icon: LayoutDashboard },
  { name: "Payments", path: "/payments", icon: CreditCard },
];

const adminMenu = [
  { name: "Rides", path: "/admin/rides", icon: Route },
  { name: "Drivers", path: "/admin/drivers", icon: Car },
  { name: "Payments", path: "/admin/payments", icon: CreditCard },
  { name: "Users", path: "/admin/users", icon: Users },
];

const bottomMenu = [
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const renderLink = (item: { name: string; path: string; icon: any }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <li key={item.path}>
        <Link
          href={item.path}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
            active
              ? "bg-gradient-to-r from-primary-500/20 to-accent-purple/10 text-white border-l-2 border-primary-400"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon
            size={18}
            className={`transition-all duration-300 ${
              active
                ? "text-primary-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                : "text-slate-500 group-hover:text-primary-400"
            }`}
          />
          <span className={active ? "animate-slide-in-left" : ""}>
            {item.name}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 fixed top-4 left-4 bg-dark-700/80 backdrop-blur text-white rounded-xl z-50 border border-white/10 transition-all duration-300 hover:border-primary-400/30"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 glass-sidebar p-5 transform
        transition-transform duration-300 z-40 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-pink flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">RideFlow</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-3 px-3">
            Main
          </p>
          <ul className="space-y-1 mb-6">
            {mainMenu.map(renderLink)}
          </ul>

          <div className="h-px bg-white/5 mx-3 mb-4" />

          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-3 px-3">
            Admin
          </p>
          <ul className="space-y-1 mb-6">
            {adminMenu.map(renderLink)}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-4">
          <ul className="space-y-1">
            {bottomMenu.map(renderLink)}
          </ul>
        </div>
      </div>
    </>
  );
}
