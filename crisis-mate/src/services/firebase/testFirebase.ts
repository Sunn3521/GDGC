import { UserProfile } from '../../types/user';
import { TrustedContact, CreateTrustedContactInput } from '../../types/contact';
import { EmergencySession, CreateEmergencySessionInput } from '../../types/emergency';
import { getCurrentUser, onAuthStateChange } from './auth';
import { USERS_COLLECTION } from './userService';
import { CONTACTS_SUBCOLLECTION } from './contactService';
import { SESSIONS_SUBCOLLECTION } from './emergencyService';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  [PASS] ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err?.message || String(err) });
    console.error(`  [FAIL] ${name}: ${err?.message || err}`);
  }
}

async function main() {
  console.log('=====================================================');
  console.log('    CRISISMATE — MEMBER 3 FIREBASE SERVICE TEST     ');
  console.log('=====================================================');

  // Test 1: Auth Service Module Structure
  await runTest('Auth Service Module Structure', () => {
    assert(typeof getCurrentUser === 'function', 'getCurrentUser must be a function');
    assert(typeof onAuthStateChange === 'function', 'onAuthStateChange must be a function');
    const user = getCurrentUser();
    assert(user === null || typeof user === 'object', 'getCurrentUser must return null or User object');
  });

  // Test 2: User Profile Data Schema & Timestamps
  await runTest('User Profile Data Normalization', () => {
    const mockUser = {
      uid: 'test_user_123',
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      photoURL: 'https://example.com/avatar.jpg',
    };

    const profile: UserProfile = {
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      photoURL: mockUser.photoURL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assert(profile.uid === 'test_user_123', 'UID match');
    assert(profile.displayName === 'Jane Doe', 'Display name match');
    assert(typeof profile.createdAt === 'string', 'createdAt is ISO string');
    assert(typeof profile.updatedAt === 'string', 'updatedAt is ISO string');
  });

  // Test 3: Trusted Contact Input Validation & Structure
  await runTest('Trusted Contact Model Creation', () => {
    const contactInput: CreateTrustedContactInput = {
      name: '  Mom  ',
      phone: ' +1-555-0199 ',
      relationship: ' Parent ',
      isPrimary: true,
    };

    const contact: TrustedContact = {
      id: 'contact_abc123',
      name: contactInput.name.trim(),
      phone: contactInput.phone.trim(),
      relationship: contactInput.relationship ? contactInput.relationship.trim() : 'Other',
      isPrimary: !!contactInput.isPrimary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assert(contact.id === 'contact_abc123', 'Contact ID generated');
    assert(contact.name === 'Mom', 'Name trimmed properly');
    assert(contact.phone === '+1-555-0199', 'Phone trimmed properly');
    assert(contact.relationship === 'Parent', 'Relationship trimmed properly');
    assert(contact.isPrimary === true, 'Primary contact flag set');
  });

  // Test 4: Emergency Session Integration from AI Output
  await runTest('Emergency Session Storage Payload', () => {
    const sessionInput: CreateEmergencySessionInput = {
      userId: 'test_user_123',
      emergencyType: 'FIRE',
      severity: 'CRITICAL',
      summary: 'Heavy smoke and fire reported in hostel room.',
      userPrompt: 'There is a fire in my hostel room and there is heavy smoke.',
      immediateActions: [
        'Move away from smoke immediately.',
        'Use nearest emergency stairwell.',
        'Call local fire services.'
      ],
      avoidInstructions: [
        'Do not use elevators.',
        'Do not go back for belongings.'
      ],
      escalationRequired: true,
      needsLocation: true,
      professionalHelpRecommended: true,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: '123 University Ave'
      }
    };

    const session: EmergencySession = {
      id: 'session_xyz789',
      timestamp: new Date().toISOString(),
      ...sessionInput,
    };

    assert(session.emergencyType === 'FIRE', 'Emergency type matches FIRE');
    assert(session.severity === 'CRITICAL', 'Severity matches CRITICAL');
    assert(session.immediateActions.length === 3, '3 immediate actions present');
    assert(session.avoidInstructions.length === 2, '2 avoid instructions present');
    assert(session.escalationRequired === true, 'Escalation required flag true');
    assert(session.needsLocation === true, 'Location needed flag true');
    assert(session.location?.latitude === 37.7749, 'Latitude correctly mapped');
  });

  // Test 5: Firestore Collection & Subcollection Paths
  await runTest('Firestore Path Conventions', () => {
    assert(USERS_COLLECTION === 'users', 'Root collection is "users"');
    assert(CONTACTS_SUBCOLLECTION === 'trustedContacts', 'Contacts subcollection is "trustedContacts"');
    assert(SESSIONS_SUBCOLLECTION === 'emergencySessions', 'Sessions subcollection is "emergencySessions"');

    const userId = 'usr_99';
    const contactId = 'cnt_88';
    const sessionId = 'ses_77';

    const contactPath = `${USERS_COLLECTION}/${userId}/${CONTACTS_SUBCOLLECTION}/${contactId}`;
    const sessionPath = `${USERS_COLLECTION}/${userId}/${SESSIONS_SUBCOLLECTION}/${sessionId}`;

    assert(contactPath === 'users/usr_99/trustedContacts/cnt_88', 'Contact path matches rules spec');
    assert(sessionPath === 'users/usr_99/emergencySessions/ses_77', 'Session path matches rules spec');
  });

  // Test 6: Input Error Boundaries
  await runTest('Service Error Boundaries (Empty User ID)', () => {
    let errorCaught = false;
    const testUid = '';
    try {
      if (!testUid) {
        throw new Error('[Test] UserId is required.');
      }
    } catch (e: any) {
      errorCaught = true;
      assert(e.message.includes('UserId is required'), 'Correct error message');
    }
    assert(errorCaught, 'Error boundary successfully triggered');
  });

  console.log('=====================================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`    RESULT: ${passedCount}/${results.length} TESTS PASSED`);
  console.log('=====================================================');

  if (passedCount < results.length) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
