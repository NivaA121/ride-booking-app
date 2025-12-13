import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { ride_id, rider_id, driver_id, rating, review } = await req.json();

  const { error } = await supabase.from("ratings").insert([
    { ride_id, rider_id, driver_id, rating, review },
  ]);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ message: "Rating submitted!" });
}
