// app/api/send-location/route.ts
import { updateUserLocation } from "@/app/lib/userStore";
import { NextRequest, NextResponse } from "next/server";
import { LocationPoint } from "@/app/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      number,
      location
    } = body;

    if (!number || !location?.from || !location?.to) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await updateUserLocation({ number, location });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: "Location updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Send-location error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}