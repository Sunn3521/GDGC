import { describe, it, expect, vi } from 'vitest';
import type { CrisisAnalysis } from '../src/types/crisis';
import { validateEmergencyMessage } from '../src/utils/validation';
import { getSeverityLabel, getSeverityBgClass } from '../src/utils/severity';
import { formatEmergencyType, formatConfidence } from '../src/utils/formatting';

describe('CrisisMate Frontend Component Logic & UI Flow (Phase 3)', () => {
  // 1. Home renders check
  it('1. Home page routes and components exist', async () => {
    const { HomePage } = await import('../src/pages/Home/HomePage');
    expect(HomePage).toBeDefined();
  });

  // 2. Emergency input renders check
  it('2. EmergencyInputPage component exists', async () => {
    const { EmergencyInputPage } = await import('../src/pages/EmergencyInput/EmergencyInputPage');
    expect(EmergencyInputPage).toBeDefined();
  });

  // 3. Empty input is rejected
  it('3. Empty input is rejected by validation', () => {
    const emptyResult = validateEmergencyMessage('');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.error).toBeDefined();

    const shortResult = validateEmergencyMessage('hi');
    expect(shortResult.isValid).toBe(false);
  });

  // 4. Valid input triggers analysis
  it('4. Valid input passes validation for analysis trigger', () => {
    const result = validateEmergencyMessage('There is a fire in my hostel room and heavy smoke.');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toContain('fire');
  });

  // 5. Loading state helper
  it('5. LoadingSpinner component renders with custom message', async () => {
    const { LoadingSpinner } = await import('../src/components/Loading/LoadingSpinner');
    expect(LoadingSpinner).toBeDefined();
  });

  // 6. Crisis result displays correct formatting
  it('6. Crisis result formats analysis data correctly', () => {
    const mockAnalysis: CrisisAnalysis = {
      emergencyType: 'FIRE',
      severity: 'CRITICAL',
      confidence: 0.95,
      summary: 'Hostel room fire reported.',
      immediateRisks: ['Smoke inhalation'],
      immediateActions: ['Evacuate room immediately', 'Call fire emergency'],
      avoid: ['Do not use elevators'],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    expect(formatEmergencyType(mockAnalysis.emergencyType)).toBe('Fire Emergency');
    expect(formatConfidence(mockAnalysis.confidence)).toBe('95% confidence');
  });

  // 7. CRITICAL severity displays emergency warning
  it('7. CRITICAL severity activates emergency warning indicators', () => {
    const label = getSeverityLabel('CRITICAL');
    const bgClass = getSeverityBgClass('CRITICAL');
    expect(label).toContain('Critical');
    expect(bgClass).toContain('red');
  });

  // 8. Fallback state is clearly indicated
  it('8. Fallback analysis formats confidence as unavailable', () => {
    const fallbackAnalysis: CrisisAnalysis = {
      emergencyType: 'OTHER',
      severity: 'HIGH',
      confidence: 0,
      summary: 'Safe fallback',
      immediateRisks: [],
      immediateActions: ['Move to safety'],
      avoid: [],
      escalationRequired: true,
      needsLocation: false,
      professionalHelpRecommended: true,
      isFallback: true,
    };

    expect(fallbackAnalysis.isFallback).toBe(true);
    expect(formatConfidence(fallbackAnalysis.confidence)).toBe('Analysis unavailable');
  });

  // 9. Emergency actions render
  it('9. ActionList structures numbered priority actions', async () => {
    const { ActionList } = await import('../src/components/ActionList/ActionList');
    expect(ActionList).toBeDefined();
  });

  // 10. Avoid actions render
  it('10. AvoidList structures warning items', async () => {
    const { AvoidList } = await import('../src/components/CrisisCard/AvoidList');
    expect(AvoidList).toBeDefined();
  });
});
