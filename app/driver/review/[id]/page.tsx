// app/driver/review/[id]/page.tsx

import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function DriverReviews({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("ratings")
    .select("*")
    .eq("driver_id", params.id);

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>

      {data?.map((r) => (
        <div key={r.id} className="p-4 bg-white rounded-lg shadow mb-3">
          <p className="font-bold">⭐ {r.rating}</p>
          <p className="text-gray-700">{r.review}</p>
          <p className="text-gray-400 text-sm">
            {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
