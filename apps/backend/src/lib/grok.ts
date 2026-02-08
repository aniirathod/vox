import Groq from 'groq-sdk';
import { ExternalServiceError } from '../types';
import type { WebsiteIntent } from '../types';

let clientInstance: Groq | null = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new ExternalServiceError('Groq', 'GROQ_API_KEY is missing from environment variables');
  }

  if (!clientInstance) {
    clientInstance = new Groq({ apiKey });
  }

  return clientInstance;
};

/**
 * Translate text to English
 */
export const translateToEnglish = async (
  text: string,
  detectedLanguage: string
): Promise<{ translatedText: string; wasTranslated: boolean }> => {
  if (detectedLanguage === 'en') {
    return { translatedText: text, wasTranslated: false };
  }

  try {
    const groq = getGroqClient();

    const res = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are a translator. Translate the following text to simple, clear English. Preserve the business intent and all details. Return only the translation, nothing else.',
        },
        { role: 'user', content: text },
      ],
    });

    const translatedText = res.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new ExternalServiceError('Groq', 'Translation failed - empty response');
    }

    return {
      translatedText,
      wasTranslated: true,
    };
  } catch (error) {
    throw new ExternalServiceError(
      'Groq',
      error instanceof Error ? error.message : 'Translation failed'
    );
  }
};

/**
 * Extract structured website intent
 */
export const extractIntent = async (text: string): Promise<WebsiteIntent> => {
  try {
    const groq = getGroqClient();

    const systemPrompt = `
You are an expert website designer.

RULES:
1. If multiple businesses are mentioned, respond with:
{
  "error": "multiple_businesses",
  "message": "Multiple businesses detected. Please describe one business at a time."
}

CRITICAL RULES:
- If multiple businesses are mentioned, respond with: {"error": "MULTIPLE_BUSINESSES", "message": "Multiple businesses detected. Please describe only one business."}
- Sections should be dynamic based on what the user mentions (Hero, About, Services, Products, Gallery, Testimonials, Contact, etc.)
- Extract ALL details they provide (name, services, prices, hours, location, etc.)
- If they don't mention something, omit it (don't make up data)
- From what they mention create content like headlines, descriptions, not phone number and all.
- Business name is REQUIRED - if not mentioned, use business type as placeholder

2. Respond ONLY with valid JSON in this format:
{
  "businessType": "string",
   "sections": ["Hero", "About", "Services", "Contact"],
  "content": {
  "businessName": "string (REQUIRED)",
    "heroHeadline": "string",
    "heroSubheadline": "string",
    "about": "string",
    "servicesOrProducts": [{"name": "string", "description": "string", "price": "string"}] (optional),
    "features": ["feature1"],
    "contact": {
      "phone": "string",
      "email": "string",
      "address": "string",
      "hours": "string"
    } (all optional)
  }
}
`.trim();

    const res = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    });

    const raw = res.choices[0]?.message?.content;

    if (!raw) {
      throw new ExternalServiceError('Groq', 'Intent extraction failed - empty response');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new ExternalServiceError('Groq', 'Invalid JSON returned by model');
    }

    if (parsed?.error === 'multiple_businesses') {
      throw new ExternalServiceError('Groq', parsed.message);
    }

    return parsed as WebsiteIntent;
  } catch (error) {
    if (error instanceof ExternalServiceError) throw error;

    throw new ExternalServiceError(
      'Groq',
      error instanceof Error ? error.message : 'Intent extraction failed'
    );
  }
};
