import { transcribeAudio } from '../lib/deepgram';
import { translateToEnglish, extractIntent } from '../lib/grok';
import type { IntentExtractionResult } from '../types';

export const processVoice = async (
  audioBuffer: Buffer,
  mimeType: string = 'audio/webm'
): Promise<IntentExtractionResult> => {
  console.log('[Voice Service] Starting voice processing pipeline...');

  // Step 1: Transcribe audio
  const transcriptionResult = await transcribeAudio(audioBuffer, mimeType);

  if (transcriptionResult.confidence < 0.5) {
    console.warn(`[Voice Service] Low confidence transcription: ${transcriptionResult.confidence}`);
  }

  // Step 2: Translate to English (only if non-English)
  const translationResult = await translateToEnglish(
    transcriptionResult.text,
    transcriptionResult.detectedLanguage
  );

  // Step 3: Extract structured intent
  const intent = await extractIntent(translationResult.translatedText);

  console.log('[Voice Service] Voice processing complete!');

  return {
    intent,
    detectedLanguage: transcriptionResult.detectedLanguage,
    processingSteps: {
      transcription: true,
      translation: translationResult.wasTranslated,
      intentExtraction: true,
    },
  };
};
