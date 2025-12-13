"use client";

import { UserButton } from "@clerk/nextjs";

type DashboardClientProps = {
  userId: string | null;
};

export default function DashboardClient({ userId }: DashboardClientProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <UserButton />
      </div>

      <p className="mt-4">Welcome, user: {userId}</p>
    </div>
  );
}
