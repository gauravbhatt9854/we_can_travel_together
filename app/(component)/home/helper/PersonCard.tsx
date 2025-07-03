'use client';
import React from 'react';

interface PersonCardProps {
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  match?: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, from, to, distanceKm, match }) => (
  <div className="p-3 border rounded bg-white shadow-sm mb-3">
    <p><strong>Name:</strong> {name}</p>
    <p><strong>From:</strong> {from}</p>
    <p><strong>To:</strong> {to}</p>
    {match && <p><strong>Match:</strong> {match}</p>}
    <p><strong>Distance:</strong> {distanceKm} km</p>
  </div>
);

export default PersonCard;