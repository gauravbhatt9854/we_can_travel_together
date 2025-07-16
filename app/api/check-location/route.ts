import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserByNumber, findNearbyUsers } from "@/app/lib/userStore";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.number) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const me = await getUserByNumber(token.number);
  if (!me?.location?.from || !me?.location?.to) {
    return NextResponse.json({ error: "Location not set" }, { status: 400 });
  }

  const distance = parseInt(process.env.DISTANCE);
  const neighbors = await findNearbyUsers(me, distance);
  return NextResponse.json({ neighbors });
}
