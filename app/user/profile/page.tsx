"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";

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

  if (!user) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <div className="max-w-xl p-6 border rounded-xl shadow">
        
        <label className="block mb-2 font-medium">Name</label>
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2 font-medium">Phone</label>
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block mb-2 font-medium">Profile Picture URL</label>
        <input
          className="border px-3 py-2 rounded w-full mb-4"
          value={profilePic}
          onChange={(e) => setProfilePic(e.target.value)}
        />

        <button
          onClick={updateUser}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
