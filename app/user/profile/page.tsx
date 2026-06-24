"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { User, Phone, Image, Save } from "lucide-react";

export default function ProfilePage() {
  const { userId } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

      setUser(data);
      setName(data?.name || "");
      setPhone(data?.phone || "");
      setProfilePic(data?.profile_pic || "");
    }

    fetchUser();
  }, [userId]);

  async function updateUser() {
    const { error } = await supabase
      .from("users")
      .update({
        name,
        phone,
        profile_pic: profilePic,
      })
      .eq("clerk_id", userId);

    if (!error) alert("Profile Updated!");
  }

  if (!user)
    return (
      <div className="p-8 animate-fade-in">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="glass-card p-6 max-w-xl space-y-4">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    );

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Edit Profile</h1>

      <div className="glass-card max-w-xl p-6 space-y-5">
        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-300">
            <User size={14} className="text-primary-400" />
            Name
          </label>
          <input
            className="input-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-300">
            <Phone size={14} className="text-primary-400" />
            Phone
          </label>
          <input
            className="input-dark"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-300">
            <Image size={14} className="text-primary-400" />
            Profile Picture URL
          </label>
          <input
            className="input-dark"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={updateUser}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
