# CrisisMate — AI Prompt System Documentation

## System Instruction Purpose
The system instruction for the CrisisMate AI Crisis Decision Engine (`src/services/gemini/promptBuilder.ts`) conditions Gemini 1.5 Flash to act as an emergency decision support engine rather than a conversational chatbot.

### Core Directives
1. **Safety First**: Prioritizes immediate physical safety above all else.
2. **Concise Imperative Instructions**: Immediate actions are formatted as short, direct commands (e.g. "Evacuate room immediately").
3. **Strict Non-Fabrication**:
   - Never invents phone numbers or emergency contact details.
   - Never fabricates hospital or police station names/addresses.
   - Never claims an SOS alert was dispatched unless explicitly initiated.
4. **Structured JSON Output**: Mandates raw JSON responses strictly matching the `CrisisAnalysis` schema.

---

## Expected JSON Schema
```json
{
  "emergencyType": "FIRE | MEDICAL | ACCIDENT | FLOOD | EARTHQUAKE | CYCLONE | ELECTRICAL | PERSONAL_SAFETY | OTHER",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "confidence": 0.95,
  "summary": "One clear sentence describing the identified emergency.",
  "immediateRisks": ["Risk 1", "Risk 2"],
  "immediateActions": ["Action 1", "Action 2"],
  "avoid": ["Avoid action 1", "Avoid action 2"],
  "escalationRequired": true,
  "needsLocation": true,
  "professionalHelpRecommended": true
}
```

---

## Severity Model
- **CRITICAL**: Immediate life threat (unconsciousness, active structural fire with trapped occupants, severe arterial bleeding, building collapse, rapid flash flood).
- **HIGH**: Serious emergency requiring urgent attention (vehicle collision with injury, gas leak/sparks, strong personal safety threat).
- **MEDIUM**: Moderate concern requiring attention.
- **LOW**: Precautionary or informational inquiry (e.g., first aid kit stock advice).
