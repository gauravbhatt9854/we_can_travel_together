import { NextRequest, NextResponse } from 'next/server';
import { getAllLocations, LocationData } from '@/app/lib/locationStore';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const allEntries: LocationData[] = await getAllLocations();
  const myEntry = allEntries.find((entry) => entry.userId === userId);

  if (!myEntry) {
    return NextResponse.json({ exists: false });
  }

  // Check that 'from' and 'to' have valid names and coordinates
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

  // 🔍 Find nearby people based on BOTH from & to being within 3km
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

// 📍 Helper function: Haversine formula
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
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