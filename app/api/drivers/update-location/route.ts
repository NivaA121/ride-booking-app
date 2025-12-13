import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { driver_id, lat, lng } = await req.json();

    if (!driver_id || !lat || !lng) {
      return NextResponse.json(
        { error: "Missing driver_id, lat or lng" },
        { status: 400 }
      );
    }

    const { error } = await supabase
  .from("drivers")
  .update({
    current_lat: lat,
    current_lng: lng,
    updated_at: new Date().toISOString(),
  })
  .eq("user_id", driver_id); // 👈 match TEXT user_id

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("UPDATE DRIVER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}
