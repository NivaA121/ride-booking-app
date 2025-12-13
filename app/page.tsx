import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();      // ✅ MUST await
  const userId = session.userId;     // ✅ Now works

  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }

  return null;
}
