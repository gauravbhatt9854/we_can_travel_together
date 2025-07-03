'use client';
import React, { useEffect, useState } from 'react';
import LocationInput from './LocationInput';
import Dashboard from './Dashboard';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const currentUser = { id: 'user_1224', name: 'User3' };

interface Suggestion {
  place_name: string;
  center: [number, number];
}

interface NearbyPerson {
  userId: string;
  name: string;
  from: { name: string };
  to: { name: string };
  distanceKm: number;
  match?: string;
}

const LocationForm: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([]);
  const [currentLatLng, setCurrentLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationLatLng, setDestinationLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [results, setResults] = useState<NearbyPerson[]>([]);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [sending, setSending] = useState(false);

  // 🔄 Reusable: Check if user has already sent a location
  const refetchUserLocation = async () => {
    try {
      const res = await fetch(`/api/check-location?userId=${currentUser.id}`);
      const data = await res.json();

      if (data.exists && data.entry) {
        setResults([data.entry, ...(data.nearbyPeople || [])]);
        setAlreadyExists(true);
      } else {
        setResults([]);
        setAlreadyExists(false);
      }
    } catch (err) {
      console.error('Check location failed:', err);
    }
  };

  // 🧠 Run on load
  useEffect(() => {
    refetchUserLocation();
  }, []);

  // 📍 Fetch suggestions from Mapbox
  const fetchSuggestions = async (query: string, type: 'current' | 'destination') => {
    if (!query) return;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (type === 'current') setCurrentSuggestions(data.features || []);
    else setDestinationSuggestions(data.features || []);
  };

  // 🔘 Handle selection of location
  const handleSelect = (place: Suggestion, type: 'current' | 'destination') => {
    const latLng = { lat: place.center[1], lng: place.center[0] };
    if (type === 'current') {
      setCurrentLatLng(latLng);
      setCurrentAddress(place.place_name);
      setCurrentQuery(place.place_name);
      setCurrentSuggestions([]);
    } else {
      setDestinationLatLng(latLng);
      setDestinationAddress(place.place_name);
      setDestinationQuery(place.place_name);
      setDestinationSuggestions([]);
    }
  };

  // 📤 Send to `/api/send-location`
  const handleSend = async () => {
    if (!currentLatLng || !destinationLatLng || alreadyExists) return;

    const payload = {
      userId: currentUser.id,
      name: currentUser.name,
      currentLocation: { name: currentAddress, ...currentLatLng },
      destination: { name: destinationAddress, ...destinationLatLng },
    };

    setSending(true);
    try {
      const res = await fetch('/api/send-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Location sent!');
        await refetchUserLocation(); // Refresh state
      } else {
        const error = await res.json();
        alert(`Send error: ${error?.error}`);
      }
    } catch (err) {
      console.error('Send location failed:', err);
    } finally {
      setSending(false);
    }
  };

  // Debounced current location suggestions
  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(currentQuery, 'current'), 300);
    return () => clearTimeout(timeout);
  }, [currentQuery]);

  // Debounced destination suggestions
  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(destinationQuery, 'destination'), 300);
    return () => clearTimeout(timeout);
  }, [destinationQuery]);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 space-y-6 border rounded shadow h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold text-center text-blue-800">Travel Planner (Mapbox)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="space-y-4">
          <LocationInput
            label="Current Location"
            query={currentQuery}
            setQuery={setCurrentQuery}
            suggestions={currentSuggestions}
            onSelect={(place) => handleSelect(place, 'current')}
            disabled={alreadyExists}
          />
          <LocationInput
            label="Destination"
            query={destinationQuery}
            setQuery={setDestinationQuery}
            suggestions={destinationSuggestions}
            onSelect={(place) => handleSelect(place, 'destination')}
            disabled={alreadyExists}
          />
          <button
            onClick={handleSend}
            disabled={alreadyExists || sending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Location'}
          </button>

          {alreadyExists && (
            <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
              You've already shared your location. To send again, please reset it.
            </div>
          )}
        </div>

        {/* Right Dashboard with refresh support */}
        <Dashboard
          results={results}
          currentUserId={currentUser.id}
          onRefresh={refetchUserLocation}
        />
      </div>
    </div>
  );
};

export default LocationForm;