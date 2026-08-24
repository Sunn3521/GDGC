/**
 * CrisisMate — Safe Fallback Response
 *
 * Returned when the Gemini API call fails, times out, returns malformed JSON,
 * or when network/API keys are unconfigured.
 *
 * Principles:
 * 1. Must NEVER crash the application.
 * 2. Must NEVER pretend the response was successfully analyzed by AI (confidence = 0).
 * 3. Must ALWAYS recommend immediate safety and escalation for safety.
 * 4. Must NEVER fabricate phone numbers, contacts, or locations.
 */

import type { CrisisAnalysis } from '../../types/crisis';

export const SAFE_FALLBACK_RESPONSE: CrisisAnalysis = {
  emergencyType: 'OTHER',
  severity: 'HIGH',
  confidence: 0,
  summary: 'The situation could not be safely analyzed by the AI engine. Please prioritize your personal safety immediately.',
  immediateRisks: [
    'Uncertain situation hazards',
    'Potential escalation of danger',
  ],
  immediateActions: [
    'Move to a safe location immediately if you are in any danger.',
    'Contact appropriate local emergency services if necessary (e.g. 112 or local emergency number).',
    'Alert nearby people or family members about your situation.',
    'Stay calm and assess your immediate surroundings.',
  ],
  avoid: [
    'Do not put yourself in additional physical danger while seeking assistance.',
    'Do not delay seeking emergency help if you feel your life or health is at risk.',
  ],
  escalationRequired: true,
  needsLocation: false,
  professionalHelpRecommended: true,
  isFallback: true,
};

/**
 * Creates a fresh timestamped copy of the safe fallback response.
 */
export function createSafeFallback(customSummary?: string): CrisisAnalysis {
  return {
    ...SAFE_FALLBACK_RESPONSE,
    summary: customSummary ?? SAFE_FALLBACK_RESPONSE.summary,
    timestamp: new Date().toISOString(),
  };
}
