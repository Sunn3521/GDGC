/**
 * CrisisMate — Emergency Session & Input Types
 *
 * Types for emergency sessions (Firebase integration) and user input.
 * Firebase team (Member 3) can extend EmergencySession with Firestore document structure.
 */

import type { CrisisAnalysis, EmergencyType, SeverityLevel } from './crisis';

// ─── Emergency Session ────────────────────────────────────────────────────────

/**
 * An emergency session represents one user-initiated emergency interaction.
 * Can be persisted to Firestore by Member 3.
 */
export interface EmergencySession {
  /** Firestore document ID (set by Firebase service) */
  id?: string;

  /** Authenticated user ID (set by Firebase Auth) */
  userId?: string;

  /** The original user message */
  userMessage: string;

  /** The AI analysis result */
  analysis: CrisisAnalysis;

  /** Whether SOS was triggered */
  sosTrigger: boolean;

  /** Whether location services were activated */
  locationActivated: boolean;

  /** Session start time (ISO string) */
  startedAt: string;

  /** Session end/resolve time */
  resolvedAt?: string;

  /** User-reported outcome */
  outcome?: 'RESOLVED' | 'ONGOING' | 'ESCALATED' | 'CANCELLED';

  /** Device geolocation at time of emergency (if user consented) */
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

// ─── Emergency Contact ────────────────────────────────────────────────────────

/** Emergency contact types for the Contacts page (Member 2/3 integration) */
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// ─── Emergency Guide ──────────────────────────────────────────────────────────

/** Offline emergency guide entry (Member 4 integration) */
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
