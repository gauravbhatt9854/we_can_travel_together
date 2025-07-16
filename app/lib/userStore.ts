// app/lib/userStore.ts
import bcrypt from "bcryptjs";
import redis from "./redis";

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface User {
  fullName: string;
  number: string;
  password: string;
  location: {
    from: LocationPoint | null;
    to: LocationPoint | null;
  };
}

export interface NearbyPerson {
  userId: string;
  name: string;
  from: LocationPoint;
  to: LocationPoint;
  distanceKm: number;
  match?: string;
}

const USER_PREFIX = "user:";

export async function registerUser({
  fullName,
  number,
  password,
}: {
  fullName: string;
  number: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const userKey = `${USER_PREFIX}${number}`;
  const existingUser = await redis.get(userKey);
  if (existingUser) return { success: false, error: "User already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    fullName,
    number,
    password: hashedPassword,
    location: { from: null, to: null },
  };

  await redis.set(userKey, JSON.stringify(user));
  return { success: true };
}

export async function verifyUser({
  number,
  password,
}: {
  number: string;
  password: string;
}): Promise<User | null> {
  const userKey = `${USER_PREFIX}${number}`;
  const data = await redis.get(userKey);
  if (!data) return null;

  const user: User = JSON.parse(data);
  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
}

// ✅ NEW: Update user location

// lib/userStore.ts
export async function updateUserLocation({
  number,
  location,
}: {
  number: string;
  location: {
    from: LocationPoint;
    to: LocationPoint;
  };
}): Promise<{ success: boolean; error?: string }> {
  const userKey = `user:${number}`;
  const data = await redis.get(userKey);
  if (!data) {
    return { success: false, error: "User not found" };
  }

  const user: User = JSON.parse(data);
  user.location = location;

  await redis.set(userKey, JSON.stringify(user));
  return { success: true };
}

// ✅ NEW: Get user by number (used in session callback)
export async function getUserByNumber(number: string): Promise<User | null> {
  const userKey = `${USER_PREFIX}${number}`;
  const data = await redis.get(userKey);
  return data ? JSON.parse(data) : null;
}

export async function updateUserLocationToNull(number : string) {
  const userKey = `user:${number}`;
  const raw = await redis.get(userKey);
  console.log(raw);
  if (!raw) throw new Error("User not found");

  const user = JSON.parse(raw);
  user.location = { from: null, to: null };

  await redis.set(userKey , JSON.stringify(user));
}



function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in KM

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearbyUsers(
  currentUser: User,
  radiusKm: number = 3
): Promise<NearbyPerson[]> {
  if (!currentUser.location?.from || !currentUser.location?.to) return [];

  const myNumber = currentUser.number;
  const allKeys = await redis.keys("user:*");

  const neighbors: NearbyPerson[] = [];

  for (const key of allKeys) {
    if (key === `user:${myNumber}`) continue;

    const raw = await redis.get(key);
    if (!raw) continue;

    try {
      const other: User = JSON.parse(raw);
      if (!other.location?.from || !other.location?.to) continue;

      const fromDistance = haversineDistance(
        currentUser.location.from.lat,
        currentUser.location.from.lng,
        other.location.from.lat,
        other.location.from.lng
      );

      const toDistance = haversineDistance(
        currentUser.location.to.lat,
        currentUser.location.to.lng,
        other.location.to.lat,
        other.location.to.lng
      );

      if (fromDistance <= radiusKm && toDistance <= radiusKm) {
        neighbors.push({
          userId: other.number,
          name: other.fullName,
          from: other.location.from,
          to: other.location.to,
          distanceKm: Math.round(((fromDistance + toDistance) / 2) * 100) / 100,
          match: "both",
        });
      }
    } catch (err) {
      console.warn("Failed to parse user:", key);
    }
  }

  return neighbors;
}