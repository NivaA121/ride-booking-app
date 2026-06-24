import { Users, Car, Route } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
      <p className="text-slate-400 text-sm mb-8">
        Overview of your platform metrics
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card group">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Users size={22} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Users</p>
              <h2 className="text-2xl font-bold text-white">—</h2>
            </div>
          </div>
          <div className="h-1 w-full rounded bg-dark-600 overflow-hidden">
            <div className="h-full w-2/3 rounded bg-gradient-to-r from-primary-500 to-accent-purple" />
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-400/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Car size={22} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Drivers</p>
              <h2 className="text-2xl font-bold text-white">—</h2>
            </div>
          </div>
          <div className="h-1 w-full rounded bg-dark-600 overflow-hidden">
            <div className="h-full w-1/2 rounded bg-gradient-to-r from-green-500 to-emerald-400" />
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Route size={22} className="text-accent-pink" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Rides</p>
              <h2 className="text-2xl font-bold text-white">—</h2>
            </div>
          </div>
          <div className="h-1 w-full rounded bg-dark-600 overflow-hidden">
            <div className="h-full w-3/4 rounded bg-gradient-to-r from-accent-pink to-accent-purple" />
          </div>
        </div>
      </div>
    </div>
  );
}
