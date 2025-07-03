'use client';
import React, { useState } from 'react';

interface MyLocationCardProps {
  userId: string;
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  onDeleted: () => void;
}

const MyLocationCard: React.FC<MyLocationCardProps> = ({
  userId,
  name,
  from,
  to,
  distanceKm,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your location?');
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await fetch('/api/delete-location', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        alert('Location deleted.');
        onDeleted(); // Tell parent to refresh
      } else {
        const err = await res.json();
        alert(`Delete failed: ${err?.error}`);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 p-4 border rounded shadow">
      <h3 className="text-lg font-bold mb-2 text-green-700">You've Shared Your Location</h3>
      <p className="text-sm text-gray-600 mb-3">To share again, delete your current location.</p>
      <div className="space-y-1 text-sm">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>From:</strong> {from}</p>
        <p><strong>To:</strong> {to}</p>
        <p><strong>Distance:</strong> {distanceKm} km</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="mt-4 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Deleting...' : 'Delete My Post'}
      </button>
    </div>
  );
};

export default MyLocationCard;