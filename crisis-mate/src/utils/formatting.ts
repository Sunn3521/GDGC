/**
 * CrisisMate — Formatting Utilities
 *
 * Display formatting helpers for emergency analysis data.
 * Used by the frontend team (Member 2) to render CrisisAnalysis.
 */

import type { CrisisAnalysis, EmergencyType } from '../types/crisis';

// ─── Emergency Type Formatting ────────────────────────────────────────────────

/**
 * Get a human-readable label for an emergency type.
 */
export function formatEmergencyType(type: EmergencyType): string {
  const labels: Record<EmergencyType, string> = {
    FIRE: 'Fire Emergency',
    MEDICAL: 'Medical Emergency',
    ACCIDENT: 'Road Accident',
    FLOOD: 'Flood',
    EARTHQUAKE: 'Earthquake',
    CYCLONE: 'Cyclone / Severe Storm',
    ELECTRICAL: 'Electrical Hazard',
    PERSONAL_SAFETY: 'Personal Safety Threat',
    OTHER: 'Emergency',
  };
  return labels[type] ?? 'Emergency';
}

/**
 * Get the emoji for an emergency type.
 */
export function getEmergencyEmoji(type: EmergencyType): string {
  const emojis: Record<EmergencyType, string> = {
    FIRE: '🔥',
    MEDICAL: '🏥',
    ACCIDENT: '🚗',
    FLOOD: '🌊',
    EARTHQUAKE: '🌍',
    CYCLONE: '🌀',
    ELECTRICAL: '⚡',
    PERSONAL_SAFETY: '🛡️',
    OTHER: '⚠️',
  };
  return emojis[type] ?? '⚠️';
}

// ─── Confidence Formatting ────────────────────────────────────────────────────

/**
 * Format a confidence score as a percentage string.
 */
export function formatConfidence(confidence: number): string {
  if (confidence === 0) return 'Analysis unavailable';
  return `${Math.round(confidence * 100)}% confidence`;
}

/**
 * Get a human-readable confidence label.
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence === 0) return 'Unavailable';
  if (confidence >= 0.9) return 'High Confidence';
  if (confidence >= 0.7) return 'Moderate Confidence';
  if (confidence >= 0.5) return 'Low Confidence';
  return 'Very Low Confidence';
}

// ─── Time Formatting ──────────────────────────────────────────────────────────

/**
 * Format an ISO timestamp as a relative time string.
 * e.g., "Just now", "2 minutes ago"
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 10) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
  return date.toLocaleDateString();
}

/**
 * Format a timestamp as a locale time string.
 */
export function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── Analysis Summary Formatting ─────────────────────────────────────────────

/**
 * Create a short plain-text summary suitable for notifications or share text.
 */
export function formatAnalysisSummary(analysis: CrisisAnalysis): string {
  const emoji = getEmergencyEmoji(analysis.emergencyType);
  const type = formatEmergencyType(analysis.emergencyType);
  return `${emoji} ${analysis.severity} — ${type}: ${analysis.summary}`;
}

/**
 * Format the action list as a numbered string (for SMS/notification).
 */
export function formatActionsAsText(actions: string[]): string {
  return actions.map((action, i) => `${i + 1}. ${action}`).join('\n');
}

/**
 * Check if an analysis is the safe fallback (AI failed).
 */
export function isAIFallback(analysis: CrisisAnalysis): boolean {
  return analysis.isFallback === true || analysis.confidence === 0;
}
