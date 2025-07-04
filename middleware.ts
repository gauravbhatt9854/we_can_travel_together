// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [/^https:\/\/.*\.golu\.codes$/];

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

  // Logged in → allow + add CORS if allowed origin
  const origin = request.headers.get('origin') || '';
  const isAllowed = allowedOrigins.some((regex) => regex.test(origin));

  const response = NextResponse.next();

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // Apply to all except static files
};
