/**
 * CrisisMate — Secure Backend Firebase Cloud Function
 *
 * Handles Gemini API requests server-side.
 * Keeps GEMINI_API_KEY completely isolated from client browser bundles.
 */

import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-1.5-flash';

export const analyzeCrisisFunction = functions.https.onRequest(async (req, res) => {
  // CORS Headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured on backend server.' });
    return;
  }

  const { message, prompt } = req.body || {};
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Invalid emergency message.' });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: prompt?.systemInstruction || 'Analyze emergency situation.',
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt?.userTurn || message);
    const responseText = result.response.text();

    res.status(200).json({ rawText: responseText });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Backend Gemini invocation failed';
    res.status(500).json({ error: errorMsg });
  }
});
