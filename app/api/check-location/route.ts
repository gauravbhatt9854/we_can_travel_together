import { NextRequest, NextResponse } from 'next/server';
import { getAllLocations, LocationData } from '@/app/lib/locationStore';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    // 🔴 Missing userId — treat as invalid session
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.headers.set(
      'Set-Cookie',
      `user=; Path=/; Max-Age=0; HttpOnly`
    );
    return response;
  }

  const allEntries: LocationData[] = await getAllLocations();
  const myEntry = allEntries.find((entry) => entry.userId === userId);

  if (!myEntry) {
    // 🧼 User not found in location data — clear cookie and redirect
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.headers.set(
      'Set-Cookie',
      `user=; Path=/; Max-Age=0; HttpOnly`
    );
    return response;
  }

  // ✅ Check location data
  const hasValidLocations =
    myEntry.from?.name?.trim() &&
    myEntry.to?.name?.trim() &&
    typeof myEntry.from.lat === 'number' &&
    typeof myEntry.from.lng === 'number' &&
    typeof myEntry.to.lat === 'number' &&
    typeof myEntry.to.lng === 'number';

  if (!hasValidLocations) {
    return NextResponse.json({ exists: false });
  }

  const MAX_DISTANCE_KM = 5;

  const nearbyPeople = allEntries.filter((entry) => {
    if (entry.userId === userId) return false;

    const isFromNearby =
      haversine(myEntry.from.lat, myEntry.from.lng, entry.from.lat, entry.from.lng) <= MAX_DISTANCE_KM;

    const isToNearby =
      haversine(myEntry.to.lat, myEntry.to.lng, entry.to.lat, entry.to.lng) <= MAX_DISTANCE_KM;

    return isFromNearby && isToNearby;
  });

  return NextResponse.json({
    exists: true,
    entry: myEntry,
    nearbyPeople,
  });
}

// Haversine helpers
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}