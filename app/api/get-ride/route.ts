import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ride_id = searchParams.get("ride_id");

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", ride_id)
    .single();

  if (error)
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });

  return NextResponse.json({ ride: data });
}
