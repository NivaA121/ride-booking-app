import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HomePage from "./components/HomePage";

export default async function Home() {
  const session = await auth();
  const userId = session.userId;

  if (userId) {
    redirect("/dashboard");
  }

  return <HomePage />;
}
