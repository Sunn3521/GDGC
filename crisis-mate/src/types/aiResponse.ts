/**
 * CrisisMate — AI Response Type Definitions
 *
 * These types represent the RAW Gemini API response structure BEFORE validation.
 * They are internal to the AI service layer and should NOT be exported to UI components.
 */

import type { EmergencyType, SeverityLevel } from './crisis';

// ─── Raw Gemini Response (unvalidated) ───────────────────────────────────────

/**
 * The shape we EXPECT Gemini to return as JSON.
 * All fields are optional here because we cannot trust raw API output.
 */
export interface RawGeminiResponse {
  emergencyType?: unknown;
  severity?: unknown;
  confidence?: unknown;
  summary?: unknown;
  immediateRisks?: unknown;
  immediateActions?: unknown;
  avoid?: unknown;
  escalationRequired?: unknown;
  needsLocation?: unknown;
  professionalHelpRecommended?: unknown;
}

// ─── Validated Field Types ────────────────────────────────────────────────────

/** A validated, type-safe version of the Gemini response */
export interface ValidatedGeminiResponse {
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

// ─── Validation Result ────────────────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: ValidatedGeminiResponse;
}

// ─── Gemini API Error Types ───────────────────────────────────────────────────

export type GeminiErrorCode =
  | 'INVALID_API_KEY'
  | 'QUOTA_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'PARSE_ERROR'
  | 'VALIDATION_ERROR'
  | 'EMPTY_RESPONSE'
  | 'UNKNOWN';

export interface GeminiError {
  code: GeminiErrorCode;
  message: string;
  retryable: boolean;
}

// ─── Service Call Metadata ────────────────────────────────────────────────────

export interface ServiceCallMetadata {
  attempt: number;
  maxAttempts: number;
  startTime: number;
  model: string;
}
