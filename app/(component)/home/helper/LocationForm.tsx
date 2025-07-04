'use client';

import React, { useEffect, useState } from 'react';
import LocationInput from './LocationInput';
import Dashboard from './Dashboard';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface Suggestion {
  place_name: string;
  center: [number, number];
}

interface NearbyPerson {
  userId: string;
  name: string;
  from: { name: string; lat?: number; lng?: number };
  to: { name: string; lat?: number; lng?: number };
  distanceKm: number;
  match?: string;
}

const LocationForm: React.FC = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
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
  const [hasValidLocations, setHasValidLocations] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch user from /api/get-user (reads HttpOnly cookie)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/get-user');
        if (res.ok) {
          const data = await res.json();
          if (data?.phone && data?.name) {
            setUser({ id: data.phone, name: data.name });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      }
    }
    fetchUser();
  }, []);


  useEffect(() => {
    console.log(user);
  }, [user])

  // Refetch user location and check if from/to are set
  const refetchUserLocation = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/check-location?userId=${user.id}`);
      const data = await res.json();

      if (data.exists && data.entry) {
        setAlreadyExists(true);
        setResults([data.entry, ...(data.nearbyPeople || [])]);

        const hasLocations =
          data.entry.from?.name?.trim().length > 0 &&
          data.entry.to?.name?.trim().length > 0;

        setHasValidLocations(hasLocations);
      } else {
        setAlreadyExists(false);
        setHasValidLocations(false);
        setResults([]);
      }
    } catch (err) {
      console.error('Check location failed:', err);
    }
  };

  // Run on user load
  useEffect(() => {
    if (user) {
      refetchUserLocation();
    }
  }, [user]);

  // Fetch suggestions from Mapbox
  const fetchSuggestions = async (query: string, type: 'current' | 'destination') => {
    if (!query) return;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (type === 'current') setCurrentSuggestions(data.features || []);
    else setDestinationSuggestions(data.features || []);
  };

  // Handle selection of location
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

  // Send location to backend
  const handleSend = async () => {
    if (!currentLatLng || !destinationLatLng || hasValidLocations || !user) return;

    const payload = {
      userId: user.id,
      name: user.name,
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
        await refetchUserLocation(); // Refresh state after sending
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

  // Debounce suggestions
  React.useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(currentQuery, 'current'), 300);
    return () => clearTimeout(timeout);
  }, [currentQuery]);

  React.useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(destinationQuery, 'destination'), 300);
    return () => clearTimeout(timeout);
  }, [destinationQuery]);

  if (user === null) return <p className="p-6">Loading user session...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">
        Travel Planner (Mapbox)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: Form + User Info */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow border">
            <LocationInput
              label="Current Location"
              query={currentQuery}
              setQuery={setCurrentQuery}
              suggestions={currentSuggestions}
              onSelect={(place) => handleSelect(place, 'current')}
              disabled={hasValidLocations}
            />
            <LocationInput
              label="Destination"
              query={destinationQuery}
              setQuery={setDestinationQuery}
              suggestions={destinationSuggestions}
              onSelect={(place) => handleSelect(place, 'destination')}
              disabled={hasValidLocations}
            />

            <button
              onClick={handleSend}
              disabled={sending || hasValidLocations}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Location'}
            </button>

            {hasValidLocations && (
              <p className="text-green-700 bg-green-100 text-sm rounded p-2 mt-2">
                You've already shared your location. To send again, please reset it.
              </p>
            )}
          </div>

          {/* Shared Post */}
          {alreadyExists && results.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-green-700 mb-2">You've Shared Your Location</h2>
              <p><strong>Name:</strong> {results[0].name}</p>
              <p><strong>From:</strong> {results[0].from.name}</p>
              <p><strong>To:</strong> {results[0].to.name}</p>
              <p><strong>Distance:</strong> {results[0].distanceKm} km</p>

              {/* Optional delete/reset button */}
              <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete My Post
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Nearby People */}
        <div className="bg-gray-50 p-4 rounded-xl border shadow max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nearby People</h2>

          {results.slice(1).length === 0 ? (
            <p className="text-sm text-gray-500">No nearby matches yet.</p>
          ) : (
            <div className="space-y-4">
              {results.slice(1).map((person, i) => (
                <div key={i} className="bg-white p-3 border rounded shadow-sm">
                  <p><strong>Name:</strong> {person.name}</p>
                  <p><strong>From:</strong> {person.from.name}</p>
                  <p><strong>To:</strong> {person.to.name}</p>
                  <p className="text-sm text-gray-500">Within 3km match</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default LocationForm;