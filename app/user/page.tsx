"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { User, Mail, Pencil } from "lucide-react";

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

  if (!user)
    return (
      <div className="p-8 animate-fade-in">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="glass-card p-6 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="skeleton w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-3 w-48" />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Your Dashboard</h1>

      <div className="glass-card p-6 max-w-lg">
        <div className="flex items-center gap-5">
          {/* Avatar with gradient ring */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-primary-500 via-accent-purple to-accent-pink">
              <img
                src={user.profile_pic || "/default-avatar.png"}
                className="w-full h-full rounded-full object-cover border-2 border-dark-800"
                alt="Profile"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-dark-800" />
          </div>

          <div>
            <p className="text-lg font-semibold text-white flex items-center gap-2">
              <User size={16} className="text-primary-400" />
              {user.name || "No name set"}
            </p>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <Mail size={14} className="text-slate-500" />
              {user.email || "No email"}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/5 my-5" />

        <a
          href="/user/profile"
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          <Pencil size={14} />
          Edit Profile
        </a>
      </div>
    </div>
  );
}
