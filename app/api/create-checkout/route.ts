import Stripe from "stripe";
import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { ride_id, payment_method } = await req.json();

  if (!ride_id) {
    return NextResponse.json({ error: "Missing ride_id" }, { status: 400 });
  }

  const { data: ride, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", ride_id)
    .single();

  if (error || !ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&ride_id=${ride_id}&method=${payment_method || "card"}`,

    cancel_url: `http://localhost:3000/user/ride-waiting?rideId=${ride_id}`,

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Uber Ride Fare",
          },
          unit_amount: Math.round(Number(ride.fare) * 100),
        },
        quantity: 1,
      },
    ],

    // ******* IMPORTANT PART ********
    metadata: {
      ride_id: ride.id,
      driver_id: ride.driver_id, // must exist in DB
      payment_method: payment_method || "card",
    },
  });

  return NextResponse.json({ url: session.url });
}
