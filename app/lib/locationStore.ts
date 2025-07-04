import redis from "./redis";

export interface LocationData {
  userId: string;
  name: string;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  distanceKm: number;
}

const LOCATION_KEY = 'locations'; // Redis Hash

export async function addLocation(data: LocationData): Promise<void> {
  await redis.hset(LOCATION_KEY, data.userId, JSON.stringify(data));
}

export async function getLocation(userId: string): Promise<LocationData | null> {
  const data = await redis.hget(LOCATION_KEY, userId);
  return data ? JSON.parse(data) : null;
}

export async function getAllLocations(): Promise<LocationData[]> {
  const all = await redis.hgetall(LOCATION_KEY);
  return Object.values(all).map((entry) => JSON.parse(entry));
}


// 🧹 Soft delete: reset from/to/distance
export async function deleteLocation(userId: string): Promise<void> {
  const raw = await redis.hget(LOCATION_KEY, userId);
  if (!raw) return;

  try {
    const entry = JSON.parse(raw);

    const resetUser = {
      ...entry,
      from: { name: '', lat: 0, lng: 0 },
      to: { name: '', lat: 0, lng: 0 },
      distanceKm: 0,
    };

    await redis.hset(LOCATION_KEY, userId, JSON.stringify(resetUser));
    console.log(`🔁 Location reset for user: ${userId}`);
  } catch (err) {
    console.error(`❌ Failed to reset user location: ${userId}`, err);
  }
}

// 🗑️ Hard delete: remove user field completely
export async function deleteUser(userId: string): Promise<void> {
  await redis.hdel(LOCATION_KEY, userId);
  console.log(`❌ Deleted user: ${userId} from Redis`);
}