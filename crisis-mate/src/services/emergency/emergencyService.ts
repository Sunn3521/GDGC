/**
 * CrisisMate — Emergency Service
 *
 * Orchestration layer that combines AI analysis, session management,
 * and signals to Maps/Firebase services.
 *
 * This is the "application layer" — it sits between the frontend and
 * the individual services (Gemini, Firebase, Maps).
 *
 * Frontend → emergencyService → [AI, Firebase, Maps]
 *
 * Other team members integrate here:
 *   - Member 3 (Firebase): saveEmergencySession(), getEmergencyHistory()
 *   - Member 4 (Maps/Offline): getNearbyServices() triggered when needsLocation=true
 */

import type { CrisisAnalysis, CrisisInput } from '../../types/crisis';
import type { EmergencySession, SOSEvent, SOSStatus } from '../../types/emergency';
import { analyzeCrisis, analyzeCrisisWithContext } from '../gemini/geminiService';

// ─── Emergency Session Manager ────────────────────────────────────────────────

let _currentSession: EmergencySession | null = null;

/**
 * Start a new emergency analysis session.
 *
 * This is the primary entry point called by the frontend.
 * It orchestrates the full AI pipeline and sets up a session.
 *
 * @param message - User's emergency description
 * @returns { session, analysis } — session for persistence, analysis for display
 */
export async function startEmergencySession(
  message: string,
  userId?: string
): Promise<{ session: EmergencySession; analysis: CrisisAnalysis }> {
  console.log('[EmergencyService] Starting new emergency session...');

  // Step 1: Get AI analysis
  const analysis = await analyzeCrisis(message);

  // Step 2: Create session object
  const session: EmergencySession = {
    userMessage: message,
    analysis,
    sosTrigger: false,
    locationActivated: analysis.needsLocation,
    startedAt: new Date().toISOString(),
    ...(userId ? { userId } : {}),
  };

  _currentSession = session;

  // Step 3: If needsLocation is true, the Maps service (Member 4) should
  // be called from the UI layer or a useEffect hook with this flag.
  // We do NOT call it here to maintain clean service separation.
  if (analysis.needsLocation) {
    console.log('[EmergencyService] Location services recommended — notify Maps module');
  }

  // Step 4: Firebase save will be triggered by Member 3's integration
  // using the session object returned here. We do NOT directly call
  // Firebase here to avoid coupling.

  return { session, analysis };
}

/**
 * Re-analyze the current emergency with additional context.
 * Useful when the user provides more details.
 */
export async function refineAnalysis(
  additionalContext: string,
  input?: Partial<CrisisInput>
): Promise<CrisisAnalysis> {
  const fullMessage = _currentSession
    ? `${_currentSession.userMessage}\n\nAdditional information: ${additionalContext}`
    : additionalContext;

  return analyzeCrisisWithContext({
    message: fullMessage,
    ...input,
    previousType: _currentSession?.analysis.emergencyType,
  });
}

/**
 * Get the current active session (if any).
 */
export function getCurrentSession(): EmergencySession | null {
  return _currentSession;
}

/**
 * Mark the current session as resolved.
 */
export function resolveCurrentSession(
  outcome: EmergencySession['outcome'] = 'RESOLVED'
): EmergencySession | null {
  if (!_currentSession) return null;
  _currentSession = {
    ..._currentSession,
    resolvedAt: new Date().toISOString(),
    outcome,
  };
  const resolved = _currentSession;
  _currentSession = null;
  return resolved;
}

// ─── SOS Management ───────────────────────────────────────────────────────────

/**
 * Create an SOS event from the current session.
 *
 * IMPORTANT: This function creates the SOS data object but does NOT
 * actually send it to any service. Member 3 (Firebase) must implement
 * the actual send logic (e.g., firestoreSOS.ts).
 *
 * The AI engine will NEVER claim an SOS was sent unless the Firebase
 * service confirms it.
 */
export function createSOSEvent(
  location?: { latitude: number; longitude: number }
): SOSEvent | null {
  if (!_currentSession) {
    console.warn('[EmergencyService] Cannot create SOS — no active session');
    return null;
  }

  const sosEvent: SOSEvent = {
    sessionId: _currentSession.id ?? `session_${Date.now()}`,
    userId: _currentSession.userId,
    timestamp: new Date().toISOString(),
    status: 'PENDING' as SOSStatus,
    analysis: _currentSession.analysis,
    ...(location ? { location } : {}),
  };

  // Update session to record SOS trigger
  _currentSession = {
    ..._currentSession,
    sosTrigger: true,
  };

  console.log('[EmergencyService] SOS event created — awaiting Firebase send confirmation');
  return sosEvent;
}

// ─── Simple Direct Analyzer ───────────────────────────────────────────────────

/**
 * Lightweight analysis without session management.
 * Use this for quick lookups or when session persistence is not needed.
 */
export { analyzeCrisis, analyzeCrisisWithContext };
