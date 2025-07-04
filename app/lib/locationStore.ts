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

export async function deleteLocation(userId: string): Promise<void> {
  await redis.hdel(LOCATION_KEY, userId);
}