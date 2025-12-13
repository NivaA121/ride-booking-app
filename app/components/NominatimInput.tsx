"use client";

import { useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (lat: number, lon: number, displayName: string) => void;
}

export default function NominatimInput({
  label,
  value,
  onChange,
  onSelect,
}: Props) {
  const [results, setResults] = useState<any[]>([]);

  const searchPlaces = async (query: string) => {
    onChange(query);

    if (query.length < 3) return;

    try {
  const res = await fetch(`/api/nominatim?q=${query}`);
  const data = await res.json();
  setResults(data || []);
} catch (err) {
  console.error("Search failed:", err);
  setResults([]);
}

  };

  return (
    <div className="mb-5">
      <label className="block mb-2 font-medium">{label}</label>

      <input
        value={value}
        onChange={(e) => searchPlaces(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
        placeholder={`Search ${label}`}
      />

      {results.length > 0 && (
        <ul className="border rounded-lg bg-white mt-2 max-h-40 overflow-auto shadow">
          {results.map((place) => (
            <li
              key={place.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(place.lat, place.lon, place.display_name);
                setResults([]);
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
