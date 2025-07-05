// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const user = request.cookies.get('user');

  // Always allow these paths
  if (
    url.pathname === '/login' ||
    url.pathname.startsWith('/api/check-login')
  ) {
    return NextResponse.next();
  }

  // Not logged in → redirect to login
  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Logged in → allow request
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // Apply to all except static files
};