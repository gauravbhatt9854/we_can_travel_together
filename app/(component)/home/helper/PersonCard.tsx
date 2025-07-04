'use client';
import React from 'react';

interface Props {
  userId: string;
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  match?: string;
}

const PersonCard: React.FC<Props> = ({userId , name, from, to, distanceKm }) => {
  return (
    <div className="bg-white p-3 border rounded shadow-sm">
      <p><strong>Phone:</strong> {userId}</p>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>From:</strong> {from}</p>
      <p><strong>To:</strong> {to}</p>
      <p className="text-sm text-gray-500">Within {distanceKm} km match</p>
    </div>
  );
};

export default PersonCard;