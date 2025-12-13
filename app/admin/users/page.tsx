"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    supabase
      .from("users")
      .select("*")
      .then(({ data }) => {
        setUsers(data ?? []);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">All Users</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
