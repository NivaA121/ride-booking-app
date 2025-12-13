"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function UserDashboard() {
  const { userId } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

      if (!error) setUser(data);
    }

    fetchUser();
  }, [userId]);

  if (!user) return <p className="mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <div className="p-6 border rounded-xl shadow max-w-lg">
        <div className="flex items-center gap-4">
          <img
            src={user.profile_pic || "/default-avatar.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <a
          href="/user/profile"
          className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg"
        >
          Edit Profile
        </a>
      </div>
    </div>
  );
}
