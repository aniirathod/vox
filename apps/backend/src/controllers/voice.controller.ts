import { Request, Response } from 'express';
import { processVoice } from '../services/voice.service';
import { isValidGuest } from '../services/guest.service';
import { ExternalServiceError, ValidationError } from '../types';

export const processVoiceAudio = async (req: Request, res: Response) => {
  try {
    // Validate required fields
    const { userId, websiteId } = req.body;

    if (!userId || !websiteId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId and websiteId are required',
      });
    }

    // Validate user exists and is a guest
    const isGuest = await isValidGuest(userId);
    if (!isGuest) {
      return res.status(403).json({
        success: false,
        error: 'Invalid user',
        message: 'User not found or not a valid guest user',
      });
    }

    // Validate audio file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided',
        message: 'Please upload an audio file',
      });
    }

    const audioBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    console.log(`[Voice Controller] Processing audio for user ${userId} (${mimeType})`);

    // Process voice through the pipeline
    const result = await processVoice(audioBuffer, mimeType);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Voice Controller] Error:', error);

    // Handle specific error types
    if (error instanceof ExternalServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        service: error.message.split(' ')[0], // Extract service name
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: 'Voice processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
