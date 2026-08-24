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
  }

  try {
    const contactsRef = getContactsCollectionRef(userId);
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
