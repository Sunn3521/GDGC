# CrisisMate — 5-Minute Hackathon Demo Script

## Target Audience: Hackathon Judges & Technical Reviewers
**Duration**: 3 to 5 Minutes  
**Goal**: Demonstrate how CrisisMate converts panic and uncertainty into clear, prioritized, actionable emergency steps using Google Gemini, Firebase, and Google Maps.

---

### 0:00 – 0:30 | The Problem
> *"In an emergency — whether it's a room fire, sudden medical collapse, or rapid flood — panic and confusion cause dangerous delays. People don't know what to do first, whom to call, or what critical mistakes to avoid."*

### 0:30 – 1:00 | The Solution (CrisisMate Overview)
> *"CrisisMate is an AI-powered emergency decision support engine built on Google technologies. It analyzes emergency situations in natural language and delivers immediate, prioritized, step-by-step safety actions, nearby help discovery, and truthful SOS alerting."*

### 1:00 – 2:00 | Live Demo 1: Emergency Analysis with Gemini 1.5 Flash
> 1. Open CrisisMate home screen.
> 2. Click **"Describe Emergency Now"**.
> 3. Enter scenario: *"There is a fire in my hostel room and heavy smoke is filling the hallway."*
> 4. Click **"Analyze Crisis"** (or press `Ctrl+Enter`).
> 5. Show real-time analysis:
>    - **Category**: `Fire Emergency` 🔥
>    - **Severity**: `CRITICAL — Act Now` 🚨
>    - **CRITICAL Banner**: Direct hotlines (`112` / `101`).
>    - **What to Do Now**: Numbered steps (1. Crawl low under smoke, 2. Feel doors for heat, 3. Use stairs, 4. Evacuate).
>    - **Things to Avoid**: ❌ Do not use elevators. ❌ Do not return for belongings.

### 2:00 – 2:45 | Live Demo 2: Nearby Emergency Help & Navigation
> 1. Show the **"Nearby Emergency Help"** section.
> 2. Click **"Find Nearby Emergency Help"**.
> 3. Grant browser location permission.
> 4. Display nearby Hospitals, Police Stations, and Fire Stations sorted by exact Haversine distance in meters.
> 5. Click **"Open Maps"** to launch direct turn-by-turn navigation in Google Maps.

### 2:45 – 3:30 | Live Demo 3: Truthful SOS Alerting & Firebase Auth
> 1. Scroll to **"Emergency SOS Activation"**.
> 2. Click **"Trigger SOS Alert"**.
> 3. Show explicit confirmation modal: *"Activate SOS Alert?"*
> 4. Click **"Activate SOS"**.
> 5. Show truthful status: *"SOS event recorded in Firestore. SMS dispatch pending server gateway."*
> 6. Demonstrate Google Sign-In and viewing saved emergency session history under **History**.

### 3:30 – 4:00 | Live Demo 4: Offline Emergency Guides
> 1. Simulate offline state (toggle offline mode / click **"Guides"**).
> 2. Show pre-bundled offline emergency guides for Fire, Medical, Flood, Electrical, and Earthquake that require **zero** internet or API access.

### 4:00 – 5:00 | Technical Architecture & Impact
> *"CrisisMate combines server-side secret isolation for Gemini 1.5 Flash, strict Firestore security rules, client-side distance calculations for Maps navigation, and 100% offline fallback guides. It turns panic into clarity when seconds count."*
