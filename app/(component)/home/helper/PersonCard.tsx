'use client';
import React from 'react';
import { PhoneCall, MessageCircle } from 'lucide-react';

interface Props {
  userId: string;        // Phone number without +91
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  match?: string;
}

const PersonCard: React.FC<Props> = ({ userId, name, from, to, distanceKm }) => {
  const phoneNumber = userId.startsWith('+') ? userId : `+91${userId}`;
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}`;

  return (
    <div className="bg-white p-3 border rounded shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <p className="font-semibold">Phone:</p>
        <span>{phoneNumber}</span>
        <a
          href={`tel:${phoneNumber}`}
          title="Call"
          className="text-green-600 hover:text-green-700"
        >
          <PhoneCall size={18} />
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="text-green-500 hover:text-green-600"
        >
          <MessageCircle size={18} />
        </a>
      </div>

      <p><strong>Name:</strong> {name}</p>
      <p><strong>From:</strong> {from}</p>
      <p><strong>To:</strong> {to}</p>
      <p className="text-sm text-gray-500">Within {distanceKm} km match</p>
    </div>
  );
};

export default PersonCard;
