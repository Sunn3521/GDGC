/**
 * CrisisMate — Gemini Crisis Decision Engine
 *
 * Core AI service for crisis analysis.
 * Features:
 * - Pre-flight input validation (prevents unnecessary API calls)
 * - Structured prompt generation
 * - Gemini API invocation via Generative AI SDK / server boundary
 * - Timeout enforcement (default 15s)
 * - Limited retries (max 2 attempts)
 * - Strict schema validation and safety overrides
 * - Safe fallback execution on error (never crashes app)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CrisisAnalysis, CrisisInput } from '../../types/crisis';
import { validateEmergencyMessage } from '../../utils/validation';
import { buildCrisisPrompt } from './promptBuilder';
import { validateAndNormalize } from './responseValidator';
import { createSafeFallback } from './fallbackResponse';

// ─── Configuration ────────────────────────────────────────────────────────────

const GEMINI_MODEL = 'gemini-1.5-flash';
const MAX_RETRIES = 2;
const TIMEOUT_MS = 15_000;

// Custom executor hook for mock testing or server-side API proxies
type GeminiExecutor = (prompt: { systemInstruction: string; userTurn: string }) => Promise<string>;
let _customExecutor: GeminiExecutor | null = null;

/**
 * For testing or server-side proxy integration: set a custom executor function.
 */
export function setGeminiExecutor(executor: GeminiExecutor | null): void {
  _customExecutor = executor;
}

/**
 * Gets the configured API key from server environment.
 */
function getApiKey(): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env['GEMINI_API_KEY'] || process.env['VITE_GEMINI_API_KEY'] || '';
  }
  return '';
}

// ─── Input Validation ─────────────────────────────────────────────────────────

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

// ─── API Call Execution ───────────────────────────────────────────────────────

async function executeGeminiCall(prompt: { systemInstruction: string; userTurn: string }): Promise<string> {
  if (_customExecutor) {
    return _customExecutor(prompt);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: prompt.systemInstruction,
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Gemini call timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);
  });

  const callPromise = model.generateContent(prompt.userTurn).then((res) => res.response.text());

  const result = await Promise.race([callPromise, timeoutPromise]);
  if (!result || result.trim().length === 0) {
    throw new Error('Empty response received from Gemini API');
  }

  return result;
}

async function callGeminiWithRetry(prompt: { systemInstruction: string; userTurn: string }): Promise<string | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawText = await executeGeminiCall(prompt);
      return rawText;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message.toLowerCase();

      // Don't retry non-transient auth/permission errors
      if (msg.includes('api_key') || msg.includes('unauthorized') || msg.includes('quota')) {
        console.error(`[CrisisMate AI] Non-retryable error: ${lastError.message}`);
        break;
      }

      console.warn(`[CrisisMate AI] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, 300 * attempt));
      }
    }
  }

  return null;
}

// ─── Public API Functions ─────────────────────────────────────────────────────

/**
 * Main public entry point: analyzes a crisis situation description.
 *
 * @param message - Plain text description of emergency
 * @returns Promise<CrisisAnalysis> - Always resolves, never throws.
 */
export async function analyzeCrisis(message: string): Promise<CrisisAnalysis> {
  return analyzeCrisisWithContext({ message });
}

/**
 * Analyzes a crisis with optional context (location, previous emergency type).
 */
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

  // Step 3: Call Gemini with Timeout & Retries
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
