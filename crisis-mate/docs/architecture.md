# CrisisMate — Complete Technical Architecture Document

## 1. System High-Level Overview
CrisisMate is an AI-powered emergency decision support engine designed for extreme reliability during high-stress crises.

```text
                     ┌────────────────────────┐
                     │   React 18 Frontend    │
                     │  (Vite + React Router) │
                     └───────────┬────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
        ┌────────────────┐┌─────────────┐┌──────────────┐
        │ Backend Proxy /││  Firebase   ││ Geolocation  │
        │ Cloud Function ││ Auth & Store││ & Google Maps│
        └────────┬───────┘└─────────────┘└──────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Google Gemini │
        │   1.5 Flash    │
        └────────────────┘
```

---

## 2. Component Pipeline & Data Flow

1. **User Crisis Description**: Plain text input describing the situation.
2. **Pre-flight Input Validation**: Validates message length and sanitizes special characters.
3. **Backend Proxy Execution**: Requests are processed through secure backend proxy endpoint (`/api/analyze-crisis` or Firebase Function), keeping `GEMINI_API_KEY` isolated from client browser bundles.
4. **Structured Decision Engine**: Gemini 1.5 Flash outputs strict JSON enforcing `CrisisAnalysis` schema.
5. **Response Validation & Safety Overrides**: `responseValidator.ts` validates types and forces `escalationRequired = true` for `CRITICAL` severity emergencies.
6. **On-Demand Location & Help Discovery**: Location is requested on-demand only. Haversine distance algorithm calculates exact proximity and generates Google Maps navigation links.
7. **Explicit SOS Activation**: Alerts require explicit user modal confirmation before recording `SOSEvent` in Firestore (`users/{userId}/sosEvents/{sosId}`).
8. **Offline Guides**: Pre-bundled local guides (`src/data/emergencyGuides.ts`) and PWA Service Worker (`sw.js`) guarantee 100% offline availability.

---

## 3. Security & Data Protection Matrix
- **API Keys**: Server secret `GEMINI_API_KEY` is never exposed in client JS bundles.
- **Firestore Access**: Strict rules in `firestore.rules` isolate all user documents to `request.auth.uid == userId`.
- **Truthful Communication**: The UI never claims SMS or phone calls were dispatched unless confirmed by a live server gateway.
