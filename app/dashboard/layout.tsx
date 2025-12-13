import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main section */}
      <div className="flex flex-col flex-grow">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
