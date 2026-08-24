# CrisisMate System Architecture

## Overview

**CrisisMate** is an AI-powered emergency decision engine. The system converts panic and confusion during emergency events into clear, prioritized, and actionable safety guidance.

The application architecture is divided cleanly across 4 core team member responsibilities:

1. **Member 1 (AI Decision Engine)**: Gemini API integration, prompt builder, emergency classification, response validation, safe fallbacks.
2. **Member 2 (Frontend UI/UX)**: React + TypeScript, Vite, Tailwind CSS interface, realtime status displays, emergency flows.
3. **Member 3 (Firebase Backend & Data Management)**: Firebase Authentication (Google Sign-In), Firestore User Profiles, Trusted Contacts, Emergency Session History, Security Rules.
4. **Member 4 (Maps & Offline Guidance)**: Google Maps integration, offline emergency guides, location services.

---

## High-Level Architecture Diagram

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

## Member 3 — Firebase Database Model & Schema

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
    └── emergencySessions/
        └── {sessionId}
            ├── id: string
            ├── userId: string
            ├── emergencyType: FIRE | MEDICAL | ACCIDENT | FLOOD | EARTHQUAKE | CYCLONE | ELECTRICAL | PERSONAL_SAFETY | OTHER
            ├── severity: LOW | MEDIUM | HIGH | CRITICAL
            ├── summary: string
            ├── userPrompt: string
            ├── immediateActions: string[]
            ├── avoidInstructions: string[]
            ├── escalationRequired: boolean
            ├── needsLocation: boolean
            ├── professionalHelpRecommended: boolean
            ├── location: { latitude, longitude, address } | null
            └── timestamp: string (ISO)
```

---

## Firestore Security Rules

All user data is guarded by `firestore.rules`:
- Every document path under `users/{userId}/...` strictly enforces `request.auth != null && request.auth.uid == userId`.
- Unauthenticated access and cross-user data queries are denied by default.
