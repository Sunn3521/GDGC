/**
 * CrisisMate — Gemini Crisis Decision Engine
 *
 * Core AI service for crisis analysis.
 * Secure Architecture:
 * - Delegates API calls to secure backend proxy endpoint (/api/analyze-crisis) or Cloud Function.
 * - Server key (GEMINI_API_KEY) is kept strictly on server environment.
 * - Client-side validation, schema normalization, timeout, and safe fallback.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CrisisAnalysis, CrisisInput } from '../../types/crisis';
import { validateEmergencyMessage } from '../../utils/validation';
import { buildCrisisPrompt } from './promptBuilder';
import { validateAndNormalize } from './responseValidator';
import { createSafeFallback } from './fallbackResponse';

const GEMINI_MODEL = 'gemini-1.5-flash';
const MAX_RETRIES = 2;
const TIMEOUT_MS = 15_000;

// Custom executor hook for mock testing or server-side API proxies
type GeminiExecutor = (prompt: { systemInstruction: string; userTurn: string }) => Promise<string>;
let _customExecutor: GeminiExecutor | null = null;

export function setGeminiExecutor(executor: GeminiExecutor | null): void {
  _customExecutor = executor;
}

/**
 * Gets server key safely when executing in Node server environment.
 */
function getServerApiKey(): string {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env['GEMINI_API_KEY'] || '';
    }
  } catch {
    // Ignore error
  }
  return '';
}

export interface InputValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedMessage?: string;
}

export function validateUserInput(message: string): InputValidationResult {
  const result = validateEmergencyMessage(message);
  if (!result.isValid) {
    return { isValid: false, error: result.error };
  }
  return { isValid: true, sanitizedMessage: result.sanitized };
}

/**
 * Execute Gemini call safely via backend proxy or server SDK.
 */
async function executeGeminiCall(prompt: { systemInstruction: string; userTurn: string }): Promise<string> {
  if (_customExecutor) {
    return _customExecutor(prompt);
  }

  // 1. Try Backend API endpoint if configured
  const backendUrl = typeof window !== 'undefined' && (window as any).CRISISMATE_API_URL
    ? (window as any).CRISISMATE_API_URL
    : '/api/analyze-crisis';

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.rawText) return data.rawText;
    }
  } catch (err) {
    // Fall back to server key if running in server context
  }

  // 2. Server context fallback (Node.js runtime only)
  const serverKey = getServerApiKey();
  if (serverKey) {
    const genAI = new GoogleGenerativeAI(serverKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: prompt.systemInstruction,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt.userTurn);
    return result.response.text();
  }

  throw new Error('Backend API proxy or server GEMINI_API_KEY is required for crisis analysis.');
}

async function callGeminiWithRetry(prompt: { systemInstruction: string; userTurn: string }): Promise<string | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawText = await executeGeminiCall(prompt);
      return rawText;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[CrisisMate AI] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, 300 * attempt));
      }
    }
  }

  return null;
}

export async function analyzeCrisis(message: string): Promise<CrisisAnalysis> {
  return analyzeCrisisWithContext({ message });
}

export async function analyzeCrisisWithContext(input: CrisisInput): Promise<CrisisAnalysis> {
  // Step 1: Input Validation
  const validation = validateUserInput(input.message);
  if (!validation.isValid) {
    return createSafeFallback(validation.error || 'Please describe your emergency situation.');
  }

  const sanitizedInput: CrisisInput = {
    ...input,
    message: validation.sanitizedMessage || input.message,
  };

  // Step 2: Build Prompt
  const prompt = buildCrisisPrompt(sanitizedInput);

  // Step 3: Call Gemini with Retry
  const rawText = await callGeminiWithRetry(prompt);
  if (!rawText) {
    return createSafeFallback();
  }

  // Step 4: Validate, Normalize & Apply Safety Overrides
  const analysis = validateAndNormalize(rawText);
  if (!analysis) {
    return createSafeFallback();
  }

  return analysis;
}
