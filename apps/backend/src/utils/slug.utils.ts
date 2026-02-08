import { nanoid } from 'nanoid';

export const generateGuestSlug = (): string => {
  return `vox-${nanoid(6)}`;
};

export const sanitizeForSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);
};

export const generateBusinessSlug = (businessName?: string): string => {
  if (!businessName || businessName.trim().length === 0) {
    return generateGuestSlug();
  }

  const sanitized = sanitizeForSlug(businessName);

  if (sanitized.length === 0) {
    return generateGuestSlug();
  }

  return `vox-${sanitized}-${nanoid(3)}`;
};

export const isValidSlug = (slug: string): boolean => {
  return /^vox-[a-z0-9-]+$/.test(slug);
};
