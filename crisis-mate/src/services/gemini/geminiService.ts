/**
 * CrisisMate — Gemini Service (Placeholder / Stub)
 *
 * This module will be implemented in Phase 2 with the Gemini API integration.
 */

import type { CrisisAnalysis, CrisisInput } from '../../types/crisis';

export async function analyzeCrisis(_message: string): Promise<CrisisAnalysis> {
  throw new Error('Gemini API is not implemented in this phase.');
}

export async function analyzeCrisisWithContext(_input: CrisisInput): Promise<CrisisAnalysis> {
  throw new Error('Gemini API is not implemented in this phase.');
}
