/**
 * CrisisMate — Input Validation Utilities
 *
 * Shared validation helpers used by the AI service and potentially by
 * the frontend for client-side validation before API calls.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const INPUT_MIN_LENGTH = 5;
export const INPUT_MAX_LENGTH = 2000;
export const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;

// ─── Message Validation ───────────────────────────────────────────────────────

export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  sanitized?: string;
}

/**
 * Validate an emergency message for quality and safety.
 */
export function validateEmergencyMessage(message: string): MessageValidationResult {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Please describe your emergency situation.' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Please describe your emergency situation.' };
  }

  if (trimmed.length < INPUT_MIN_LENGTH) {
    return {
      isValid: false,
      error: 'Please provide more details. Describe what is happening.',
    };
  }

  if (trimmed.length > INPUT_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Please keep your description under ${INPUT_MAX_LENGTH} characters.`,
    };
  }

  // Warn about very short messages that may produce poor AI results
  const warning =
    trimmed.length < 20
      ? 'Adding more details will help get a more accurate response.'
      : undefined;

  // Sanitize control characters
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  return { isValid: true, sanitized, warning };
}

/**
 * Check if a message likely describes a real emergency vs. a test/informational query.
 * Returns true if it appears to be an active emergency.
 * Used for UI hinting only — the AI makes the actual determination.
 */
export function appearsToBeActiveEmergency(message: string): boolean {
  const lower = message.toLowerCase();
  const activeIndicators = [
    'is happening',
    'right now',
    'happening now',
    'currently',
    'there is',
    "there's",
    'i see',
    'i saw',
    'i am',
    "i'm",
    'my friend',
    'someone',
    'people are',
    'trapped',
    'fire',
    'smoke',
    'bleeding',
    'collapsed',
    'injured',
    'accident',
    'help',
    'emergency',
    'danger',
    'please',
  ];

  return activeIndicators.some((indicator) => lower.includes(indicator));
}

// ─── Phone Number Validation ──────────────────────────────────────────────────

/**
 * Basic phone number format validation.
 * Does NOT validate against any specific country's format.
 */
export function isValidPhoneNumber(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

// ─── ID Generation ────────────────────────────────────────────────────────────

/**
 * Generate a simple unique ID for sessions (not cryptographically secure).
 * Firebase will assign real document IDs when the session is saved.
 */
export function generateSessionId(): string {
  return `crisis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
