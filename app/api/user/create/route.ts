import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clerk_id, name, email } = body;

    // Prevent duplicate users
    const existing = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerk_id)
      .single();

    if (existing.data) {
      return NextResponse.json(existing.data, { status: 200 });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          clerk_id,
          name,
          email,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong", details: err },
      { status: 500 }
    );
  }
}
