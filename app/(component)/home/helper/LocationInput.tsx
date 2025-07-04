'use client';

import React from 'react';

interface LocationInputProps {
  label: string;
  query: string;
  setQuery: (value: string) => void;
  suggestions: {
    place_name: string;
    center: [number, number];
  }[];
  onSelect: (place: { place_name: string; center: [number, number] }) => void;
  disabled?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  query,
  setQuery,
  suggestions,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={`Search ${label.toLowerCase()}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSelect(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;