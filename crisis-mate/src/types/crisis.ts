/**
 * CrisisMate — Core Crisis Type Definitions
 *
 * These types form the AI service contract between the Gemini engine
 * and the frontend/backend. The frontend should consume CrisisAnalysis
 * directly from analyzeCrisis() without parsing Gemini raw output.
 */

// ─── Emergency Type Enum ─────────────────────────────────────────────────────

/**
 * Supported emergency categories.
 * Extensible: add new values here and update the prompt accordingly.
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

export const EMERGENCY_TYPES: EmergencyType[] = [
  'FIRE',
  'MEDICAL',
  'ACCIDENT',
  'FLOOD',
  'EARTHQUAKE',
  'CYCLONE',
  'ELECTRICAL',
  'PERSONAL_SAFETY',
  'OTHER',
];

// ─── Severity Level ───────────────────────────────────────────────────────────

/**
 * Four-tier severity classification.
 * CRITICAL → immediate threat to life
 * HIGH     → serious, urgent action required
 * MEDIUM   → needs attention, may escalate
 * LOW      → informational, precautionary
 */
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const SEVERITY_LEVELS: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

// ─── Core Analysis Schema ─────────────────────────────────────────────────────

/**
 * CrisisAnalysis — the primary data structure returned by analyzeCrisis().
 *
 * This is the ONLY structure the frontend should consume.
 * It is produced by the Gemini AI service, validated, and normalized
 * before reaching any UI component.
 */
export interface CrisisAnalysis {
  /** Classified emergency category */
  emergencyType: EmergencyType;

  /** Assessed severity level */
  severity: SeverityLevel;

  /**
   * Confidence score: 0.0 (unknown) – 1.0 (very confident).
   * 0 indicates fallback mode — AI did not successfully analyze the situation.
   */
  confidence: number;

  /** Human-readable one-sentence summary of the identified situation */
  summary: string;

  /** Immediate risks identified in the situation (ordered by danger level) */
  immediateRisks: string[];

  /**
   * Numbered, ordered list of actions to take RIGHT NOW.
   * Should be short, imperative sentences.
   */
  immediateActions: string[];

  /**
   * Things the user must NOT do in this situation.
   * Short, direct warnings.
   */
  avoid: string[];

  /**
   * Whether this emergency requires contacting professional emergency services.
   * Frontend/SOS module should use this to surface call-to-action.
   */
  escalationRequired: boolean;

  /**
   * Whether nearby emergency services (hospital, fire station, police) should
   * be searched via Google Maps. The Maps service consumes this flag.
   */
  needsLocation: boolean;

  /**
   * Whether professional medical/emergency help is strongly recommended.
   * Used for prominent UI warning banners.
   */
  professionalHelpRecommended: boolean;

  /** ISO timestamp of when this analysis was produced */
  timestamp?: string;

  /** Internal: whether this response came from the safe fallback path */
  isFallback?: boolean;
}

// ─── Input Type ───────────────────────────────────────────────────────────────

/** Input to the analyzeCrisis function */
export interface CrisisInput {
  message: string;
  /** Optional user location context (city/region, NOT full address) */
  locationContext?: string;
  /** Optional previous emergency type for context continuity */
  previousType?: EmergencyType;
}

// ─── Analysis Request/Response ────────────────────────────────────────────────

export interface AnalysisRequest {
  input: CrisisInput;
  requestId: string;
  timestamp: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: CrisisAnalysis;
  error?: string;
  requestId: string;
  processingTimeMs: number;
}
