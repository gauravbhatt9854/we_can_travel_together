'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });

      if (res.ok) {
        router.push('/login'); // ✅ Redirect to login page
      } else {
        console.error('Logout failed:', await res.json());
      }
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">🗺️ Location Share</h1>
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