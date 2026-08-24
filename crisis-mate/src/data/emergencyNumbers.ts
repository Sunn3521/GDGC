/**
 * CrisisMate — Centralized Regional Emergency Numbers
 *
 * Region-aware emergency hotline definitions.
 * Default region: India (IN).
 */

export interface NationalEmergencyNumbers {
  country: string;
  countryCode: string;
  universal: string;
  police: string;
  ambulance: string;
  fire: string;
  disasterManagement?: string;
  coastGuard?: string;
  womenHelpline?: string;
}

export const INDIA_EMERGENCY_NUMBERS: NationalEmergencyNumbers = {
  country: 'India',
  countryCode: 'IN',
  universal: '112',
  police: '100',
  ambulance: '108',
  fire: '101',
  disasterManagement: '1078',
  coastGuard: '1554',
  womenHelpline: '1091',
};

export const DEFAULT_EMERGENCY_NUMBERS = INDIA_EMERGENCY_NUMBERS;
