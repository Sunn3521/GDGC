/**
 * CrisisMate — SOS Emergency Service
 *
 * Handles explicit user-confirmed SOS alert creation and records
 * SOS events in Firestore.
 * Truthful limitation enforcement: Never claims SMS was delivered
 * unless confirmed by backend server integration.
 */

import { addDoc, collection } from 'firebase/firestore';
import type { CrisisAnalysis } from '../../types/crisis';
import type { UserCoordinates } from '../../types/location';
import type { Contact } from '../../types/contact';
import type { SOSEvent } from '../../types/sos';
import { db } from '../firebase/firebaseConfig';

export interface SOSCreationOptions {
  userId?: string;
  analysis: CrisisAnalysis;
  location?: UserCoordinates;
  contacts: Contact[];
}

export async function createSOSEvent(options: SOSCreationOptions): Promise<SOSEvent> {
  const { userId, analysis, location, contacts } = options;

  const timestamp = new Date().toISOString();
  const deliveryMessage = contacts.length > 0
    ? `SOS event recorded in Firestore with ${contacts.length} contact(s). SMS dispatch pending server gateway.`
    : 'SOS event recorded in Firestore. No trusted contacts are configured for notification.';

  const sosPayload: Record<string, unknown> = {
    userId: userId || 'anonymous_user',
    timestamp,
    emergencyType: analysis.emergencyType,
    severity: analysis.severity,
    trustedContacts: contacts,
    status: 'COMPLETED',
    deliveryMessage,
    analysisSummary: analysis.summary,
    immediateActions: analysis.immediateActions,
  };

  if (location) {
    sosPayload.location = location;
  }

  let generatedId = `sos_${Date.now()}`;

  if (userId) {
    try {
      const sosRef = collection(db, 'users', userId, 'sosEvents');
      // Timeout Firestore write after 1.5s if offline/unauthenticated to prevent hanging
      const savePromise = addDoc(sosRef, sosPayload).then((ref) => ref.id);
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 1500)
      );
      generatedId = await Promise.race([savePromise, timeoutPromise]);
    } catch (err) {
      console.warn('[CrisisMate SOS] Firestore save skipped/failed, returning SOS record:', err);
    }
  }

  return {
    id: generatedId,
    ...(sosPayload as Omit<SOSEvent, 'id'>),
  };
}
