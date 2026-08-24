# CrisisMate — AI Engine Integration API (`docs/api.md`)

## Core Public API Interface

### `analyzeCrisis(message: string): Promise<CrisisAnalysis>`

Main integration boundary consumed by the React application / frontend components.

```typescript
import { analyzeCrisis, type CrisisAnalysis } from '@/services/gemini/geminiService';

const analysis: CrisisAnalysis = await analyzeCrisis("There is a fire in my hostel room and heavy smoke.");
```

#### Input
- `message` (`string`): User description of the crisis (must be between 5 and 2000 characters).

#### Output (`CrisisAnalysis`)
```typescript
interface CrisisAnalysis {
  emergencyType: 'FIRE' | 'MEDICAL' | 'ACCIDENT' | 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'ELECTRICAL' | 'PERSONAL_SAFETY' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number; // 0.0 - 1.0 (0 indicates safe fallback)
  summary: string;
  immediateRisks: string[];
  immediateActions: string[];
  avoid: string[];
  escalationRequired: boolean;
  needsLocation: boolean;
  professionalHelpRecommended: boolean;
  timestamp?: string;
  isFallback?: boolean;
}
```

#### Error & Fallback Guarantee
`analyzeCrisis()` **never throws or rejects**. If an API failure, network timeout, missing API key, or invalid JSON occurs, it gracefully returns a `SAFE_FALLBACK_RESPONSE` with `confidence: 0` and `isFallback: true`.

---

### Security & Server Boundary
- **Secret Protection**: The `GEMINI_API_KEY` is kept on the server/cloud function environment and is **never** embedded in client bundle `VITE_` public variables.
- **Server Function Hook**: Production calls route through a secure Cloud Function boundary.
