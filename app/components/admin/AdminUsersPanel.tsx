"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Users } from "lucide-react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    supabase
      .from("users")
      .select("*")
      .then(({ data }) => {
        setUsers(data ?? []);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Users size={20} className="text-primary-400" />
        <h2 className="text-2xl font-bold text-white">All Users</h2>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="dark-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-slate-500 py-8">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-white">
                    {u.name || "—"}
                  </td>
                  <td>{u.email || "—"}</td>
                  <td>{u.phone || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
