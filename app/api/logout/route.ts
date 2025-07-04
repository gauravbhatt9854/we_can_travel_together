// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteUser } from '@/app/lib/locationStore';

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const userCookie = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('user='));

    if (!userCookie) {
      return NextResponse.json({ message: 'No user session found' }, { status: 400 });
    }

    const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
    const { phone } = JSON.parse(cookieValue);

    console.log("phone is " , phone);

    if (!phone) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    // Delete from Redis
    await deleteUser(phone);

    const response = NextResponse.json({ message: 'Logged out and user deleted' });
    response.headers.set('Set-Cookie', 'user=; Path=/; Max-Age=0; HttpOnly');

    return response;
  } catch (error) {
    console.error('❌ Logout failed:', error);
    return NextResponse.json({ error: 'Logout error' }, { status: 500 });
  }
}