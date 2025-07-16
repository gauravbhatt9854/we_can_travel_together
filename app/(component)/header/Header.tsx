'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const Header = () => {
  const router = useRouter();
  const [hostname, setHostname] = useState('');


  const handleLogout = () => {
  signOut({
    callbackUrl: "/login", // Redirect after logout (optional)
  });
};

  useEffect(() => {
    const fetchHostname = async () => {
      try {
        const res = await fetch('/api/hostname');
        const data = await res.json();
        setHostname(data.hostname);
      } catch (err) {
        console.error('❌ Failed to get hostname:', err);
      }
    };

    fetchHostname();
  }, []);

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">🗺️ Location Share</h1>
        {hostname && (
          <p className="text-xs text-gray-500">Server: {hostname}</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;