export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Total Users</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Total Drivers</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">Total Rides</h2>
        </div>
      </div>
    </div>
  );
}
