export interface VoiceProcessingResult {
  transcript: Transcript;
  intent: WebsiteIntent;
}

export interface Transcript {
  original: string;
  english: string;
}

export interface WebsiteIntent {
  businessType: string;
  sections: string[];
  content: WebsiteContent;
}

export interface WebsiteContent {
  businessName: string;
  heroHeadline: string;
  heroSubheadline?: string;
  about?: string;

  // Services or Products (dynamic based on business)
  servicesOrProducts?: Array<{
    name: string;
    description?: string;
    price?: string;
  }>;

  // Contact information
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };

  [key: string]: any;
}

export interface SaveWebsiteRequest {
  ownerType: 'GUEST' | 'USER';
  ownerId: string;
  layout: string[];
  content: WebsiteContent;
}

export interface SaveWebsiteResponse {
  slug: string;
  publicUrl: string;
}

export interface FetchWebsiteResponse {
  layout: string[];
  content: WebsiteContent;
}

export class VoxError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'VoxError';
  }
}
