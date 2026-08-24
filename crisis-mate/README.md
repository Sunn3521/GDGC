# CrisisMate — AI Crisis Decision Engine

> **CrisisMate converts panic and confusion during an emergency into clear, prioritized, actionable steps.**

[![Build & Tests](https://img.shields.io/badge/tests-68%20passing-brightgreen.svg)]()
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Vite-blue.svg)]()
[![AI Engine](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-orange.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Firebase%20%7C%20Firestore-yellow.svg)]()

---

## 1. Problem Statement
During an emergency (fire, medical collapse, road accident, flash flood, electrical spark), panic causes dangerous delays. Individuals often don't know what actions to prioritize first, whom to call, or what critical mistakes to avoid.

---

## 2. Solution Overview
CrisisMate uses **Google Gemini 1.5 Flash** to analyze natural-language emergency descriptions and instantly output:
1. **Emergency Category & Severity Level** (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
2. **Prioritized Action Steps** (Numbered 1, 2, 3...)
3. **Things to Avoid** (❌ Red warning items)
4. **Direct Emergency Hotlines** (`112` / `108` / `100` / `101`)
5. **Nearby Emergency Services & Navigation** (Hospitals, Police, Fire Stations via Google Maps)
6. **Firestore Session History & SOS Recording**
7. **Zero-Dependency Offline Emergency Guides**

---

## 3. Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS / Custom CSS variables, React Router.
- **AI Decision Engine**: Google Gemini 1.5 Flash (`@google/generative-ai` SDK).
- **Backend & Auth**: Firebase Authentication (Google Sign-In), Cloud Firestore (`firebase/firestore`).
- **Location & Maps**: Geolocation API, Haversine Distance computation, Google Maps navigation links.
- **Testing**: Vitest test runner (68 unit & integration tests).

---

## 4. Complete Application Pipeline

```text
User Emergency Description
           ↓
Input Validation & Pre-flight Sanity Check
           ↓
Gemini Prompt Builder (System instructions + schema rules)
           ↓
Gemini 1.5 Flash API Call (15s timeout, max 2 retries)
           ↓
JSON Extractor & Response Validator (Schema & type checking)
           ↓
Normalizer & Safety Overrides (CRITICAL forces escalationRequired=true)
           ↓
CrisisAnalysis Output UI (Priority actions 1, 2, 3... & Avoid items ❌)
           ↓
On-Demand Location & Nearby Emergency Help Discovery (Google Maps)
           ↓
Explicit SOS Alert Confirmation & Firestore Record
           ↓ (when offline)
Local Bundled Emergency Guides (0 network dependencies)
```

---

## 5. Getting Started

### Prerequisites
- Node.js v18+ & npm

### Installation
```bash
git clone https://github.com/shashiraju812/GDGC.git
cd GDGC/crisis-mate
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Running Tests
```bash
npm run test
```
All **68 unit & integration tests** run 100% offline using Vitest mocks.

---

## 7. Production Build
```bash
npm run build
```
Generates production build in `dist/`.

---

## 8. Security & Privacy
- **API Secret Isolation**: `GEMINI_API_KEY` is kept server-side and never exposed in client JS bundles.
- **Firestore Security Rules**: Owner-only access enforcement (`users/{userId}/**`).
- **Location Privacy**: Location is requested strictly on-demand.
- **Truthful Communication**: No fabricated SMS delivery claims.

---

## 9. License
MIT License. Created for GDGC Hackathon.
