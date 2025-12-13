export async function POST(req: Request) {
  console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);

  return new Response("OK");
}
