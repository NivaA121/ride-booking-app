"use client";

import { UserButton } from "@clerk/nextjs";

type DashboardClientProps = {
  userId: string | null;
};

export default function DashboardClient({ userId }: DashboardClientProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <div className="ring-2 ring-primary-500/30 rounded-full">
          <UserButton />
        </div>
      </div>

      <p className="mt-4 text-slate-400">
        Welcome, <span className="text-white font-medium">{userId}</span>
      </p>
    </div>
  );
}
