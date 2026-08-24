/**
 * CrisisMate — Contact Types
 */

export type { NationalEmergencyNumbers } from '../data/emergencyNumbers';
export { INDIA_EMERGENCY_NUMBERS, DEFAULT_EMERGENCY_NUMBERS } from '../data/emergencyNumbers';

export const UNIVERSAL_EMERGENCY = '112';

/**
 * Represents a trusted emergency contact stored under `users/{userId}/trustedContacts/{contactId}`
 */
export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export type Contact = TrustedContact;

/**
 * Input format for creating a new trusted contact
 */
export type CreateTrustedContactInput = Omit<TrustedContact, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input format for updating an existing trusted contact
 */
export type UpdateTrustedContactInput = Partial<CreateTrustedContactInput>;

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
