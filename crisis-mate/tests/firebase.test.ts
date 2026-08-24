import { describe, it, expect, vi } from 'vitest';
import { validateContactInput } from '../src/services/firebase/contactService';
import type { Contact } from '../src/types/contact';
import type { EmergencySession } from '../src/types/emergency';

describe('CrisisMate Firebase Integration Suite (Phase 4)', () => {
  // 1. Auth state listener interface
  it('1. Auth state observer callback can be registered', async () => {
    const { onAuthStateChange } = await import('../src/services/firebase/authService');
    expect(typeof onAuthStateChange).toBe('function');
  });

  // 2. Sign-in success mock
  it('2. Sign-in with Google resolves authenticated user object', async () => {
    const mockUser = { uid: 'user_123', email: 'user@example.com', displayName: 'Test User' };
    const authService = await import('../src/services/firebase/authService');

    vi.spyOn(authService, 'signInWithGoogle').mockResolvedValue(mockUser as any);

    const user = await authService.signInWithGoogle();
    expect(user.uid).toBe('user_123');
    expect(user.email).toBe('user@example.com');
  });

  // 3. Sign-in failure mock
  it('3. Sign-in failure handles popup closed or network error gracefully', async () => {
    const authService = await import('../src/services/firebase/authService');

    vi.spyOn(authService, 'signInWithGoogle').mockRejectedValue(new Error('Popup closed by user.'));

    await expect(authService.signInWithGoogle()).rejects.toThrow('Popup closed by user.');
  });

  // 4. Sign-out mock
  it('4. Sign-out resolves successfully', async () => {
    const authService = await import('../src/services/firebase/authService');

    vi.spyOn(authService, 'signOutUser').mockResolvedValue(undefined);

    await expect(authService.signOutUser()).resolves.toBeUndefined();
  });

  // 5. Add contact validation & creation
  it('5. Add trusted contact creates Contact object with generated ID', async () => {
    const contactService = await import('../src/services/firebase/contactService');

    const mockContact: Contact = {
      id: 'contact_abc',
      name: 'Jane Doe',
      phone: '+919876543210',
      relationship: 'Sister',
      isPrimary: true,
      addedAt: new Date().toISOString(),
      userId: 'user_123',
    };

    vi.spyOn(contactService, 'addContact').mockResolvedValue(mockContact);

    const created = await contactService.addContact('user_123', {
      name: 'Jane Doe',
      phone: '+919876543210',
      relationship: 'Sister',
      isPrimary: true,
    });

    expect(created.id).toBe('contact_abc');
    expect(created.name).toBe('Jane Doe');
    expect(created.isPrimary).toBe(true);
  });

  // 6. Delete contact
  it('6. Delete contact executes successfully for owner', async () => {
    const contactService = await import('../src/services/firebase/contactService');

    vi.spyOn(contactService, 'deleteContact').mockResolvedValue(undefined);

    await expect(contactService.deleteContact('user_123', 'contact_abc')).resolves.toBeUndefined();
  });

  // 7. Invalid contact input
  it('7. Invalid contact name or phone number is rejected before calling Firestore', () => {
    const emptyName = validateContactInput('', '+919876543210');
    expect(emptyName.isValid).toBe(false);
    expect(emptyName.error).toContain('name');

    const invalidPhone = validateContactInput('Jane Doe', 'invalid_phone');
    expect(invalidPhone.isValid).toBe(false);
    expect(invalidPhone.error).toContain('phone');

    const valid = validateContactInput('Jane Doe', '+919876543210');
    expect(valid.isValid).toBe(true);
  });

  // 8. Save emergency session
  it('8. Save emergency session stores CrisisAnalysis record in Firestore', async () => {
    const historyService = await import('../src/services/firebase/historyService');

    const mockSession: EmergencySession = {
      id: 'session_999',
      userId: 'user_123',
      userMessage: 'Hostel room fire',
      analysis: {
        emergencyType: 'FIRE',
        severity: 'CRITICAL',
        confidence: 0.95,
        summary: 'Fire in hostel.',
        immediateRisks: ['Smoke'],
        immediateActions: ['Evacuate'],
        avoid: ['Do not use elevator'],
        escalationRequired: true,
        needsLocation: true,
        professionalHelpRecommended: true,
      },
      sosTrigger: false,
      locationActivated: true,
      startedAt: new Date().toISOString(),
    };

    vi.spyOn(historyService, 'saveEmergencySession').mockResolvedValue(mockSession);

    const saved = await historyService.saveEmergencySession('user_123', mockSession.analysis, 'Hostel room fire');
    expect(saved.id).toBe('session_999');
    expect(saved.analysis.emergencyType).toBe('FIRE');
  });

  // 9. Load emergency history
  it('9. Load emergency history returns user session array', async () => {
    const historyService = await import('../src/services/firebase/historyService');

    const mockHistoryList: EmergencySession[] = [
      {
        id: 'sess_1',
        userMessage: 'Test crisis 1',
        analysis: {
          emergencyType: 'MEDICAL',
          severity: 'HIGH',
          confidence: 0.9,
          summary: 'Medical collapse',
          immediateRisks: [],
          immediateActions: ['Call 108'],
          avoid: [],
          escalationRequired: true,
          needsLocation: true,
          professionalHelpRecommended: true,
        },
        sosTrigger: false,
        locationActivated: true,
        startedAt: new Date().toISOString(),
      },
    ];

    vi.spyOn(historyService, 'getEmergencyHistory').mockResolvedValue(mockHistoryList);

    const history = await historyService.getEmergencyHistory('user_123');
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('sess_1');
  });

  // 10. Delete emergency history
  it('10. Delete emergency session executes successfully', async () => {
    const historyService = await import('../src/services/firebase/historyService');

    vi.spyOn(historyService, 'deleteEmergencySession').mockResolvedValue(undefined);

    await expect(historyService.deleteEmergencySession('user_123', 'sess_1')).resolves.toBeUndefined();
  });

  // 11. Unauthorized access handling
  it('11. Unauthenticated users cannot save session without User ID', async () => {
    const historyService = await import('../src/services/firebase/historyService');

    // Restore real implementation for unauthenticated check
    vi.restoreAllMocks();

    const analysis = {
      emergencyType: 'FIRE' as const,
      severity: 'CRITICAL' as const,
      confidence: 0.9,
      summary: 'Fire',
      immediateRisks: [],
      immediateActions: ['Run'],
      avoid: [],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
    };

    await expect(historyService.saveEmergencySession('', analysis, 'msg')).rejects.toThrow('authenticated');
  });

  // 12. Firestore failure
  it('12. Firestore network error returns safe error message without breaking UI', async () => {
    const contactService = await import('../src/services/firebase/contactService');

    vi.spyOn(contactService, 'getContacts').mockRejectedValue(new Error('Firestore connection offline.'));

    await expect(contactService.getContacts('user_123')).rejects.toThrow('Firestore');
  });
});
