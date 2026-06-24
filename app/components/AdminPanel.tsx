"use client";

import { useState } from "react";
import { Route, Car, CreditCard, Users } from "lucide-react";
import AdminRidesPanel from "./admin/AdminRidesPanel";
import AdminDriversPanel from "./admin/AdminDriversPanel";
import AdminPaymentsPanel from "./admin/AdminPaymentsPanel";
import AdminUsersPanel from "./admin/AdminUsersPanel";

type AdminSection = "rides" | "drivers" | "payments" | "users";

const sections: { id: AdminSection; label: string; icon: typeof Route }[] = [
  { id: "rides", label: "Rides", icon: Route },
  { id: "drivers", label: "Drivers", icon: Car },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "users", label: "Users", icon: Users },
];

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<AdminSection>("rides");

  return (
    <div className="animate-fade-in">
      {/* Admin Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 gradient-text">Admin Panel</h1>
        <p className="text-slate-400 text-sm">
          Manage rides, drivers, payments, and users
        </p>
      </div>

      {/* Section Tabs */}
      <div className="admin-section-tabs">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              id={`admin-tab-${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`admin-section-tab ${isActive ? "admin-section-tab-active" : ""}`}
            >
              <Icon size={18} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="mt-6 animate-fade-in">
        {activeSection === "rides" && <AdminRidesPanel />}
        {activeSection === "drivers" && <AdminDriversPanel />}
        {activeSection === "payments" && <AdminPaymentsPanel />}
        {activeSection === "users" && <AdminUsersPanel />}
      </div>
    </div>
  );
}
