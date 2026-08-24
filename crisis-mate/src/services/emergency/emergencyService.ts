/**
 * CrisisMate — Emergency Service
 *
 * Orchestration layer that combines AI analysis, session management,
 * and signals to Maps/Firebase services.
 */

import type { CrisisAnalysis, CrisisInput } from '../../types/crisis';
import type { EmergencySession, SOSEvent, SOSStatus } from '../../types/emergency';
import { analyzeCrisis, analyzeCrisisWithContext } from '../gemini/geminiService';

export * from '../firebase/emergencyService';

let _currentSession: EmergencySession | null = null;

/**
 * Start a new emergency analysis session.
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
    id: `session_${Date.now()}`,
    userId: userId || 'anonymous',
    emergencyType: analysis.emergencyType,
    severity: analysis.severity,
    summary: analysis.summary,
    userPrompt: message,
    userMessage: message,
    immediateActions: analysis.immediateActions,
    avoidInstructions: analysis.avoid,
    escalationRequired: analysis.escalationRequired,
    needsLocation: analysis.needsLocation,
    professionalHelpRecommended: analysis.professionalHelpRecommended,
    analysis,
    sosTrigger: false,
    locationActivated: analysis.needsLocation,
    timestamp: new Date().toISOString(),
    startedAt: new Date().toISOString(),
  };

  _currentSession = session;

  if (analysis.needsLocation) {
    console.log('[EmergencyService] Location services recommended — notify Maps module');
  }

  return { session, analysis };
}

/**
 * Re-analyze the current emergency with additional context.
 */
export async function refineAnalysis(
  additionalContext: string,
  input?: Partial<CrisisInput>
): Promise<CrisisAnalysis> {
  const fullMessage = _currentSession
    ? `${_currentSession.userPrompt || _currentSession.userMessage}\n\nAdditional information: ${additionalContext}`
    : additionalContext;

  return analyzeCrisisWithContext({
    message: fullMessage,
    ...input,
    previousType: _currentSession?.emergencyType,
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
  outcome: string = 'RESOLVED'
): EmergencySession | null {
  if (!_currentSession) return null;
  _currentSession = {
    ..._currentSession,
    resolvedAt: new Date().toISOString(),
  };
  const resolved = _currentSession;
  _currentSession = null;
  return resolved;
}

/**
 * Create an SOS event from the current session.
 */
export function createSOSEvent(
  location?: { latitude: number; longitude: number }
): SOSEvent | null {
  if (!_currentSession) {
    console.warn('[EmergencyService] Cannot create SOS — no active session');
    return null;
  }

  const sosEvent: SOSEvent = {
    sessionId: _currentSession.id,
    userId: _currentSession.userId,
    timestamp: new Date().toISOString(),
    status: 'PENDING' as SOSStatus,
    analysis: _currentSession.analysis || {
      emergencyType: _currentSession.emergencyType,
      severity: _currentSession.severity,
      confidence: 1,
      summary: _currentSession.summary,
      immediateRisks: [],
      immediateActions: _currentSession.immediateActions,
      avoid: _currentSession.avoidInstructions,
      escalationRequired: _currentSession.escalationRequired,
      needsLocation: _currentSession.needsLocation,
      professionalHelpRecommended: _currentSession.professionalHelpRecommended,
    },
    ...(location ? { location } : {}),
  };

  _currentSession = {
    ..._currentSession,
    sosTrigger: true,
  };

  console.log('[EmergencyService] SOS event created — awaiting Firebase send confirmation');
  return sosEvent;
}

export { analyzeCrisis, analyzeCrisisWithContext };
