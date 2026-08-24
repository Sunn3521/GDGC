/**
 * Represents a trusted emergency contact stored under `users/{userId}/trustedContacts/{contactId}`
 */
export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Input format for creating a new trusted contact
 */
export type CreateTrustedContactInput = Omit<TrustedContact, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input format for updating an existing trusted contact
 */
export type UpdateTrustedContactInput = Partial<CreateTrustedContactInput>;
