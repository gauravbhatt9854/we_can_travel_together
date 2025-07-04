// app/api/hostname/route.ts

import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const hostname = os.hostname();
  return NextResponse.json({ hostname });
}