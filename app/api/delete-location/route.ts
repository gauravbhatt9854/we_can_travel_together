// app/api/delete-location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteLocation } from '@/app/lib/locationStore';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await deleteLocation(userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/delete-location error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}