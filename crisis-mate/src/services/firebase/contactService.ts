<<<<<<< HEAD
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import { USERS_COLLECTION } from './userService';
import {
  TrustedContact,
  CreateTrustedContactInput,
  UpdateTrustedContactInput
} from '../../types/contact';

/**
 * Subcollection name for trusted contacts
 */
export const CONTACTS_SUBCOLLECTION = 'trustedContacts';

/**
 * Helper to generate subcollection path `users/{userId}/trustedContacts`
 */
const getContactsCollectionRef = (userId: string) => {
  if (!userId) {
    throw new Error('[ContactService] UserId is required.');
  }
  return collection(db, USERS_COLLECTION, userId, CONTACTS_SUBCOLLECTION);
};

/**
 * Helper to generate document reference `users/{userId}/trustedContacts/{contactId}`
 */
const getContactDocRef = (userId: string, contactId: string) => {
  if (!userId || !contactId) {
    throw new Error('[ContactService] UserId and ContactId are required.');
  }
  return doc(db, USERS_COLLECTION, userId, CONTACTS_SUBCOLLECTION, contactId);
};

/**
 * Adds a new trusted contact for a user.
 */
export const addTrustedContact = async (
  userId: string,
  contactData: CreateTrustedContactInput
): Promise<TrustedContact> => {
  if (!userId) {
    throw new Error('[ContactService] Cannot add contact: UserId is required.');
  }
  if (!contactData.name || !contactData.phone) {
    throw new Error('[ContactService] Name and phone number are required for trusted contact.');
  }

  const contactsRef = getContactsCollectionRef(userId);
  const newContactRef = doc(contactsRef); // Generate unique client ID
  const now = new Date().toISOString();

  const newContact: TrustedContact = {
    id: newContactRef.id,
    name: contactData.name.trim(),
    phone: contactData.phone.trim(),
    relationship: contactData.relationship ? contactData.relationship.trim() : 'Other',
    isPrimary: !!contactData.isPrimary,
    notes: contactData.notes || '',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(newContactRef, newContact);
    return newContact;
  } catch (error: any) {
    console.error('[ContactService] Failed to add trusted contact:', error?.message || error);
    throw new Error(`Failed to add contact: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Fetches all trusted contacts for a given user ordered by creation date.
 */
export const getTrustedContacts = async (userId: string): Promise<TrustedContact[]> => {
  if (!userId) {
    throw new Error('[ContactService] Cannot fetch contacts: UserId is required.');
=======
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
>>>>>>> upstream/main
  }

  try {
    const contactsRef = getContactsCollectionRef(userId);
<<<<<<< HEAD
    const q = query(contactsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const contacts: TrustedContact[] = [];
    snapshot.forEach((docSnap) => {
      contacts.push(docSnap.data() as TrustedContact);
    });

    return contacts;
  } catch (error: any) {
    console.error('[ContactService] Failed to fetch trusted contacts:', error?.message || error);
    throw new Error(`Failed to retrieve contacts: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Updates an existing trusted contact document.
 */
export const updateTrustedContact = async (
  userId: string,
  contactId: string,
  contactData: UpdateTrustedContactInput
): Promise<TrustedContact> => {
  const contactRef = getContactDocRef(userId, contactId);
  const now = new Date().toISOString();

  try {
    const payload = {
      ...contactData,
      updatedAt: now,
    };

    await updateDoc(contactRef, payload as Record<string, any>);
    const updatedSnap = await getDoc(contactRef);

    if (!updatedSnap.exists()) {
      throw new Error(`Contact with ID ${contactId} not found.`);
    }

    return updatedSnap.data() as TrustedContact;
  } catch (error: any) {
    console.error('[ContactService] Failed to update trusted contact:', error?.message || error);
    throw new Error(`Failed to update contact: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Deletes a trusted contact document.
 */
export const deleteTrustedContact = async (
  userId: string,
  contactId: string
): Promise<void> => {
  const contactRef = getContactDocRef(userId, contactId);

  try {
    await deleteDoc(contactRef);
  } catch (error: any) {
    console.error('[ContactService] Failed to delete trusted contact:', error?.message || error);
    throw new Error(`Failed to delete contact: ${error?.message || 'Unknown error'}`);
  }
};

export default {
  addTrustedContact,
  getTrustedContacts,
  updateTrustedContact,
  deleteTrustedContact,
};
=======
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
>>>>>>> upstream/main
