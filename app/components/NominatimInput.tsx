"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, MapPin } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Position the portal-rendered dropdown below the input
  const updateDropdownPosition = useCallback(() => {
    if (inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        !(event.target as Element)?.closest?.(".nominatim-dropdown")
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reposition dropdown on scroll / resize
  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  const searchPlaces = async (query: string) => {
    onChange(query);

    if (query.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const res = await fetch(`/api/nominatim?q=${query}`);
      const data = await res.json();
      setResults(data || []);
      if (data && data.length > 0) {
        setIsOpen(true);
        updateDropdownPosition();
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setIsOpen(false);
    }
  };

  const dropdown =
    isOpen && results.length > 0
      ? createPortal(
          <ul className="nominatim-dropdown" style={dropdownStyle}>
            {results.map((place) => (
              <li
                key={place.place_id}
                className="nominatim-dropdown-item"
                onClick={() => {
                  onSelect(place.lat, place.lon, place.display_name);
                  setResults([]);
                  setIsOpen(false);
                }}
              >
                <MapPin size={14} className="nominatim-dropdown-icon" />
                <span>{place.display_name}</span>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <div className="nominatim-input-wrapper" ref={wrapperRef}>
      <label className="nominatim-label">{label}</label>

      <div className="nominatim-input-container" ref={inputContainerRef}>
        <Search size={16} className="nominatim-search-icon" />
        <input
          value={value}
          onChange={(e) => searchPlaces(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
              updateDropdownPosition();
            }
          }}
          className="input-dark pl-10"
          style={{ paddingLeft: '2.5rem' }}
          placeholder={`Search ${label.toLowerCase()}...`}
        />
      </div>

      {dropdown}
    </div>
  );
}
