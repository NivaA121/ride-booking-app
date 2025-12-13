// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ride_id, amount, rider_id } = body;

    if (!ride_id || !amount) {
      return NextResponse.json({ error: "ride_id and amount required" }, { status: 400 });
    }

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Ride Payment", description: `Ride ${ride_id}` },
            unit_amount: Math.round(amount * 100), // rupees -> paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        ride_id,
        rider_id: rider_id ?? "",
      },
      success_url: `${req.url.replace(/\/api\/.*$/, "")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.url.replace(/\/api\/.*$/, "")}/rider`,
    });

    return NextResponse.json({ sessionUrl: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("create-checkout error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
