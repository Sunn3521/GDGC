# CrisisMate — AI Crisis Decision Engine Architecture

## Complete Decision Pipeline

```text
User Input
    ↓
Input Validation (length, basic sanity, pre-flight check)
    ↓
Gemini System Prompt Builder (System instructions + schema constraints)
    ↓
Gemini 1.5 Flash API Call (Timeout: 15s, Max retries: 2)
    ↓
Response Parser (Extract JSON from text/markdown fences)
    ↓
Response Validator (Strict schema check: types, enums, array constraints)
    ↓
Normalizer & Safety Overrides (CRITICAL forces escalationRequired=true & needsLocation=true)
    ↓
CrisisAnalysis Output (Clean structured output for Frontend / Maps / Firebase)
    ↓ (on error or timeout)
Safe Fallback Response (Non-crashing fallback with confidence=0)
```

## Security Boundary
- **Secret Isolation**: `GEMINI_API_KEY` is strictly managed server-side.
- **Client Decoupling**: React frontend components consume `CrisisAnalysis` via `analyzeCrisis()`. UI components have zero visibility into prompt construction, raw API parameters, or raw JSON text.
