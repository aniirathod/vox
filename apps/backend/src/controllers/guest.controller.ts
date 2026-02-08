import { Request, Response } from 'express';
import { createGuest } from '../services/guest.service';

export const createGuestUser = async (req: Request, res: Response) => {
  try {
    const result = await createGuest();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Guest Controller] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create guest user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
