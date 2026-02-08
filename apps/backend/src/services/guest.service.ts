import { prisma } from '../db/prisma';
import { generateGuestSlug } from '../utils/slug.utils';
import type { GuestCreationResponse } from '../types/index';

export const createGuest = async (): Promise<GuestCreationResponse> => {
  try {
    const slug = generateGuestSlug();

    console.log(`[Guest Service] Creating guest user with slug: ${slug}`);

    const user = await prisma.user.create({
      data: {
        isGuest: true,
        websites: {
          create: {
            slug,
            title: 'Untitled Website',
            layoutJson: [],
            content: {},
          },
        },
      },
      include: {
        websites: true,
      },
    });

    console.log(`[Guest Service] Guest created successfully - User ID: ${user.id}`);

    return {
      userId: user.id,
      websiteId: user.websites[0].id,
      slug: user.websites[0].slug,
    };
  } catch (error) {
    console.error('[Guest Service] Failed to create guest:', error);
    throw new Error('Failed to create guest user');
  }
};

/**
 * Retrieves guest user information by userId
 */
export const getGuestById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        websites: true,
      },
    });

    if (!user) {
      throw new Error('Guest user not found');
    }

    return user;
  } catch (error) {
    console.error('[Guest Service] Failed to fetch guest:', error);
    throw new Error('Failed to retrieve guest user');
  }
};

/**
 * Checks if a user exists and is a guest
 */
export const isValidGuest = async (userId: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isGuest: true },
    });

    return user !== null && user.isGuest === true;
  } catch (error) {
    console.error('[Guest Service] Failed to validate guest:', error);
    return false;
  }
};
