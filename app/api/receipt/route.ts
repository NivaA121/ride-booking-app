import { PDFDocument, StandardFonts } from "pdf-lib";
import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rideId = searchParams.get("ride_id");

  if (!rideId) {
    return NextResponse.json({ error: "Missing ride_id" }, { status: 400 });
  }

  const { data: ride } = await supabase
    .from("rides")
    .select("*")
    .eq("id", rideId)
    .single();

  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("Ride Receipt", { x: 50, y: 750, size: 22, font });
  page.drawText(`Ride ID: ${rideId}`, { x: 50, y: 700, size: 14, font });
  page.drawText(`Pickup: ${ride.pickup_location}`, { x: 50, y: 650, size: 14, font });
  page.drawText(`Dropoff: ${ride.drop_location}`, { x: 50, y: 620, size: 14, font });
  page.drawText(`Fare: ₹${ride.fare}`, { x: 50, y: 590, size: 14, font });
  page.drawText(`Status: ${ride.status}`, { x: 50, y: 560, size: 14, font });

  // Save PDF
  const pdfBytes = await pdfDoc.save();

  // FIX: Convert Uint8Array → Buffer to satisfy NextResponse
  const pdfBuffer = Buffer.from(pdfBytes);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${rideId}.pdf"`,
    },
  });
}
