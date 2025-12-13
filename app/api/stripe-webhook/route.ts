import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import supabase from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // -------------------------------
  // PAYMENT COMPLETED EVENT
  // -------------------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const rideId = session.metadata?.ride_id;
    const paymentIntentId = session.payment_intent as string;

    // ------------------------------------------------------------------
    // FETCH RECEIPT URL SAFELY (TypeScript Correct Way)
    // ------------------------------------------------------------------
    let receipt_url: string | null = null;

    try {
      // Step 1: retrieve PI & expand charge ID
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["latest_charge"],
      });

      const chargeId = pi.latest_charge as string | null;

      // Step 2: retrieve actual charge to access receipt_url
      if (chargeId) {
        const charge = await stripe.charges.retrieve(chargeId);
        receipt_url = charge.receipt_url || null;
      }
    } catch (e) {
      console.log("Could not fetch receipt:", e);
    }

    // ------------------------------------------------------------------
    // UPDATE RIDE IN SUPABASE
    // ------------------------------------------------------------------
    if (rideId) {
      await supabase
        .from("rides")
        .update({
          is_paid: true,
          status: "completed", // update status to completed
          payment_id: paymentIntentId,
          receipt_url,
        })
        .eq("id", rideId);

      console.log("✅ Ride updated successfully!");
    }
  }

  return NextResponse.json({ received: true });
}
