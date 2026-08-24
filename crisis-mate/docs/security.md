# CrisisMate — Security Architecture & Privacy Report

## 1. API Secret Isolation
- **Server Environment Variable**: The Gemini API key (`GEMINI_API_KEY`) is stored as a secret environment variable and is **never** embedded in client-side production JavaScript bundles.
- **Client Bundle Verification**: Production builds (`npm run build`) are audited to ensure no secret tokens are baked into output chunks under `dist/assets/`.

---

## 2. Firestore Security Rules
All user collections and subcollections are strictly protected by owner-only authentication rules in [`firestore.rules`](file:///c:/Users/LENOVO/OneDrive/Documents/ideaathon/crisis-mate/firestore.rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
      match /trustedContacts/{contactId} { allow read, write: if isOwner(userId); }
      match /emergencySessions/{sessionId} { allow read, write: if isOwner(userId); }
      match /sosEvents/{sosId} { allow read, write: if isOwner(userId); }
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

- **Zero Cross-User Access**: Users cannot read or modify another user's profile, trusted contacts, emergency sessions, or SOS events.
- **Public Reads/Writes Disabled**: Public wildcard reads/writes (`allow read, write: if true;`) are strictly prohibited.

---

## 3. Location Privacy
- **On-Demand Only**: Geolocation access is requested strictly when explicitly initiated by the user (clicking "Find Nearby Emergency Help" or activating SOS).
- **No Background Tracking**: The app does not track user location continuously in the background.

---

## 4. Truthful Emergency Communication
- **No Fake SMS Success Claims**: CrisisMate does not claim an SMS was delivered unless confirmed by a real server gateway.
- **Explicit SOS Confirmation**: SOS alerts require explicit user confirmation via a modal dialog before recording the event in Firestore.
