import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCurrentLocation, setMockLocation } from '../src/services/location/locationService';
import { searchNearbyServices, setMockNearbyServices, calculateDistanceMeters } from '../src/services/location/mapsService';
import { createSOSEvent } from '../src/services/sos/sosService';
import { getLocalGuide } from '../src/data/emergencyGuides';
import { isOnline } from '../src/utils/network';
import type { CrisisAnalysis } from '../src/types/crisis';
import type { Contact } from '../src/types/contact';

describe('CrisisMate Phase 5 Integration Suite (Location, Maps, SOS, Offline)', () => {
  afterEach(() => {
    setMockLocation(null);
    setMockNearbyServices(null);
    vi.restoreAllMocks();
  });

  // 1. Location success
  it('1. Geolocation retrieval succeeds with valid coordinates', async () => {
    setMockLocation({ latitude: 12.9716, longitude: 77.5946, accuracy: 10 });

    const result = await getCurrentLocation();
    expect(result.success).toBe(true);
    expect(result.coords?.latitude).toBe(12.9716);
    expect(result.coords?.longitude).toBe(77.5946);
  });

  // 2. Location permission denied
  it('2. Geolocation permission denied handles error gracefully without crashing', async () => {
    setMockLocation(null, 'User denied geolocation permission.');

    const result = await getCurrentLocation();
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('PERMISSION_DENIED');
  });

  // 3. Location timeout
  it('3. Geolocation timeout handles failure gracefully', async () => {
    setMockLocation(null, 'Location request timed out.');

    const result = await getCurrentLocation();
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('timed out');
  });

  // 4. Nearby service success
  it('4. searchNearbyServices returns nearby hospitals, police stations, and fire stations', async () => {
    const coords = { latitude: 12.9716, longitude: 77.5946 };
    const services = await searchNearbyServices(coords, 'ALL');

    expect(services.length).toBeGreaterThan(0);
    expect(services.some((s) => s.type === 'HOSPITAL')).toBe(true);
    expect(services.some((s) => s.type === 'POLICE')).toBe(true);
    expect(services.some((s) => s.type === 'FIRE_STATION')).toBe(true);
    expect(services[0].navigationUrl).toContain('google.com/maps/dir');
  });

  // 5. Nearby service filter
  it('5. searchNearbyServices filters specifically for Hospitals', async () => {
    const coords = { latitude: 12.9716, longitude: 77.5946 };
    const hospitals = await searchNearbyServices(coords, 'HOSPITAL');

    expect(hospitals.every((s) => s.type === 'HOSPITAL')).toBe(true);
  });

  // 6. Offline guide loading
  it('6. Local offline emergency guide loads instantly for FIRE without network', () => {
    const fireGuide = getLocalGuide('FIRE');
    expect(fireGuide.title).toContain('Fire');
    expect(fireGuide.immediateActions.length).toBeGreaterThan(0);
    expect(fireGuide.avoid.length).toBeGreaterThan(0);
  });

  // 7. Offline network detection
  it('7. Network status returns boolean state', () => {
    const online = isOnline();
    expect(typeof online).toBe('boolean');
  });

  // 8. SOS event creation & truthful message
  it('8. SOS event creation returns truthful status without claiming fake SMS sent', async () => {
    const mockAnalysis: CrisisAnalysis = {
      emergencyType: 'FIRE',
      severity: 'CRITICAL',
      confidence: 0.95,
      summary: 'Hostel fire',
      immediateRisks: ['Smoke'],
      immediateActions: ['Evacuate'],
      avoid: [],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    const mockContacts: Contact[] = [
      {
        id: 'c1',
        name: 'Jane Doe',
        phone: '+919876543210',
        relationship: 'Sister',
        isPrimary: true,
        addedAt: new Date().toISOString(),
      },
    ];

    const sos = await createSOSEvent({
      userId: 'user_123',
      analysis: mockAnalysis,
      location: { latitude: 12.9716, longitude: 77.5946 },
      contacts: mockContacts,
    });

    expect(sos.status).toBe('COMPLETED');
    expect(sos.deliveryMessage).not.toContain('SMS sent');
    expect(sos.deliveryMessage).toContain('SMS dispatch pending server');
  });

  // 9. Missing trusted contacts in SOS
  it('9. SOS event with no trusted contacts clearly indicates missing contacts in delivery message', async () => {
    const mockAnalysis: CrisisAnalysis = {
      emergencyType: 'MEDICAL',
      severity: 'CRITICAL',
      confidence: 0.9,
      summary: 'Medical emergency',
      immediateRisks: [],
      immediateActions: ['Call 108'],
      avoid: [],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    const sos = await createSOSEvent({
      userId: 'user_123',
      analysis: mockAnalysis,
      contacts: [],
    });

    expect(sos.deliveryMessage).toContain('No trusted contacts are configured');
  });

  // 10. Distance calculation accuracy
  it('10. Haversine distance formula calculates distance between 2 coordinates', () => {
    // Distance between Bangalore Center (12.9716, 77.5946) and +0.0075 lat offset is ~833m
    const distance = calculateDistanceMeters(12.9716, 77.5946, 12.9791, 77.5996);
    expect(distance).toBeGreaterThan(500);
    expect(distance).toBeLessThan(2000);
  });
});
