import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ⬅ apiVersion removed

export async function POST(req: Request) {
  const { driver_id } = await req.json();

  const account = await stripe.accounts.create({
    type: "express",
    country: "IN",
    email: "driver@example.com",
    capabilities: {
      transfers: { requested: true },
    },
  });

  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:3000/driver/dashboard",
    return_url: "http://localhost:3000/driver/dashboard",
    type: "account_onboarding",
  });

  return NextResponse.json({ url: link.url });
}
