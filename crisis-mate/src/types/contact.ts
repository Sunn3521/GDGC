/**
 * CrisisMate — Contact Types
 *
 * Types for emergency contacts and nearby services.
 */

export type { NationalEmergencyNumbers } from '../data/emergencyNumbers';
export { INDIA_EMERGENCY_NUMBERS, DEFAULT_EMERGENCY_NUMBERS } from '../data/emergencyNumbers';

export const UNIVERSAL_EMERGENCY = '112';

// ─── Personal Emergency Contact ───────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  addedAt: string;
  userId?: string;
}

// ─── Nearby Emergency Service (Google Maps) ───────────────────────────────────

export interface NearbyService {
  id?: string;
  name: string;
  type: 'HOSPITAL' | 'POLICE' | 'FIRE_STATION' | 'PHARMACY' | 'OTHER';
  address: string;
  distanceMeters: number;
  phone?: string;
  placeId?: string;
  latitude: number;
  longitude: number;
  navigationUrl?: string;
}
