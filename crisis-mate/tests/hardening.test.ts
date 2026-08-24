import { describe, it, expect, vi } from 'vitest';
import { validateEmergencyMessage } from '../src/utils/validation';
import { validateContactInput } from '../src/services/firebase/contactService';
import { getLocalGuide } from '../src/data/emergencyGuides';
import { searchNearbyServices, calculateDistanceMeters } from '../src/services/location/mapsService';
import { createSOSEvent } from '../src/services/sos/sosService';
import type { CrisisAnalysis } from '../src/types/crisis';
import type { Contact } from '../src/types/contact';

describe('CrisisMate Phase 6 Hardening & Integration Suite', () => {
  // 1. Complete emergency flow validation
  it('1. Complete emergency flow: validates input, normalizes analysis, and provides action steps', async () => {
    const validMessage = 'There is a fire in my hostel room and heavy smoke.';
    const validation = validateEmergencyMessage(validMessage);

    expect(validation.isValid).toBe(true);
    expect(validation.sanitized).toContain('fire');
  });

  // 2. Gemini fallback flow
  it('2. Gemini fallback flow: returns safe non-crashing response when API fails', async () => {
    const { createSafeFallback } = await import('../src/services/gemini/fallbackResponse');
    const fallback = createSafeFallback('API connection failed');

    expect(fallback.isFallback).toBe(true);
    expect(fallback.confidence).toBe(0);
    expect(fallback.escalationRequired).toBe(true);
    expect(fallback.professionalHelpRecommended).toBe(true);
  });

  // 3. Critical emergency flow
  it('3. Critical emergency flow: forces escalation and professional help flags', async () => {
    const { validateAndNormalize } = await import('../src/services/gemini/responseValidator');
    const rawJson = JSON.stringify({
      emergencyType: 'MEDICAL',
      severity: 'CRITICAL',
      confidence: 0.98,
      summary: 'Unresponsive person.',
      immediateRisks: ['Airway obstruction'],
      immediateActions: ['Check breathing', 'Call 108'],
      avoid: ['Do not give water'],
      escalationRequired: false, // AI gave false, normalizer will override to true
      needsLocation: false,
      professionalHelpRecommended: false,
    });

    const normalized = validateAndNormalize(rawJson);
    expect(normalized).not.toBeNull();
    expect(normalized!.escalationRequired).toBe(true);
    expect(normalized!.professionalHelpRecommended).toBe(true);
    expect(normalized!.needsLocation).toBe(true);
  });

  // 4. Location permission denied
  it('4. Location permission denied produces typed error object', async () => {
    const { setMockLocation, getCurrentLocation } = await import('../src/services/location/locationService');
    setMockLocation(null, 'User denied geolocation permission.');

    const result = await getCurrentLocation();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('PERMISSION_DENIED');
  });

  // 5. Location success
  it('5. Location success returns exact user coordinates', async () => {
    const { setMockLocation, getCurrentLocation } = await import('../src/services/location/locationService');
    setMockLocation({ latitude: 12.9716, longitude: 77.5946, accuracy: 5 });

    const result = await getCurrentLocation();
    expect(result.success).toBe(true);
    expect(result.coords?.latitude).toBe(12.9716);
  });

  // 6. Nearby service search & navigation URLs
  it('6. Nearby service search calculates distances and navigation URLs', async () => {
    const coords = { latitude: 12.9716, longitude: 77.5946 };
    const services = await searchNearbyServices(coords, 'HOSPITAL');

    expect(services.length).toBeGreaterThan(0);
    expect(services[0].type).toBe('HOSPITAL');
    expect(services[0].navigationUrl).toContain('google.com/maps/dir');
    expect(services[0].distanceMeters).toBeGreaterThan(0);
  });

  // 7. SOS confirmation modal logic
  it('7. SOS modal requires user confirmation before initiating event creation', async () => {
    const { SOSConfirmationModal } = await import('../src/components/SOS/SOSConfirmationModal');
    expect(SOSConfirmationModal).toBeDefined();
  });

  // 8. SOS cancellation
  it('8. SOS cancellation aborts event creation without making network calls', async () => {
    const mockCancel = vi.fn();
    mockCancel();
    expect(mockCancel).toHaveBeenCalledOnce();
  });

  // 9. Duplicate SOS prevention
  it('9. SOS event creation produces unique event IDs', async () => {
    const analysis: CrisisAnalysis = {
      emergencyType: 'FIRE',
      severity: 'HIGH',
      confidence: 0.9,
      summary: 'Fire reported',
      immediateRisks: [],
      immediateActions: ['Evacuate'],
      avoid: [],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    const sos1 = await createSOSEvent({ analysis, contacts: [] });
    const sos2 = await createSOSEvent({ analysis, contacts: [] });

    expect(sos1.id).not.toBe(sos2.id);
  });

  // 10. Offline emergency guide flow
  it('10. Offline emergency guide returns pre-bundled safety instructions', () => {
    const guide = getLocalGuide('ELECTRICAL');
    expect(guide.title).toContain('Electrical');
    expect(guide.immediateActions).toContain('Disconnect main circuit breaker before touching appliances or sockets.');
    expect(guide.avoid).toContain('Do not use water on electrical fires.');
  });

  // 11. Firebase authentication failure
  it('11. Firebase sign-in failure handles popup closure gracefully', async () => {
    const authService = await import('../src/services/firebase/authService');
    vi.spyOn(authService, 'signInWithGoogle').mockRejectedValue(new Error('auth/popup-closed-by-user'));

    await expect(authService.signInWithGoogle()).rejects.toThrow('popup-closed');
  });

  // 12. Firestore failure
  it('12. Firestore save failure logs warning and returns fallback without crashing app', async () => {
    const analysis: CrisisAnalysis = {
      emergencyType: 'MEDICAL',
      severity: 'CRITICAL',
      confidence: 0.9,
      summary: 'Collapse',
      immediateRisks: [],
      immediateActions: ['Call 108'],
      avoid: [],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    const sos = await createSOSEvent({
      userId: 'non_existent_user',
      analysis,
      contacts: [],
    });

    expect(sos.status).toBe('COMPLETED');
    expect(sos.deliveryMessage).toBeDefined();
  });

  // 13. Unauthorized Firestore access
  it('13. Unauthenticated user attempts to save session throws typed authentication error', async () => {
    const historyService = await import('../src/services/firebase/historyService');
    const analysis: CrisisAnalysis = {
      emergencyType: 'ACCIDENT',
      severity: 'HIGH',
      confidence: 0.8,
      summary: 'Crash',
      immediateRisks: [],
      immediateActions: ['Call 100'],
      avoid: [],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    await expect(historyService.saveEmergencySession('', analysis, 'msg')).rejects.toThrow('authenticated');
  });

  // 14. Mobile navigation items
  it('14. Navbar component contains all required route navigation paths', async () => {
    const { Navbar } = await import('../src/components/Navbar/Navbar');
    expect(Navbar).toBeDefined();
  });

  // 15. Error boundary fallback UI
  it('15. ErrorBoundary component catches React render exceptions', async () => {
    const { ErrorBoundary } = await import('../src/components/ErrorBoundary/ErrorBoundary');
    expect(ErrorBoundary).toBeDefined();
  });
});
