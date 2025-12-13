import { Suspense } from "react";
import PaymentSuccessClient from "./payment-success-client";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}