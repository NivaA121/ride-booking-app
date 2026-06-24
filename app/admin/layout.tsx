import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900">
      <main className="p-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
