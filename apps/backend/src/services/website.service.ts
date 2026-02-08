import { prisma } from '../db/prisma';
import { NotFoundError, ValidationError } from '../types';
import type { SaveWebsiteRequest, WebsiteResponse } from '../types';

export const saveWebsite = async (data: SaveWebsiteRequest): Promise<WebsiteResponse> => {
  try {
    console.log(`[Website Service] Saving website for user ${data.userId}`);

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Validate website exists and belongs to user
    const existingWebsite = await prisma.website.findUnique({
      where: { id: data.websiteId },
    });

    if (!existingWebsite) {
      throw new NotFoundError('Website not found');
    }

    if (existingWebsite.userId !== data.userId) {
      throw new ValidationError('Website does not belong to this user');
    }

    // Update website with actual content
    const website = await prisma.website.update({
      where: { id: data.websiteId },
      data: {
        title: data.title,
        layoutJson: data.layout,
        content: data.content,
        updatedAt: new Date(),
      },
    });

    const publicUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:5173'}/${website.slug}`;

    console.log(`[Website Service] Website saved successfully: ${publicUrl}`);

    return {
      id: website.id,
      slug: website.slug,
      title: website.title,
      url: publicUrl,
      layoutJson: website.layoutJson as any[],
      content: website.content as Record<string, any>,
      createdAt: website.createdAt,
      updatedAt: website.updatedAt,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    console.error('[Website Service] Failed to save website:', error);
    throw new Error('Failed to save website');
  }
};

/**
 * Retrieves a website by slug
 */
export const getWebsiteBySlug = async (slug: string): Promise<WebsiteResponse> => {
  try {
    const website = await prisma.website.findUnique({
      where: { slug },
    });

    if (!website) {
      throw new NotFoundError(`Website with slug "${slug}" not found`);
    }

    const publicUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:5173'}/${website.slug}`;

    return {
      id: website.id,
      slug: website.slug,
      title: website.title,
      url: publicUrl,
      layoutJson: website.layoutJson as any[],
      content: website.content as Record<string, any>,
      createdAt: website.createdAt,
      updatedAt: website.updatedAt,
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('[Website Service] Failed to fetch website:', error);
    throw new Error('Failed to retrieve website');
  }
};

/**
 * Gets all websites for a user
 */
export const getWebsitesByUser = async (userId: string): Promise<WebsiteResponse[]> => {
  try {
    const websites = await prisma.website.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return websites.map((website) => ({
      id: website.id,
      slug: website.slug,
      title: website.title,
      url: `${process.env.PUBLIC_BASE_URL || 'http://localhost:5173'}/${website.slug}`,
      layoutJson: website.layoutJson as any[],
      content: website.content as Record<string, any>,
      createdAt: website.createdAt,
      updatedAt: website.updatedAt,
    }));
  } catch (error) {
    console.error('[Website Service] Failed to fetch user websites:', error);
    throw new Error('Failed to retrieve websites');
  }
};
