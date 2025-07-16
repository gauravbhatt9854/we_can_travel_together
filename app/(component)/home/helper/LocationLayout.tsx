'use client';
import React, { useEffect, useState } from 'react';
import SuggestionFetcher from './SuggestionFetcher';
import MyLocationCard from './MyLocationCard';
import PeopleNearbyList from './PeopleNearbyList';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function LocationLayout({ userId, name }: { userId: string; name: string }) {
  const [currentQuery, setCurrentQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [currentLatLng, setCurrentLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationLatLng, setDestinationLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [hasValidLocations, setHasValidLocations] = useState(false);
  const [sending, setSending] = useState(false);

//   const refetchUserLocation = async () => {
//     try {
//       const res = await fetch(`/api/check-location?userId=${userId}`);
//       if (res.redirected || res.status === 401 || res.status === 403) {
//         window.location.href = '/login';
//         return;
//       }

//       const data = await res.json();
//       if (data.exists && data.entry) {
//         setAlreadyExists(true);
//         setResults([data.entry, ...(data.nearbyPeople || [])]);

//         const hasLocations =
//           data.entry.from?.name?.trim().length > 0 &&
//           data.entry.to?.name?.trim().length > 0;

//         setHasValidLocations(hasLocations);
//       } else {
//         setAlreadyExists(false);
//         setHasValidLocations(false);
//         setResults([]);
//       }
//     } catch (err) {
//       console.error('Check location failed:', err);
//       window.location.href = '/login';
//     }
//   };

//   useEffect(() => {
//     refetchUserLocation();
//   }, []);

  const handleSend = async () => {
    if (!currentLatLng || !destinationLatLng || hasValidLocations) return;

    const payload = {
      userId,
      name,
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
        await refetchUserLocation();
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">
        Travel Planner (Mapbox)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow border">
            <SuggestionFetcher
              label="Current Location"
              query={currentQuery}
              setQuery={setCurrentQuery}
              suggestions={currentSuggestions}
              setSuggestions={setCurrentSuggestions}
              setLatLng={setCurrentLatLng}
              setAddress={setCurrentAddress}
              disabled={hasValidLocations}
            />
            <SuggestionFetcher
              label="Destination"
              query={destinationQuery}
              setQuery={setDestinationQuery}
              suggestions={destinationSuggestions}
              setSuggestions={setDestinationSuggestions}
              setLatLng={setDestinationLatLng}
              setAddress={setDestinationAddress}
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
                You've already shared your location.
              </p>
            )}
          </div>

          {alreadyExists && results.length > 0 && (
            <MyLocationCard
              userId={results[0].userId}
              name={results[0].name}
              from={results[0].from.name}
              to={results[0].to.name}
              distanceKm={results[0].distanceKm}
              onDeleted={refetchUserLocation}
            />
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border shadow max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nearby People</h2>
          <PeopleNearbyList people={results.slice(1)} />
        </div>
      </div>
    </div>
  );
}