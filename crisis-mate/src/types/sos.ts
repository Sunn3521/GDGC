/**
 * CrisisMate — SOS Emergency Alert Types
 */

import type { CrisisAnalysis, EmergencyType, SeverityLevel } from './crisis';
import type { UserCoordinates } from './location';
import type { Contact } from './contact';

export type SOSStatus =
  | 'PREPARING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface SOSEvent {
  id: string;
  userId?: string;
  timestamp: string;
  emergencyType: EmergencyType;
  severity: SeverityLevel;
  location?: UserCoordinates;
  trustedContacts: Contact[];
  status: SOSStatus;
  deliveryMessage: string;
  analysisSummary: string;
  immediateActions: string[];
}

export interface SOSPreparationResult {
  canProceed: boolean;
  userAuthenticated: boolean;
  trustedContacts: Contact[];
  locationAvailable: boolean;
  message?: string;
}
