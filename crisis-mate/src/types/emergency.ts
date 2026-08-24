import type { CrisisAnalysis } from './crisis';

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
  accuracy?: number;
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
  userMessage?: string;
  immediateActions: string[];
  avoidInstructions: string[];
  escalationRequired: boolean;
  needsLocation: boolean;
  professionalHelpRecommended: boolean;
  location?: Location | null;
  timestamp: string; // ISO 8601 string
  startedAt?: string;
  resolvedAt?: string;
  sosTrigger?: boolean;
  locationActivated?: boolean;
  analysis?: CrisisAnalysis;
}

/**
 * DTO for creating a new emergency session
 */
export type CreateEmergencySessionInput = Omit<EmergencySession, 'id' | 'timestamp'> & {
  id?: string;
  timestamp?: string;
};

// ─── Emergency Contact ────────────────────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// ─── Emergency Guide ──────────────────────────────────────────────────────────

export interface EmergencyGuide {
  type: EmergencyType;
  title: string;
  shortSteps: string[];
  fullGuideUrl?: string;
  severity: SeverityLevel;
  lastUpdated: string;
}

// ─── SOS State ───────────────────────────────────────────────────────────────

export type SOSStatus = 'IDLE' | 'PENDING' | 'SENT' | 'ACKNOWLEDGED' | 'CANCELLED';

export interface SOSEvent {
  sessionId: string;
  userId?: string;
  timestamp: string;
  status: SOSStatus;
  location?: {
    latitude: number;
    longitude: number;
  };
  analysis: CrisisAnalysis;
}
