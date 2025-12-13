import supabase from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { ride_id, status, driver_id } = body;

  const { data, error } = await supabase
    .from("rides")
    .update({ status, driver_id })
    .eq("id", ride_id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data[0]);
}
