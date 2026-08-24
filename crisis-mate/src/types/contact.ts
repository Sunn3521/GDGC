/**
 * CrisisMate — Contact Types
 *
 * Types for emergency contacts and nearby services.
 * Maps service (Member 4) populates NearbyService[] when needsLocation is true.
 */

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

/** Populated by the Maps service when CrisisAnalysis.needsLocation === true */
export interface NearbyService {
  name: string;
  type: 'HOSPITAL' | 'POLICE' | 'FIRE_STATION' | 'PHARMACY' | 'OTHER';
  address: string;
  distanceMeters: number;
  phone?: string;
  placeId: string;
  latitude: number;
  longitude: number;
}

// ─── National Emergency Numbers ───────────────────────────────────────────────

/** Pre-defined national emergency numbers (do NOT invent these via AI) */
export interface NationalEmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
  disasterManagement?: string;
  coastGuard?: string;
  country: string;
  countryCode: string;
}

// ─── India Emergency Numbers (default) ───────────────────────────────────────

export const INDIA_EMERGENCY_NUMBERS: NationalEmergencyNumbers = {
  police: '100',
  ambulance: '108',
  fire: '101',
  disasterManagement: '1078',
  coastGuard: '1554',
  country: 'India',
  countryCode: 'IN',
};

// ─── Universal Emergency Number ───────────────────────────────────────────────

export const UNIVERSAL_EMERGENCY = '112';
