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

## 2. Location & Maps Service API

### `searchNearbyServices(coords: UserCoordinates, filter: EmergencyServiceType): Promise<NearbyService[]>`
- **Request**: User GPS coordinates `{ latitude, longitude }`.
- **Response**: Array of nearby emergency services with calculated Haversine distance and Google Maps navigation URLs (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).

---

## 3. SOS Emergency Service API

### `createSOSEvent(options: SOSCreationOptions): Promise<SOSEvent>`
- **Request**: `{ userId, analysis, location, contacts }`
- **Response**:
```typescript
interface SOSEvent {
  id: string;
  userId?: string;
  timestamp: string;
  emergencyType: EmergencyType;
  severity: SeverityLevel;
  location?: UserCoordinates;
  trustedContacts: Contact[];
  status: 'COMPLETED';
  deliveryMessage: string;
  analysisSummary: string;
  immediateActions: string[];
}
```
*Delivery Message Truthfulness*: Returns *"SOS event recorded in Firestore. Live SMS dispatch is not configured."*
