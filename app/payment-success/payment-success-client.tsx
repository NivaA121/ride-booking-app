"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>

      <p className="text-lg mb-2">
        Your payment has been processed successfully.
      </p>

      {sessionId && (
        <p className="text-gray-700 mb-6">
          Payment Session ID:
          <span className="font-mono text-sm ml-2">{sessionId}</span>
        </p>
      )}

      <Link
        href="/rides"
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Go Back to My Ride
      </Link>
    </div>
  );
}
