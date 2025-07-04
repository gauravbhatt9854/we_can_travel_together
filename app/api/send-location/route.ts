import { NextRequest, NextResponse } from 'next/server';
import { addLocation } from '@/app/lib/locationStore';

interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

interface Payload {
  userId: string;
  name: string;
  currentLocation: LocationPoint;
  destination: LocationPoint;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;
    const { userId, name, currentLocation, destination } = body;

    if (!userId || !name || !currentLocation || !destination) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const distanceKm = calculateDistance(currentLocation, destination);

    await addLocation({
      userId,
      name,
      from: currentLocation,
      to: destination,
      distanceKm,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /send-location error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function calculateDistance(from: LocationPoint, to: LocationPoint): number {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(to.lat - from.lat);
  const dLng = deg2rad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(from.lat)) * Math.cos(deg2rad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}