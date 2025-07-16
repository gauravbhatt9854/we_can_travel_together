import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import {updateUserLocationToNull} from "@/app/lib/userStore"

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.number) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await updateUserLocationToNull(token?.number);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to clear location:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}