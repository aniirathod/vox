import { Request, Response } from 'express';
import { saveWebsite, getWebsiteBySlug, getWebsitesByUser } from '../services/website.service';
import { NotFoundError, ValidationError } from '../types';

export const saveWebsiteContent = async (req: Request, res: Response) => {
  try {
    const { userId, websiteId, title, layout, content } = req.body;

    // Validate required fields
    if (!userId || !websiteId || !title || !layout || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId, websiteId, title, layout, and content are required',
      });
    }

    // Validate layout is an array
    if (!Array.isArray(layout)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid layout format',
        message: 'layout must be an array',
      });
    }

    // Validate content is an object
    if (typeof content !== 'object' || content === null || Array.isArray(content)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content format',
        message: 'content must be an object',
      });
    }

    console.log(`[Website Controller] Saving website for user ${userId}`);

    const website = await saveWebsite({
      userId,
      websiteId,
      title,
      layout,
      content,
    });

    res.status(200).json({
      success: true,
      data: website,
    });
  } catch (error) {
    console.error('[Website Controller] Error saving website:', error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to save website',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/website/:slug
 * Retrieves a website by its slug
 */
export const getWebsite = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({
        success: false,
        error: 'Slug is required',
      });
    }

    console.log(`[Website Controller] Fetching website: ${slug}`);

    const website = await getWebsiteBySlug(slug);

    res.status(200).json({
      success: true,
      data: website,
    });
  } catch (error) {
    console.error('[Website Controller] Error fetching website:', error);

    if (error instanceof NotFoundError) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve website',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/website/user/:userId
 * Gets all websites for a specific user
 */
export const getUserWebsites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    console.log(`[Website Controller] Fetching websites for user ${userId}`);

    const websites = await getWebsitesByUser(userId);

    res.status(200).json({
      success: true,
      data: websites,
      count: websites.length,
    });
  } catch (error) {
    console.error('[Website Controller] Error fetching user websites:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve websites',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
