/**
 * CrisisMate — Response Validator & Normalizer
 *
 * Validates raw Gemini output against the CrisisAnalysis schema.
 * Rejects malformed responses and normalizes safety values.
 */

import type { CrisisAnalysis, EmergencyType, SeverityLevel } from '../../types/crisis';
import { EMERGENCY_TYPES, SEVERITY_LEVELS } from '../../types/crisis';
import type {
  RawGeminiResponse,
  ValidatedGeminiResponse,
  ValidationResult,
} from '../../types/aiResponse';

/**
 * Attempts to extract and parse JSON from raw text.
 * Handles markdown formatting (\`\`\`json ... \`\`\`) if present.
 */
export function parseRawResponse(rawText: string): RawGeminiResponse | null {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if Gemini included them
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```\s*$/, '');
    cleaned = cleaned.trim();
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  const jsonSubstring = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    const parsed = JSON.parse(jsonSubstring) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    return parsed as RawGeminiResponse;
  } catch {
    return null;
  }
}

/**
 * Validates fields of parsed JSON object against CrisisAnalysis rules.
 */
export function validateResponse(raw: RawGeminiResponse): ValidationResult {
  const errors: string[] = [];

  // 1. emergencyType
  if (typeof raw.emergencyType !== 'string' || !(EMERGENCY_TYPES as string[]).includes(raw.emergencyType)) {
    errors.push(`Invalid emergencyType: "${String(raw.emergencyType)}"`);
  }

  // 2. severity
  if (typeof raw.severity !== 'string' || !(SEVERITY_LEVELS as string[]).includes(raw.severity)) {
    errors.push(`Invalid severity: "${String(raw.severity)}"`);
  }

  // 3. confidence
  if (typeof raw.confidence !== 'number' || isNaN(raw.confidence) || raw.confidence < 0 || raw.confidence > 1) {
    errors.push(`Invalid confidence score: ${String(raw.confidence)}`);
  }

  // 4. summary
  if (typeof raw.summary !== 'string' || raw.summary.trim().length === 0) {
    errors.push('Summary must be a non-empty string');
  }

  // 5. immediateRisks
  if (!Array.isArray(raw.immediateRisks) || !raw.immediateRisks.every((item) => typeof item === 'string')) {
    errors.push('immediateRisks must be an array of strings');
  }

  // 6. immediateActions
  if (!Array.isArray(raw.immediateActions) || !raw.immediateActions.every((item) => typeof item === 'string')) {
    errors.push('immediateActions must be an array of strings');
  } else if (raw.immediateActions.length === 0) {
    errors.push('immediateActions array cannot be empty');
  }

  // 7. avoid
  if (!Array.isArray(raw.avoid) || !raw.avoid.every((item) => typeof item === 'string')) {
    errors.push('avoid must be an array of strings');
  }

  // 8. Booleans
  if (typeof raw.escalationRequired !== 'boolean') {
    errors.push('escalationRequired must be a boolean');
  }
  if (typeof raw.needsLocation !== 'boolean') {
    errors.push('needsLocation must be a boolean');
  }
  if (typeof raw.professionalHelpRecommended !== 'boolean') {
    errors.push('professionalHelpRecommended must be a boolean');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const data: ValidatedGeminiResponse = {
    emergencyType: raw.emergencyType as EmergencyType,
    severity: raw.severity as SeverityLevel,
    confidence: raw.confidence as number,
    summary: (raw.summary as string).trim(),
    immediateRisks: (raw.immediateRisks as string[]).map((r) => r.trim()).filter(Boolean),
    immediateActions: (raw.immediateActions as string[]).map((a) => a.trim()).filter(Boolean),
    avoid: (raw.avoid as string[]).map((a) => a.trim()).filter(Boolean),
    escalationRequired: raw.escalationRequired as boolean,
    needsLocation: raw.needsLocation as boolean,
    professionalHelpRecommended: raw.professionalHelpRecommended as boolean,
  };

  return { isValid: true, errors: [], data };
}

/**
 * Converts validated response into final CrisisAnalysis object with safety overrides.
 */
export function normalizeToAnalysis(validated: ValidatedGeminiResponse): CrisisAnalysis {
  const isCritical = validated.severity === 'CRITICAL';
  const isHigh = validated.severity === 'HIGH';

  // Safety Overrides: CRITICAL/HIGH emergencies force escalation and professional help
  const escalationRequired = validated.escalationRequired || isCritical;
  const professionalHelpRecommended = validated.professionalHelpRecommended || isCritical || isHigh;
  const needsLocation = validated.needsLocation || isCritical;

  return {
    emergencyType: validated.emergencyType,
    severity: validated.severity,
    confidence: Math.round(validated.confidence * 100) / 100,
    summary: validated.summary,
    immediateRisks: validated.immediateRisks,
    immediateActions: validated.immediateActions,
    avoid: validated.avoid,
    escalationRequired,
    needsLocation,
    professionalHelpRecommended,
    timestamp: new Date().toISOString(),
    isFallback: false,
  };
}

/**
 * Full parsing + validation + normalization pipeline for raw text.
 */
export function validateAndNormalize(rawText: string): CrisisAnalysis | null {
  const parsed = parseRawResponse(rawText);
  if (!parsed) return null;

  const result = validateResponse(parsed);
  if (!result.isValid || !result.data) return null;

  return normalizeToAnalysis(result.data);
}
