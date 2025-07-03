export interface LocationEntry {
  userId: string;
  name: string;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  distanceKm: number;
}

const locationStore: LocationEntry[] = [];

export function addLocation(entry: LocationEntry) {
  // Remove any existing entry for same userId
  const index = locationStore.findIndex((e) => e.userId === entry.userId);
  if (index !== -1) {
    locationStore.splice(index, 1);
  }
  locationStore.push(entry);
}

export function getLocationStore(): LocationEntry[] {
  return locationStore;
}

export function clearOldEntries(keepLatest = 20) {
  if (locationStore.length > keepLatest) {
    locationStore.splice(0, locationStore.length - keepLatest);
  }
}
