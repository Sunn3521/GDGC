/**
 * CrisisMate — Google Maps & Nearby Help Service
 *
 * Discovers nearby emergency services via Google Places API (when API key is provided)
 * or provides direct Google Maps search and turn-by-turn navigation URLs.
 * Never fabricates fake places or fake phone numbers.
 */

import type { UserCoordinates, NearbyService, EmergencyServiceType } from '../../types/location';

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

let _mockServices: NearbyService[] | null = null;

export function setMockNearbyServices(services: NearbyService[] | null): void {
  _mockServices = services;
}

export function isPlacesApiConfigured(): boolean {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    }
  } catch {
    // Ignore error
  }
  return false;
}

/**
 * Search nearby emergency services based on user location.
 */
export async function searchNearbyServices(
  userCoords: UserCoordinates,
  serviceType: EmergencyServiceType = 'ALL'
): Promise<NearbyService[]> {
  if (_mockServices) {
    return _mockServices.filter(
      (s) => serviceType === 'ALL' || s.type === serviceType
    );
  }

  const baseLat = userCoords.latitude;
  const baseLng = userCoords.longitude;

  // 1. Try Google Places Nearby Search API if key is present
  const apiKey = isPlacesApiConfigured()
    ? (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string)
    : '';

  if (apiKey) {
    try {
      const typeKeyword = serviceType === 'HOSPITAL' ? 'hospital' : serviceType === 'POLICE' ? 'police' : 'fire_station';
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${baseLat},${baseLng}&radius=5000&type=${typeKeyword}&key=${apiKey}`;

      const res = await fetch(placesUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          return data.results.map((p: any) => ({
            id: p.place_id,
            name: p.name,
            type: serviceType === 'ALL' ? 'HOSPITAL' : serviceType,
            address: p.vicinity || 'Address available on Google Maps',
            latitude: p.geometry?.location?.lat || baseLat,
            longitude: p.geometry?.location?.lng || baseLng,
            distanceMeters: calculateDistanceMeters(
              baseLat,
              baseLng,
              p.geometry?.location?.lat || baseLat,
              p.geometry?.location?.lng || baseLng
            ),
            navigationUrl: `https://www.google.com/maps/dir/?api=1&destination=${p.geometry?.location?.lat},${p.geometry?.location?.lng}`,
          }));
        }
      }
    } catch (err) {
      console.warn('[CrisisMate Maps] Places API fetch failed, falling back to direct navigation:', err);
    }
  }

  // 2. Direct Google Maps Navigation Fallback (No fake places fabricated)
  const defaultServices: NearbyService[] = [
    {
      id: 'maps_hosp',
      name: 'Search Nearest Hospital on Google Maps',
      type: 'HOSPITAL',
      address: 'Live navigation assistance for nearest emergency hospital.',
      latitude: baseLat,
      longitude: baseLng,
      distanceMeters: 0,
      navigationUrl: `https://www.google.com/maps/search/emergency+hospital/@${baseLat},${baseLng},14z`,
    },
    {
      id: 'maps_police',
      name: 'Search Nearest Police Station on Google Maps',
      type: 'POLICE',
      address: 'Live navigation assistance for nearest police control station.',
      latitude: baseLat,
      longitude: baseLng,
      distanceMeters: 0,
      navigationUrl: `https://www.google.com/maps/search/police+station/@${baseLat},${baseLng},14z`,
    },
    {
      id: 'maps_fire',
      name: 'Search Nearest Fire Station on Google Maps',
      type: 'FIRE_STATION',
      address: 'Live navigation assistance for nearest fire and rescue station.',
      latitude: baseLat,
      longitude: baseLng,
      distanceMeters: 0,
      navigationUrl: `https://www.google.com/maps/search/fire+station/@${baseLat},${baseLng},14z`,
    },
  ];

  return defaultServices.filter(
    (s) => serviceType === 'ALL' || s.type === serviceType
  );
}
