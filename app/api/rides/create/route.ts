import supabase from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    rider_id,
    pickup_location,
    drop_location,
    pickup_lat,
    pickup_lng,
    drop_lat,
    drop_lng,
    fare
  } = body;

  const { data, error } = await supabase
    .from("rides")
    .insert([{
      rider_id,
      pickup_location,
      drop_location,
      pickup_lat,
      pickup_lng,
      drop_lat,
      drop_lng,
      fare
    }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data[0]);
}
