'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hostname, setHostname] = useState('');

  const user = session?.user;

  const handleLogout = () => {
    signOut({
      callbackUrl: "/login",
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
    <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-100 border-b shadow-sm gap-2 sm:gap-0">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">🗺️ Location Share</h1>
        {hostname && (
          <p className="text-xs text-gray-500">Server: {hostname}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-700">
        {user && (
          <div className="text-right">
            <p className="font-medium text-blue-700">{user.fullName || 'Unknown'}</p>
            <p className="text-xs text-gray-600">📱 {user.number || 'N/A'}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;