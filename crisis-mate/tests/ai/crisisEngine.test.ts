/**
 * CrisisMate — AI Crisis Decision Engine Test Suite
 *
 * Covers all 10 required test scenarios for Phase 2.
 * Uses mock executor to run 100% offline without requiring a real API key.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  analyzeCrisis,
  validateUserInput,
  setGeminiExecutor,
} from '../../src/services/gemini/geminiService';
import { validateAndNormalize, parseRawResponse, validateResponse } from '../../src/services/gemini/responseValidator';
import { SAFE_FALLBACK_RESPONSE } from '../../src/services/gemini/fallbackResponse';

describe('CrisisMate AI Crisis Decision Engine (Phase 2)', () => {
  afterEach(() => {
    setGeminiExecutor(null);
  });

  // ─── TEST 1: FIRE ─────────────────────────────────────────────────────────
  it('TEST 1: Fire scenario classifies as FIRE with HIGH or CRITICAL severity', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'FIRE',
        severity: 'CRITICAL',
        confidence: 0.95,
        summary: 'A hostel room fire filled with heavy smoke reported.',
        immediateRisks: ['Smoke inhalation', 'Rapid fire spread'],
        immediateActions: ['Evacuate room immediately', 'Cover mouth with damp cloth', 'Call fire emergency'],
        avoid: ['Do not use elevators', 'Do not stay inside to gather belongings'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
      })
    );

    const result = await analyzeCrisis(
      'There is a fire in my hostel room and the room is filling with smoke.'
    );

    expect(result.emergencyType).toBe('FIRE');
    expect(['HIGH', 'CRITICAL']).toContain(result.severity);
    expect(result.immediateActions.length).toBeGreaterThan(0);
    expect(result.isFallback).toBe(false);
  });

  // ─── TEST 2: MEDICAL ──────────────────────────────────────────────────────
  it('TEST 2: Medical emergency classifies as MEDICAL, CRITICAL, with escalationRequired=true', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'MEDICAL',
        severity: 'CRITICAL',
        confidence: 0.98,
        summary: 'Unresponsive individual collapsed suddenly.',
        immediateRisks: ['Cardiac arrest', 'Airway obstruction'],
        immediateActions: ['Check breathing and pulse', 'Call ambulance immediately', 'Begin CPR if trained'],
        avoid: ['Do not give food or liquid to unconscious person'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
      })
    );

    const result = await analyzeCrisis(
      'My friend suddenly collapsed and is not responding.'
    );

    expect(result.emergencyType).toBe('MEDICAL');
    expect(result.severity).toBe('CRITICAL');
    expect(result.escalationRequired).toBe(true);
    expect(result.professionalHelpRecommended).toBe(true);
  });

  // ─── TEST 3: ACCIDENT ─────────────────────────────────────────────────────
  it('TEST 3: Road accident classifies as ACCIDENT with HIGH or CRITICAL severity', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'ACCIDENT',
        severity: 'HIGH',
        confidence: 0.92,
        summary: 'Motorcycle collision with person lying on road.',
        immediateRisks: ['Traffic hazards', 'Severe spinal or internal trauma'],
        immediateActions: ['Ensure traffic safety around victim', 'Call emergency services', 'Keep victim still'],
        avoid: ['Do not move victim unless in immediate danger from fire or traffic'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
      })
    );

    const result = await analyzeCrisis(
      'I saw a motorcycle accident and one person is lying on the road.'
    );

    expect(result.emergencyType).toBe('ACCIDENT');
    expect(['HIGH', 'CRITICAL']).toContain(result.severity);
  });

  // ─── TEST 4: FLOOD ────────────────────────────────────────────────────────
  it('TEST 4: Flood scenario classifies as FLOOD with HIGH or CRITICAL severity', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'FLOOD',
        severity: 'HIGH',
        confidence: 0.9,
        summary: 'Rapid water inundation inside residential structure.',
        immediateRisks: ['Electrocution from submerged outlets', 'Rising flood water'],
        immediateActions: ['Move to higher floor or roof', 'Shut off main electric supply if safe'],
        avoid: ['Do not walk or drive through moving water'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
      })
    );

    const result = await analyzeCrisis(
      'Water is rapidly entering our house after heavy rain.'
    );

    expect(result.emergencyType).toBe('FLOOD');
    expect(['HIGH', 'CRITICAL']).toContain(result.severity);
  });

  // ─── TEST 5: ELECTRICAL ───────────────────────────────────────────────────
  it('TEST 5: Electrical hazard classifies as ELECTRICAL with HIGH or CRITICAL severity', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'ELECTRICAL',
        severity: 'HIGH',
        confidence: 0.91,
        summary: 'Active electrical sparking from power socket.',
        immediateRisks: ['Electrical fire', 'Electrocution'],
        immediateActions: ['Disconnect main circuit breaker', 'Keep distance from socket'],
        avoid: ['Do not touch socket or use water on electrical fire'],
        escalationRequired: true,
        needsLocation: false,
        professionalHelpRecommended: true,
      })
    );

    const result = await analyzeCrisis(
      'There are sparks coming from an electrical socket.'
    );

    expect(result.emergencyType).toBe('ELECTRICAL');
    expect(['HIGH', 'CRITICAL']).toContain(result.severity);
  });

  // ─── TEST 6: PERSONAL SAFETY ──────────────────────────────────────────────
  it('TEST 6: Threat scenario classifies as PERSONAL_SAFETY with HIGH or CRITICAL severity', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'PERSONAL_SAFETY',
        severity: 'CRITICAL',
        confidence: 0.94,
        summary: 'Immediate personal physical threat reported.',
        immediateRisks: ['Physical violence', 'Harm from aggressor'],
        immediateActions: ['Move to a safe public area', 'Call police emergency', 'Alert bystanders'],
        avoid: ['Do not confront aggressor directly'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
      })
    );

    const result = await analyzeCrisis(
      'Someone is threatening me and I am afraid they may hurt me.'
    );

    expect(result.emergencyType).toBe('PERSONAL_SAFETY');
    expect(['HIGH', 'CRITICAL']).toContain(result.severity);
  });

  // ─── TEST 7: LOW RISK ─────────────────────────────────────────────────────
  it('TEST 7: Information request evaluates to LOW or MEDIUM severity', async () => {
    setGeminiExecutor(async () =>
      JSON.stringify({
        emergencyType: 'OTHER',
        severity: 'LOW',
        confidence: 0.85,
        summary: 'Inquiry regarding basic emergency first aid supplies.',
        immediateRisks: ['Unpreparedness in future emergencies'],
        immediateActions: ['Stock bandages, antiseptic, gauze, and scissors', 'Keep medical contact list'],
        avoid: ['Do not store expired medications'],
        escalationRequired: false,
        needsLocation: false,
        professionalHelpRecommended: false,
      })
    );

    const result = await analyzeCrisis(
      'What should I keep in an emergency first aid kit?'
    );

    expect(['LOW', 'MEDIUM']).toContain(result.severity);
  });

  // ─── TEST 8: EMPTY INPUT ──────────────────────────────────────────────────
  it('TEST 8: Empty or invalid input triggers validation error without calling Gemini', async () => {
    const mockExecutor = vi.fn();
    setGeminiExecutor(mockExecutor);

    const result = await analyzeCrisis('   ');

    expect(mockExecutor).not.toHaveBeenCalled();
    expect(result.isFallback).toBe(true);
    expect(result.confidence).toBe(0);
  });

  // ─── TEST 9: MALFORMED RESPONSE ───────────────────────────────────────────
  it('TEST 9: Malformed Gemini JSON is rejected by validator and safe fallback is returned', async () => {
    setGeminiExecutor(async () => 'INVALID_NON_JSON_RESPONSE {{{');

    const result = await analyzeCrisis('There is a fire in my building!');

    expect(result.isFallback).toBe(true);
    expect(result.confidence).toBe(0);
    expect(result.escalationRequired).toBe(true);
    expect(result.professionalHelpRecommended).toBe(true);
  });

  // ─── TEST 10: SIMULATED API FAILURE ───────────────────────────────────────
  it('TEST 10: Simulated Gemini network failure returns safe fallback without crashing', async () => {
    setGeminiExecutor(async () => {
      throw new Error('Network error: Unable to reach Gemini API endpoint');
    });

    const result = await analyzeCrisis('My friend fell down the stairs.');

    expect(result).toBeDefined();
    expect(result.isFallback).toBe(true);
    expect(result.confidence).toBe(0);
    expect(result.immediateActions.length).toBeGreaterThan(0);
  });
});
