import { describe, it, expect } from 'vitest';
import {
  EMERGENCY_TYPES,
  SEVERITY_LEVELS,
  type CrisisAnalysis,
  type CrisisInput,
  type AnalysisRequest,
  type AnalysisResponse,
} from '../src/types/crisis';
import {
  EMERGENCY_TYPE_METADATA,
  getEmergencyMetadata,
  getSeverityLabel,
  getSeverityColor,
} from '../src/data/emergencyTypes';
import type { RawGeminiResponse, ValidatedGeminiResponse, ValidationResult } from '../src/types/aiResponse';
import type { EmergencySession, EmergencyContact, EmergencyGuide, SOSEvent } from '../src/types/emergency';
import { INDIA_EMERGENCY_NUMBERS, UNIVERSAL_EMERGENCY, type Contact, type NearbyService } from '../src/types/contact';

describe('CrisisMate Foundation Type System & Data Contracts', () => {
  describe('Crisis Types', () => {
    it('defines all 9 EmergencyType categories', () => {
      expect(EMERGENCY_TYPES).toHaveLength(9);
      expect(EMERGENCY_TYPES).toContain('FIRE');
      expect(EMERGENCY_TYPES).toContain('MEDICAL');
      expect(EMERGENCY_TYPES).toContain('ACCIDENT');
      expect(EMERGENCY_TYPES).toContain('FLOOD');
      expect(EMERGENCY_TYPES).toContain('EARTHQUAKE');
      expect(EMERGENCY_TYPES).toContain('CYCLONE');
      expect(EMERGENCY_TYPES).toContain('ELECTRICAL');
      expect(EMERGENCY_TYPES).toContain('PERSONAL_SAFETY');
      expect(EMERGENCY_TYPES).toContain('OTHER');
    });

    it('defines all 4 SeverityLevel tiers', () => {
      expect(SEVERITY_LEVELS).toEqual(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
    });

    it('allows construction of valid CrisisAnalysis data structures', () => {
      const analysis: CrisisAnalysis = {
        emergencyType: 'FIRE',
        severity: 'CRITICAL',
        confidence: 0.95,
        summary: 'Building fire with smoke reported on the 3rd floor.',
        immediateRisks: ['Smoke inhalation', 'Rapid fire spread'],
        immediateActions: ['Evacuate via nearest stairs', 'Call emergency services'],
        avoid: ['Do not use elevators', 'Do not re-enter the building'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
        timestamp: new Date().toISOString(),
      };

      expect(analysis.emergencyType).toBe('FIRE');
      expect(analysis.severity).toBe('CRITICAL');
      expect(analysis.immediateActions).toHaveLength(2);
      expect(analysis.escalationRequired).toBe(true);
      expect(analysis.needsLocation).toBe(true);
    });

    it('allows construction of valid CrisisInput and AnalysisResponse', () => {
      const input: CrisisInput = {
        message: 'There is smoke in the hallway.',
        locationContext: 'Hostel Block B',
      };
      expect(input.message).toBeDefined();

      const response: AnalysisResponse = {
        success: true,
        data: {
          emergencyType: 'FIRE',
          severity: 'HIGH',
          confidence: 0.9,
          summary: 'Smoke detected in hallway.',
          immediateRisks: ['Smoke inhalation'],
          immediateActions: ['Evacuate immediately'],
          avoid: ['Do not stop for belongings'],
          escalationRequired: true,
          needsLocation: true,
          professionalHelpRecommended: true,
        },
        requestId: 'req-123',
        processingTimeMs: 450,
      };
      expect(response.success).toBe(true);
      expect(response.processingTimeMs).toBeGreaterThan(0);
    });
  });

  describe('Emergency Metadata Data Layer', () => {
    it('provides metadata for every supported emergency type', () => {
      for (const type of EMERGENCY_TYPES) {
        const meta = EMERGENCY_TYPE_METADATA[type];
        expect(meta).toBeDefined();
        expect(meta.type).toBe(type);
        expect(meta.label.length).toBeGreaterThan(0);
        expect(meta.emoji.length).toBeGreaterThan(0);
        expect(meta.description.length).toBeGreaterThan(0);
        expect(SEVERITY_LEVELS).toContain(meta.typicalSeverity);
      }
    });

    it('getEmergencyMetadata falls back gracefully for unknown types', () => {
      // @ts-expect-error test runtime fallback
      const meta = getEmergencyMetadata('UNKNOWN');
      expect(meta).toBeDefined();
      expect(meta.type).toBe('OTHER');
    });

    it('getSeverityLabel returns human readable labels', () => {
      expect(getSeverityLabel('LOW')).toBe('Low Risk');
      expect(getSeverityLabel('MEDIUM')).toBe('Moderate');
      expect(getSeverityLabel('HIGH')).toBe('High Alert');
      expect(getSeverityLabel('CRITICAL')).toBe('Critical — Act Now');
    });

    it('getSeverityColor returns Tailwind color classes', () => {
      expect(getSeverityColor('LOW')).toContain('green');
      expect(getSeverityColor('MEDIUM')).toContain('yellow');
      expect(getSeverityColor('HIGH')).toContain('orange');
      expect(getSeverityColor('CRITICAL')).toContain('red');
    });
  });

  describe('Emergency & Contact Contracts', () => {
    it('defines standard emergency numbers', () => {
      expect(UNIVERSAL_EMERGENCY).toBe('112');
      expect(INDIA_EMERGENCY_NUMBERS.police).toBe('100');
      expect(INDIA_EMERGENCY_NUMBERS.ambulance).toBe('108');
      expect(INDIA_EMERGENCY_NUMBERS.fire).toBe('101');
    });

    it('supports EmergencySession data structures for Firebase team', () => {
      const session: EmergencySession = {
        userMessage: 'Water entering ground floor',
        analysis: {
          emergencyType: 'FLOOD',
          severity: 'HIGH',
          confidence: 0.9,
          summary: 'Flood water entering premises.',
          immediateRisks: ['Electrical hazards', 'Drowning risk'],
          immediateActions: ['Move to higher ground', 'Turn off main electrical breaker'],
          avoid: ['Do not walk through moving water'],
          escalationRequired: true,
          needsLocation: true,
          professionalHelpRecommended: true,
        },
        sosTrigger: false,
        locationActivated: true,
        startedAt: new Date().toISOString(),
      };
      expect(session.analysis.emergencyType).toBe('FLOOD');
      expect(session.locationActivated).toBe(true);
    });

    it('supports Contact and NearbyService contracts for Maps and UI teams', () => {
      const contact: Contact = {
        id: 'c1',
        name: 'Jane Doe',
        phone: '+919876543210',
        relationship: 'Sister',
        isPrimary: true,
        addedAt: new Date().toISOString(),
      };
      expect(contact.isPrimary).toBe(true);

      const service: NearbyService = {
        name: 'City General Hospital',
        type: 'HOSPITAL',
        address: '123 Main St',
        distanceMeters: 850,
        placeId: 'place_abc123',
        latitude: 12.9716,
        longitude: 77.5946,
      };
      expect(service.type).toBe('HOSPITAL');
      expect(service.distanceMeters).toBe(850);
    });
  });
});
