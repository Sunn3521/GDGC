import React from 'react';
import type { SeverityLevel } from '../../types/crisis';
import { getSeverityLabel, getSeverityBgClass, getSeverityEmoji } from '../../utils/severity';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const bgClass = getSeverityBgClass(severity);
  const label = getSeverityLabel(severity);
  const emoji = getSeverityEmoji(severity);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-sm font-bold',
    lg: 'px-4 py-1.5 text-base font-extrabold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 ${bgClass} ${sizeClasses[size]}`}
      role="status"
      aria-label={`Severity level: ${label}`}
    >
      <span>{emoji}</span>
      <span>{label.toUpperCase()}</span>
    </span>
  );
};
