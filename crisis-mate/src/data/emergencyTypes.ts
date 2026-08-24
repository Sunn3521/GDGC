/**
 * CrisisMate — Emergency Type Metadata
 *
 * Display metadata for each emergency type.
 * Used by the frontend (Member 2) for icons, colors, and labels.
 * NOT used by the AI engine for decision-making.
 */

import type { EmergencyType, SeverityLevel } from '../types/crisis';

// ─── Emergency Type Metadata ──────────────────────────────────────────────────

export interface EmergencyTypeMetadata {
  type: EmergencyType;
  label: string;
  emoji: string;
  /** Tailwind CSS class for background color */
  bgColor: string;
  /** Tailwind CSS class for text color */
  textColor: string;
  /** Typical severity range for quick-pick UI */
  typicalSeverity: SeverityLevel;
  /** Short description shown in category picker */
  description: string;
  /** Keywords that suggest this type (used for UI suggestions only, NOT AI classification) */
  uiKeywords: string[];
}

export const EMERGENCY_TYPE_METADATA: Record<EmergencyType, EmergencyTypeMetadata> = {
  FIRE: {
    type: 'FIRE',
    label: 'Fire',
    emoji: '🔥',
    bgColor: 'bg-red-900',
    textColor: 'text-red-200',
    typicalSeverity: 'HIGH',
    description: 'Building fire, vehicle fire, or wildfire',
    uiKeywords: ['fire', 'smoke', 'burning', 'flame', 'blaze'],
  },
  MEDICAL: {
    type: 'MEDICAL',
    label: 'Medical',
    emoji: '🏥',
    bgColor: 'bg-pink-900',
    textColor: 'text-pink-200',
    typicalSeverity: 'HIGH',
    description: 'Medical emergency, injury, or health crisis',
    uiKeywords: ['heart', 'breathing', 'collapse', 'unconscious', 'bleeding', 'injury', 'seizure'],
  },
  ACCIDENT: {
    type: 'ACCIDENT',
    label: 'Accident',
    emoji: '🚗',
    bgColor: 'bg-orange-900',
    textColor: 'text-orange-200',
    typicalSeverity: 'HIGH',
    description: 'Road accident, vehicle collision, or crash',
    uiKeywords: ['accident', 'crash', 'collision', 'vehicle', 'car', 'motorcycle', 'truck'],
  },
  FLOOD: {
    type: 'FLOOD',
    label: 'Flood',
    emoji: '🌊',
    bgColor: 'bg-blue-900',
    textColor: 'text-blue-200',
    typicalSeverity: 'HIGH',
    description: 'Flash flood, rising water, or waterlogging',
    uiKeywords: ['flood', 'water', 'rain', 'waterlogging', 'surge', 'inundation'],
  },
  EARTHQUAKE: {
    type: 'EARTHQUAKE',
    label: 'Earthquake',
    emoji: '🌍',
    bgColor: 'bg-yellow-900',
    textColor: 'text-yellow-200',
    typicalSeverity: 'CRITICAL',
    description: 'Earthquake, tremor, or building collapse',
    uiKeywords: ['earthquake', 'tremor', 'shaking', 'collapse', 'quake'],
  },
  CYCLONE: {
    type: 'CYCLONE',
    label: 'Cyclone / Storm',
    emoji: '🌀',
    bgColor: 'bg-indigo-900',
    textColor: 'text-indigo-200',
    typicalSeverity: 'HIGH',
    description: 'Cyclone, hurricane, tornado, or severe storm',
    uiKeywords: ['cyclone', 'storm', 'hurricane', 'tornado', 'wind', 'typhoon'],
  },
  ELECTRICAL: {
    type: 'ELECTRICAL',
    label: 'Electrical',
    emoji: '⚡',
    bgColor: 'bg-amber-900',
    textColor: 'text-amber-200',
    typicalSeverity: 'HIGH',
    description: 'Electrical hazard, fire, or electrocution risk',
    uiKeywords: ['electric', 'electrical', 'shock', 'spark', 'wire', 'socket', 'gas', 'short circuit'],
  },
  PERSONAL_SAFETY: {
    type: 'PERSONAL_SAFETY',
    label: 'Personal Safety',
    emoji: '🛡️',
    bgColor: 'bg-purple-900',
    textColor: 'text-purple-200',
    typicalSeverity: 'HIGH',
    description: 'Threat, assault, harassment, or unsafe situation',
    uiKeywords: ['threat', 'danger', 'attack', 'assault', 'unsafe', 'fear', 'stalker', 'violence'],
  },
  OTHER: {
    type: 'OTHER',
    label: 'Other Emergency',
    emoji: '⚠️',
    bgColor: 'bg-gray-800',
    textColor: 'text-gray-200',
    typicalSeverity: 'MEDIUM',
    description: 'Other emergency or unclassified situation',
    uiKeywords: [],
  },
};

/**
 * Get metadata for an emergency type.
 * Returns OTHER metadata as fallback for unknown types.
 */
export function getEmergencyMetadata(type: EmergencyType): EmergencyTypeMetadata {
  return EMERGENCY_TYPE_METADATA[type] ?? EMERGENCY_TYPE_METADATA.OTHER;
}

/**
 * Get the display label for a severity level.
 */
export function getSeverityLabel(severity: SeverityLevel): string {
  const labels: Record<SeverityLevel, string> = {
    LOW: 'Low Risk',
    MEDIUM: 'Moderate',
    HIGH: 'High Alert',
    CRITICAL: 'Critical — Act Now',
  };
  return labels[severity] ?? severity;
}

/**
 * Get the Tailwind color class for a severity level.
 */
export function getSeverityColor(severity: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
  };
  return colors[severity] ?? 'text-gray-400';
}
