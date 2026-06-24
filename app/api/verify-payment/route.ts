import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import supabase from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: "session_id required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const ride_id = session.metadata?.ride_id;
      if (ride_id) {
        // Update database
        const { error } = await supabase
          .from("rides")
          .update({ is_paid: true })
          .eq("id", ride_id);

        if (error) {
          console.error("Failed to update ride after payment verification:", error);
          return NextResponse.json({ error: "Failed to update db" }, { status: 500 });
        }
      }
      return NextResponse.json({ success: true, paid: true });
    }

    return NextResponse.json({ success: true, paid: false });
  } catch (err: any) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
