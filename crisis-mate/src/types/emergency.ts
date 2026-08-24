/**
 * Supported Emergency Categories
 */
export type EmergencyType =
  | 'FIRE'
  | 'MEDICAL'
  | 'ACCIDENT'
  | 'FLOOD'
  | 'EARTHQUAKE'
  | 'CYCLONE'
  | 'ELECTRICAL'
  | 'PERSONAL_SAFETY'
  | 'OTHER';

/**
 * Emergency Severity Levels
 */
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Geo-location structure provided by Member 4 / Maps service
 */
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Represents an Emergency Session stored under `users/{userId}/emergencySessions/{sessionId}`
 */
export interface EmergencySession {
  id: string;
  userId: string;
  emergencyType: EmergencyType;
  severity: SeverityLevel;
  summary: string;
  userPrompt?: string;
  immediateActions: string[];
  avoidInstructions: string[];
  escalationRequired: boolean;
  needsLocation: boolean;
  professionalHelpRecommended: boolean;
  location?: Location | null;
  timestamp: string; // ISO 8601 string
}

/**
 * DTO for creating a new emergency session
 */
export type CreateEmergencySessionInput = Omit<EmergencySession, 'id' | 'timestamp'>;
