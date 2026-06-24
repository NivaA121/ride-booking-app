"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function ReceiptPage({ searchParams }: any) {
  const rideId = searchParams.ride_id;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submitRating() {
    const res = await fetch("/api/rate", {
      method: "POST",
      body: JSON.stringify({
        ride_id: rideId,
        rider_id: "YOUR_USER_ID",
        driver_id: "DRIVER_ID_HERE",
        rating,
        review,
      }),
    });

    if (res.ok) setSubmitted(true);
  }

  if (submitted)
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="glass-card p-10 text-center max-w-md">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-400/20 flex items-center justify-center">
            <Star size={32} className="text-yellow-400 fill-yellow-400" />
          </div>
          <h2 className="text-xl font-bold gradient-text mb-2">Thank You!</h2>
          <p className="text-slate-400">
            Your review has been submitted successfully.
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 animate-fade-in">
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold mb-6 gradient-text">
          Rate Your Ride
        </h2>

        {/* Interactive Star Rating */}
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoveredRating(s)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all duration-200 hover:scale-125"
            >
              <Star
                size={36}
                className={`transition-all duration-200 ${
                  (hoveredRating || rating) >= s
                    ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                    : "text-slate-600"
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm text-yellow-400 mb-4">
            {rating === 5
              ? "Excellent! ⭐"
              : rating === 4
              ? "Great!"
              : rating === 3
              ? "Good"
              : rating === 2
              ? "Fair"
              : "Poor"}
          </p>
        )}

        {/* Review Box */}
        <textarea
          placeholder="Write a quick review..."
          className="input-dark min-h-[100px] resize-none"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={submitRating}
          className="mt-5 w-full btn-primary flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Submit Review
        </button>
      </div>
    </div>
  );
}
