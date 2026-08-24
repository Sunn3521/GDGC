/**
 * CrisisMate — Response Validator (Placeholder / Stub)
 *
 * This module will be implemented in Phase 2 for validating Gemini AI outputs.
 */

import type { CrisisAnalysis } from '../../types/crisis';

export function parseRawResponse(_rawText: string): unknown {
  return null;
}

export function validateResponse(_raw: unknown): { isValid: boolean; errors: string[] } {
  return { isValid: false, errors: ['Not implemented in this phase.'] };
}

export function validateAndNormalize(_rawText: string): CrisisAnalysis | null {
  return null;
}
