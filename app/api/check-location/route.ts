import { NextRequest, NextResponse } from 'next/server';
import { getAllLocations, LocationData } from '@/app/lib/locationStore';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const allEntries: LocationData[] = await getAllLocations();
  const myEntry = allEntries.find(entry => entry.userId === userId);

  if (!myEntry) {
    return NextResponse.json({ exists: false });
  }

  const nearbyPeople = allEntries.filter(entry =>
    entry.userId !== userId &&
    entry.from.name === myEntry.from.name &&
    entry.to.name === myEntry.to.name
  );

  return NextResponse.json({
    exists: true,
    entry: myEntry,
    nearbyPeople,
  });
}