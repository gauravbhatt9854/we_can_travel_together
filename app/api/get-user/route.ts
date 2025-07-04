import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();  // await here
  const cookie = cookieStore.get('user');
  
  if (!cookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(decodeURIComponent(cookie.value));
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ user: null }, { status: 400 });
  }
}
