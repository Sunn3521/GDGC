# CrisisMate — API Specification & Interface Contracts

## 1. AI Decision Engine API Interface

### `analyzeCrisis(message: string): Promise<CrisisAnalysis>`
Main entry point for emergency analysis.

- **Request**: Plain text description of crisis.
- **Response**:
```typescript
interface CrisisAnalysis {
  emergencyType: EmergencyType; // 'FIRE' | 'MEDICAL' | 'ACCIDENT' | 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'ELECTRICAL' | 'PERSONAL_SAFETY' | 'OTHER'
  severity: SeverityLevel;       // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  confidence: number;            // 0.0 - 1.0
  summary: string;
  immediateRisks: string[];
  immediateActions: string[];
  avoid: string[];
  escalationRequired: boolean;
  needsLocation: boolean;
  professionalHelpRecommended: boolean;
  isFallback?: boolean;
}
```

---

## 2. Firebase Backend Service API (`@/services/firebase`)

### Authentication Service (`@/services/firebase/auth`)
- `signInWithGoogle()`: Opens Google Sign-In popup and syncs/creates user profile in Firestore `users/{uid}`.
- `signOutUser()`: Signs out currently logged in user.
- `getCurrentUser()`: Synchronously returns current Auth user object or `null`.
- `onAuthStateChange(callback)`: Registers a listener for authentication state changes.

### User Profile Service (`@/services/firebase/userService`)
- `getUserProfile(uid: string)`: Retrieves profile document from Firestore.
- `createOrUpdateUserProfile(userData)`: Creates or merges user profile properties in `users/{uid}`.

### Trusted Contact Service (`@/services/firebase/contactService`)
- `addTrustedContact(userId: string, contactData)`: Adds trusted contact under `users/{userId}/trustedContacts/{contactId}`.
- `getTrustedContacts(userId: string)`: Fetches trusted contacts for a user.
- `updateTrustedContact(userId: string, contactId: string, updateData)`: Updates contact.
- `deleteTrustedContact(userId: string, contactId: string)`: Deletes contact document.

### Emergency History Service (`@/services/firebase/emergencyService`)
- `saveEmergencySession(userId: string, sessionData)`: Saves emergency decision engine analysis result to Firestore.
- `getEmergencyHistory(userId: string)`: Retrieves historical emergency sessions for user.
- `getEmergencySession(userId: string, sessionId: string)`: Retrieves single session.

---

## 3. Location & Maps Service API

### `searchNearbyServices(coords: UserCoordinates, filter: EmergencyServiceType): Promise<NearbyService[]>`
- **Request**: User GPS coordinates `{ latitude, longitude }`.
- **Response**: Array of nearby emergency services with calculated Haversine distance and Google Maps navigation URLs (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).

---

## 4. SOS Emergency Service API

### `createSOSEvent(options: SOSCreationOptions): Promise<SOSEvent>`
- **Request**: `{ userId, analysis, location, contacts }`
- **Response**: SOSEvent object recording SOS state in Firestore.
