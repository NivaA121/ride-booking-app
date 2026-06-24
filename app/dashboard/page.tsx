"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopNav, { TabId } from "../components/TopNav";
import UserPanel from "../components/UserPanel";
import DriverPanel from "../components/DriverPanel";
import AdminPanel from "../components/AdminPanel";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const returnRideId = searchParams.get("returnRideId");
  const [activeTab, setActiveTab] = useState<TabId>("user");

  useEffect(() => {
    if (tabParam === "driver" || tabParam === "admin" || tabParam === "user") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  /* When "User" tab is clicked, go back to ride-waiting page if we came from there */
  const handleTabChange = useCallback(
    (tab: TabId) => {
      if (tab === "user" && returnRideId) {
        router.push(`/user/ride-waiting?rideId=${returnRideId}`);
        return;
      }
      setActiveTab(tab);
    },
    [returnRideId, router]
  );

  return (
    <div className="min-h-screen bg-dark-900">
      <TopNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="p-6 animate-fade-in">
        {activeTab === "user" && <UserPanel />}
        {activeTab === "driver" && <DriverPanel />}
        {activeTab === "admin" && <AdminPanel />}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <DashboardContent />
    </Suspense>
  );
}
