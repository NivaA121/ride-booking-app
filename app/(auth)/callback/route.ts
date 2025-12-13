import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    await fetch(`${baseUrl}/api/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_id: userId,
        name: user.fullName || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
      }),
    });

    // IMPORTANT: absolute URL only!
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return NextResponse.json({ error: "Callback failed" }, { status: 500 });
  }
}
