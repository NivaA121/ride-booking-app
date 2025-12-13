"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Home", path: "/dashboard" },
    { name: "My Rides", path: "/rides" },
    { name: "Request Ride", path: "/user/request" },
    { name: "Driver Dashboard", path: "/driver/dashboard" },
    { name: "Payments", path: "/payments" },

    // Admin
    { name: "Admin: Rides", path: "/admin/rides" },
    { name: "Admin: Drivers", path: "/admin/drivers" },
    { name: "Admin: Payments", path: "/admin/payments" },

    { name: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 fixed top-3 left-3 bg-black text-white rounded-lg z-50"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-56 bg-white shadow-lg p-5 transform
        transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h1 className="text-xl font-bold mb-6">Uber Clone</h1>

        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md ${
                  pathname === item.path
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
