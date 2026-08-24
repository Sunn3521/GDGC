/**
 * CrisisMate — Location & Nearby Services Types
 */

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

export type LocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED'
  | 'UNKNOWN';

export interface LocationError {
  code: LocationErrorCode;
  message: string;
}

export interface LocationResult {
  success: boolean;
  coords?: UserCoordinates;
  error?: LocationError;
}

export type EmergencyServiceType = 'HOSPITAL' | 'POLICE' | 'FIRE_STATION' | 'ALL';

export interface NearbyService {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'POLICE' | 'FIRE_STATION' | 'PHARMACY' | 'OTHER';
  address: string;
  distanceMeters: number;
  phone?: string;
  placeId?: string;
  latitude: number;
  longitude: number;
  navigationUrl: string;
  isOpenNow?: boolean;
}

export interface NearbySearchResult {
  services: NearbyService[];
  userLocation: UserCoordinates;
  searchType: EmergencyServiceType;
}
