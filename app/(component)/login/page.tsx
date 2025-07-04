'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !phone || password.length !== 4) {
      return setError('Name, phone, and 4-digit password are required.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/check-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password }),
      });

      const rawText = await res.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.error('❌ Invalid JSON:', rawText);
        setError('Invalid server response');
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      // Optional: also store locally for quick access
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ No need to set cookie manually — backend sets it
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 mb-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="border p-2 mb-2 w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="4-digit Password"
          className="border p-2 mb-4 w-full"
          maxLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 w-full"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}