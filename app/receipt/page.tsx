"use client";

import { useState } from "react";

export default function ReceiptPage({ searchParams }: any) {
  const rideId = searchParams.ride_id;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submitRating() {
    const res = await fetch("/api/rate", {
      method: "POST",
      body: JSON.stringify({
        ride_id: rideId,
        rider_id: "YOUR_USER_ID", // replace with session user ID
        driver_id: "DRIVER_ID_HERE", // load from ride
        rating,
        review,
      }),
    });

    if (res.ok) setSubmitted(true);
  }

  if (submitted)
    return <p className="text-center text-green-600 mt-10">⭐ Thank you for your review!</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Rate Your Ride</h2>

      {/* Star Rating */}
      <div className="flex gap-2 mb-4">
        {[1,2,3,4,5].map(s => (
          <span
            key={s}
            onClick={() => setRating(s)}
            className={`text-3xl cursor-pointer ${rating >= s ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Review Box */}
      <textarea
        placeholder="Write a quick review..."
        className="w-full border rounded p-3"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <button
        onClick={submitRating}
        className="mt-4 w-full bg-black text-white py-3 rounded-lg"
      >
        Submit Review
      </button>
    </div>
  );
}
