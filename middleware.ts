// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');

  const url = request.nextUrl.clone();

  // Allow access to login page freely
  if (url.pathname === '/login') return NextResponse.next();
  if (url.pathname === '/api/check-login') return NextResponse.next();

  // Not logged in → redirect to login
  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Logged in → allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};