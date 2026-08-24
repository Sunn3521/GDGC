# CrisisMate — Complete Technical Architecture Document

## 1. System High-Level Overview

CrisisMate is an AI-powered emergency decision support engine designed for extreme reliability during high-stress crises.

```text
                        CRISISMATE ARCHITECTURE
                                   │
                                   ▼
                       React Frontend (Member 2)
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
    Gemini AI Engine       Firebase Backend           Maps Service
       (Member 1)             (Member 3)               (Member 4)
            │                      │                      │
   ┌────────┴────────┐      ┌──────┼──────┐               │
   ▼                 ▼      ▼      ▼      ▼               │
Gemini API       Validator Auth Firestore Rules           │
   │                 │      │      │                      │
   └────────┬────────┘      │      ├── users/{uid}        │
            ▼               │      ├── trustedContacts    │
     CrisisAnalysis         │      └── emergencySessions  │
            │               │                             │
            └───────────────┼─────────────────────────────┘
                            ▼
                    Complete Application
```

---

## 2. Member 3 — Firebase Database Model & Schema

Firestore database is structured using strict user isolation paths:

```text
users/
└── {userId}/
    ├── (fields: uid, displayName, email, photoURL, createdAt, updatedAt)
    │
    ├── trustedContacts/
    │   └── {contactId}
    │       ├── id: string
    │       ├── name: string
    │       ├── phone: string
    │       ├── relationship: string
    │       ├── isPrimary: boolean
    │       └── createdAt / updatedAt: string (ISO)
    │
    ├── emergencySessions/
    │   └── {sessionId}
    │       ├── id: string
    │       ├── userId: string
    │       ├── emergencyType: FIRE | MEDICAL | ACCIDENT | FLOOD | EARTHQUAKE | CYCLONE | ELECTRICAL | PERSONAL_SAFETY | OTHER
    │       ├── severity: LOW | MEDIUM | HIGH | CRITICAL
    │       ├── summary: string
    │       ├── userPrompt: string
    │       ├── immediateActions: string[]
    │       ├── avoidInstructions: string[]
    │       ├── escalationRequired: boolean
    │       ├── needsLocation: boolean
    │       ├── professionalHelpRecommended: boolean
    │       ├── location: { latitude, longitude, address } | null
    │       └── timestamp: string (ISO)
    │
    └── sosEvents/
        └── {sosId}
```

---

## 3. Security & Data Protection Matrix
- **API Keys**: Server secret `GEMINI_API_KEY` is never exposed in client JS bundles.
- **Firestore Access**: All user data is guarded by `firestore.rules`. Every document path under `users/{userId}/...` strictly enforces `request.auth != null && request.auth.uid == userId`.
- **Truthful Communication**: The UI never claims SMS or phone calls were dispatched unless confirmed by a live server gateway.
