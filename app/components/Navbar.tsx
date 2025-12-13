"use client";

import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-white shadow flex items-center px-6 justify-between">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
