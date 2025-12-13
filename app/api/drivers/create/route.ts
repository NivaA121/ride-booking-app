import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, license_number, vehicle_number, vehicle_model } = body;

    const { data, error } = await supabase
      .from("drivers")
      .insert([
        {
          user_id,
          license_number,
          vehicle_number,
          vehicle_model,
          current_lat: 0,
          current_lng: 0,
          is_online: false,
          is_verified: false
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong", err },
      { status: 500 }
    );
  }
}
