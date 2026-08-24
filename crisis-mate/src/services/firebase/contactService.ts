/**
 * CrisisMate — Firestore Trusted Contacts Service
 *
 * Implements CRUD operations for users/{userId}/trustedContacts/{contactId}.
 */

import {
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import type { Contact } from '../../types/contact';
import { isValidPhoneNumber } from '../../utils/validation';
import { getContactsCollectionRef } from './firestoreService';
import { db } from './firebaseConfig';

export interface ContactValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateContactInput(name: string, phone: string): ContactValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Contact name is required.' };
  }
  if (!phone || !isValidPhoneNumber(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number (e.g. +919876543210).' };
  }
  return { isValid: true };
}

/**
 * Fetch all trusted contacts for a user.
 */
export async function getContacts(userId: string): Promise<Contact[]> {
  if (!userId) return [];
  try {
    const contactsRef = getContactsCollectionRef(userId);
    const q = query(contactsRef, orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Contact[];
  } catch (error) {
    console.error('[CrisisMate Contacts] Error fetching contacts:', error);
    throw new Error('Failed to load trusted contacts from Firestore.');
  }
}

/**
 * Add a new trusted contact for a user.
 */
export async function addContact(
  userId: string,
  contactData: { name: string; phone: string; relationship: string; isPrimary?: boolean }
): Promise<Contact> {
  const validation = validateContactInput(contactData.name, contactData.phone);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const contactsRef = getContactsCollectionRef(userId);
    const newContact: Omit<Contact, 'id'> = {
      name: contactData.name.trim(),
      phone: contactData.phone.trim(),
      relationship: contactData.relationship.trim() || 'Emergency Contact',
      isPrimary: Boolean(contactData.isPrimary),
      addedAt: new Date().toISOString(),
      userId,
    };

    const docRef = await addDoc(contactsRef, newContact);
    return { id: docRef.id, ...newContact };
  } catch (error) {
    console.error('[CrisisMate Contacts] Error adding contact:', error);
    throw new Error('Failed to save contact to Firestore.');
  }
}

/**
 * Update an existing trusted contact.
 */
export async function updateContact(
  userId: string,
  contactId: string,
  updates: Partial<Omit<Contact, 'id' | 'addedAt'>>
): Promise<void> {
  if (updates.name !== undefined || updates.phone !== undefined) {
    const nameToTest = updates.name ?? 'Valid Name';
    const phoneToTest = updates.phone ?? '+919876543210';
    const validation = validateContactInput(nameToTest, phoneToTest);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
  }

  try {
    const contactRef = doc(db, 'users', userId, 'trustedContacts', contactId);
    await updateDoc(contactRef, updates);
  } catch (error) {
    console.error('[CrisisMate Contacts] Error updating contact:', error);
    throw new Error('Failed to update contact in Firestore.');
  }
}

/**
 * Delete a trusted contact.
 */
export async function deleteContact(userId: string, contactId: string): Promise<void> {
  try {
    const contactRef = doc(db, 'users', userId, 'trustedContacts', contactId);
    await deleteDoc(contactRef);
  } catch (error) {
    console.error('[CrisisMate Contacts] Error deleting contact:', error);
    throw new Error('Failed to delete contact from Firestore.');
  }
}
