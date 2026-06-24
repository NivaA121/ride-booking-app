// app/driver/review/[id]/page.tsx

import { createClient } from "@supabase/supabase-js";
import { Star } from "lucide-react";

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
    <div className="max-w-xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Driver Reviews</h1>

      {(!data || data.length === 0) && (
        <div className="glass-card p-10 text-center">
          <Star size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No reviews yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {data?.map((r) => (
          <div key={r.id} className="glass-card p-5 animate-slide-up">
            {/* Star display */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={`${
                    r.rating >= s
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
              <span className="text-sm text-yellow-400 font-semibold ml-2">
                {r.rating}/5
              </span>
            </div>

            <p className="text-slate-300 text-sm mb-2">{r.review}</p>

            <p className="text-slate-500 text-xs">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
