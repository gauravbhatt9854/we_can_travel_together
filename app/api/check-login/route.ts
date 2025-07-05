import { NextRequest, NextResponse } from 'next/server';
import { addLocation, getLocation, deleteLocation, deleteUser } from '@/app/lib/locationStore';

interface LoginPayload {
  phone: string;
  password: string;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginPayload = await req.json();
    const { phone, password, name } = body;

    // Validate inputs
    if (!phone || !password || password.length !== 4 || !name) {
      return NextResponse.json(
        { error: 'Phone, name, and 4-digit password are required.' },
        { status: 400 }
      );
    }

    const userId = phone;

    // Check if user already exists
    const existing = await getLocation(userId);
    if (existing) {
      console.log('✅ User exists in Redis');

      // Set cookie with only phone and name, no password
      const userCookie = JSON.stringify({ phone, name });

      const response = NextResponse.json({ user: existing, status: 'exists' });
      response.headers.set(
        'Set-Cookie',
        `user=${encodeURIComponent(userCookie)}; Path=/; Max-Age=900; HttpOnly`
      );

      return response;
    }

    // Create new user object with minimal info + default locations
    const newUser = {
      userId,
      name,
      password, // stored server-side only
      from: { name: '', lat: 0, lng: 0 },
      to: { name: '', lat: 0, lng: 0 },
      distanceKm: 0,
    };

    await addLocation(newUser);

    // Schedule auto-delete after 3 hours
    setTimeout(() => {
      deleteLocation(userId).catch((err) =>
        console.error('❌ Redis auto-delete error:', err)
      );
    }, 3 * 60 * 60 * 1000); // 3 hours in milliseconds


    // Schedule auto-delete after 24 hours
    setTimeout(() => {
      deleteUser(userId).catch((err) =>
        console.error('❌ Redis auto-delete error:', err)
      );
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds



    console.log('🆕 New user stored in Redis');

    // Set cookie with only phone and name, no password
    const userCookie = JSON.stringify({ phone, name });

    const response = NextResponse.json({ user: newUser, status: 'created' });

    // 24 hours 
    response.headers.set(
      'Set-Cookie',
      `user=${encodeURIComponent(userCookie)}; Path=/; Max-Age=86400; HttpOnly`
    );

    return response;
  } catch (err) {
    console.error('❌ Error in /api/check-login:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}