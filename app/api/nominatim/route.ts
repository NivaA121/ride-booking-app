import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

    const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(
      q
    )}&format=json&limit=5&countrycodes=in`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("LocationIQ error:", error);
    return NextResponse.json([]);
  }
}
