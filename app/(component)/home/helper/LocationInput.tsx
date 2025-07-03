'use client';
import React from 'react';

interface Props {
  label: string;
  query: string;
  setQuery: (value: string) => void;
  suggestions: any[];
  onSelect: (place: any) => void;
  disabled?: boolean;
}

const LocationInput: React.FC<Props> = ({ label, query, setQuery, suggestions, onSelect, disabled }) => (
  <div>
    <label className="block font-semibold mb-1">{label}</label>
    <input
      type="text"
      placeholder={`Enter ${label.toLowerCase()}`}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      disabled={disabled}
      className="w-full p-2 border rounded"
    />
    {suggestions.length > 0 && (
      <ul className="border mt-1 bg-white rounded shadow max-h-40 overflow-y-auto">
        {suggestions.map((item, idx) => (
          <li
            key={idx}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(item)}
          >
            {item.place_name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default LocationInput;