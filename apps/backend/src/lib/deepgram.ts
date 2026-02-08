import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { ExternalServiceError } from '../types';

if (!process.env.DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM_API_KEY is required');
}

export const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

export const transcribeAudio = async (
  audioBuffer: Buffer,
  mimeType: string = 'audio/webm'
): Promise<{ text: string; detectedLanguage: string; confidence: number }> => {
  try {
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(audioBuffer, {
      model: 'nova-2',
      smart_format: true,
      detect_language: true, // Auto-detect language
      punctuate: true,
      diarize: false, // Single speaker assumed
    });

    if (error) {
      throw new ExternalServiceError('Deepgram', error.message);
    }

    const transcript = result.results?.channels[0]?.alternatives[0]?.transcript;
    const detectedLanguage = result.results?.channels[0]?.detected_language || 'en';
    const confidence = result.results?.channels[0]?.alternatives[0]?.confidence || 0;

    if (!transcript || transcript.trim().length === 0) {
      throw new ExternalServiceError(
        'Deepgram',
        'No speech detected in audio. Please try speaking more clearly.'
      );
    }

    console.log(
      `[Deepgram] Transcribed: "${transcript.substring(0, 50)}..." (Language: ${detectedLanguage})`
    );

    return {
      text: transcript,
      detectedLanguage,
      confidence,
    };
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      throw error;
    }
    throw new ExternalServiceError(
      'Deepgram',
      error instanceof Error ? error.message : 'Unknown transcription error'
    );
  }
};
