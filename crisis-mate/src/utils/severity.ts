/**
 * CrisisMate — Severity Utilities
 *
 * Helpers for comparing, ordering, and working with severity levels.
 * Used by both the AI service and the frontend.
 */

import type { SeverityLevel } from '../types/crisis';

// ─── Severity Ordering ────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
};

/**
 * Compare two severity levels.
 * Returns:
 *   -1 if a < b
 *    0 if a === b
 *    1 if a > b
 */
export function compareSeverity(a: SeverityLevel, b: SeverityLevel): -1 | 0 | 1 {
  const diff = SEVERITY_ORDER[a] - SEVERITY_ORDER[b];
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * Returns true if severity `a` is at least as severe as `b`.
 */
export function isAtLeastAsSevereAs(a: SeverityLevel, b: SeverityLevel): boolean {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b];
}

/**
 * Returns the more severe of two levels.
 */
export function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
}

/**
 * Returns true if the severity is HIGH or CRITICAL.
 */
export function isHighSeverity(severity: SeverityLevel): boolean {
  return severity === 'HIGH' || severity === 'CRITICAL';
}

/**
 * Returns true if the severity is CRITICAL.
 */
export function isCritical(severity: SeverityLevel): boolean {
  return severity === 'CRITICAL';
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

/**
 * Get a display label for a severity level.
 */
export function getSeverityLabel(severity: SeverityLevel): string {
  const labels: Record<SeverityLevel, string> = {
    LOW: 'Low Risk',
    MEDIUM: 'Moderate',
    HIGH: 'High Alert',
    CRITICAL: 'Critical — Act Now',
  };
  return labels[severity];
}

/**
 * Get an emoji indicator for a severity level.
 */
export function getSeverityEmoji(severity: SeverityLevel): string {
  const emojis: Record<SeverityLevel, string> = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    CRITICAL: '🔴',
  };
  return emojis[severity];
}

/**
 * Get the appropriate CSS color variable name for a severity level.
 * Maps to tailwind classes in the crisis color palette.
 */
export function getSeverityColorClass(severity: SeverityLevel): string {
  const classes: Record<SeverityLevel, string> = {
    LOW: 'text-crisis-low',
    MEDIUM: 'text-crisis-medium',
    HIGH: 'text-crisis-high',
    CRITICAL: 'text-crisis-critical',
  };
  return classes[severity];
}

/**
 * Get background color class for severity badges.
 */
export function getSeverityBgClass(severity: SeverityLevel): string {
  const classes: Record<SeverityLevel, string> = {
    LOW: 'bg-green-900 text-green-200',
    MEDIUM: 'bg-yellow-900 text-yellow-200',
    HIGH: 'bg-orange-900 text-orange-200',
    CRITICAL: 'bg-red-900 text-red-200',
  };
  return classes[severity];
}

/**
 * Get the recommended UI urgency indicator for a severity level.
 * Used to determine animation or pulsing behavior.
 */
export function getSeverityUrgency(severity: SeverityLevel): 'calm' | 'alert' | 'urgent' | 'emergency' {
  const urgency: Record<SeverityLevel, 'calm' | 'alert' | 'urgent' | 'emergency'> = {
    LOW: 'calm',
    MEDIUM: 'alert',
    HIGH: 'urgent',
    CRITICAL: 'emergency',
  };
  return urgency[severity];
}
