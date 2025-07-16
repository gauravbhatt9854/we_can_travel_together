'use client';
import React from 'react';

interface Props {
  label: string;
  query: string;
  setQuery: (val: string) => void;
  suggestions: any[];
  onSelect: (place: any) => void;
  disabled: boolean;
}

export default function LocationInput2({
  label,
  query,
  setQuery,
  suggestions,
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        className="w-full border rounded px-3 py-2"
        placeholder="Enter location"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded bg-white mt-1 max-h-40 overflow-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => onSelect(place)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}