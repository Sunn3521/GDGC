import { EmergencyType, SeverityLevel } from './emergency';

/**
 * Structured Crisis Analysis response interface output by Gemini Decision Engine (Member 1)
 */
export interface CrisisAnalysis {
  emergencyType: EmergencyType;
  severity: SeverityLevel;
  confidence: number;
  summary: string;
  immediateRisks: string[];
  immediateActions: string[];
  avoid: string[];
  escalationRequired: boolean;
  needsLocation: boolean;
  professionalHelpRecommended: boolean;
}
