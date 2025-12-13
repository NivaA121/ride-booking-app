"use client";

import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

export default function PlacesInput({ label, onSelect }: any) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const inputRef = useRef<any>(null);

  if (!isLoaded) return <p>Loading maps…</p>;

  function handlePlaceChanged() {
    const place = inputRef.current.getPlace();
    if (!place?.geometry) return;

    onSelect({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  }

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>

      <Autocomplete onLoad={(ref) => (inputRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
        <input
          type="text"
          placeholder={`Search ${label}`}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </Autocomplete>
    </div>
  );
}
