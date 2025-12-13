import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { pickup_lat, pickup_lng, drop_lat, drop_lng } = body;

  // Haversine formula
  function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
  }

  const dist = distance(pickup_lat, pickup_lng, drop_lat, drop_lng);

  const fare = Math.round(50 + dist * 12); // ₹50 base + ₹12/km

  return NextResponse.json({ fare, distance: dist });
}
