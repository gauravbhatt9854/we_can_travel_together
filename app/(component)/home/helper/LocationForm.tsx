'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MyLocationCard from './MyLocationCard';
import LocationInput from './LocationInput';
import PeopleNearbyList from './PeopleNearbyList';
import LocationSummary from './LocationSummary';

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
  const { data: session, status, update } = useSession();

  const user = session?.user
    ? {
      id: session.user.number,
      name: session.user.fullName, // change to session.user.name if needed
      location: session.user.location,
    }
    : null;


  const [currentQuery, setCurrentQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([]);
  const [currentLatLng, setCurrentLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationLatLng, setDestinationLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [hasValidLocations, setHasValidLocations] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleteLoc, setDeleting] = useState(false);
  const [results, setResults] = useState<NearbyPerson[]>([]);


  const fetchNearby = async () => {
    console.log("running this fun");
    if (!session?.user?.number) {
      return;
    }

    try {
      const res = await fetch("/api/check-location", {
        method: "POST",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to fetch");
      }

      const data = await res.json();
      setResults(data.neighbors || []);
    } catch (err: any) {
      console.error("Fetch failed:", err.message);
    } finally {
    }
  };

  useEffect(() => {
    if (hasValidLocations) {
      fetchNearby();
    }
  }, [hasValidLocations]);



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


  useEffect(() => {
    if (user?.location?.from != null || user?.location?.to != null) {
      setHasValidLocations(() => true);
    }
  }, [user, session]);



  const clearLocation = async () => {
    setDeleting(() => true);
    const res = await fetch("/api/clear-location", {
      method: "POST",
    });

    if (res.ok) {
      alert("Location cleared");
    } else {
      const error = await res.json();
      alert(`Error clearing location: ${error?.error}`);
    }
    await update();
    setDeleting(() => false);
  };


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


  // console.log("user is :  ", user);
  // console.log("session is :  ", session);


  const handleSend = async () => {
    if (!currentLatLng || !destinationLatLng || hasValidLocations || !user) return;

    const payload = {
      number: user.id, // already includes +91
      location: {
        from: { name: currentAddress, ...currentLatLng },
        to: { name: destinationAddress, ...destinationLatLng },
      },
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

      } else {
        const error = await res.json();
        alert(`Send error: ${error?.error}`);
      }
    } catch (err) {
      console.error('Send location failed:', err);
    } finally {
      await update();
      setSending(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(currentQuery, 'current'), 300);
    return () => clearTimeout(timeout);
  }, [currentQuery]);


  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(destinationQuery, 'destination'), 300);
    return () => clearTimeout(timeout);
  }, [destinationQuery]);

  if (status === 'loading') return <p className="p-6">Loading session...</p>;
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">
        Get a Travel Partner
      </h1>

      {/* Show My Location Summary (TOP) */}
      {hasValidLocations && (
        <div className="w-full max-w-6xl mx-auto px-4 mb-4">
          <div className="bg-white shadow border rounded-xl p-3 text-sm text-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="font-semibold text-blue-700">From:</span>{' '}
              {user.location?.from?.name || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-blue-700">To:</span>{' '}
              {user.location?.to?.name || 'N/A'}
            </div>
          </div>
        </div>
      )}

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
              <>
                <p className="text-green-700 bg-green-100 text-sm rounded p-2 mt-2">
                  You've already shared your location. To send again, please reset it.
                </p>

                <button
                  onClick={clearLocation}
                  disabled={deleteLoc}
                  className={`bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50 ${!hasValidLocations && 'hidden'}`}
                >
                  {deleteLoc ? 'Deleting...' : 'Delete Location'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Nearby People */}
        <div className="bg-gray-50 p-4 rounded-xl border shadow max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nearby People</h2>
          <PeopleNearbyList people={results} />
        </div>
      </div>
    </div>
  );

};

export default LocationForm;