export interface VoiceProcessRequest {
  userId: string;
  websiteId: string;
}

export interface TranscriptionResult {
  text: string;
  detectedLanguage: string;
  confidence: number;
}

export interface TranslationResult {
  translatedText: string;
  originalLanguage: string;
  wasTranslated: boolean;
}

export interface WebsiteIntent {
  businessType: string;
  sections: string[];
  content: {
    heroHeadline?: string;
    heroSubheadline?: string;
    about?: string;
    productsOrServices?: string[];
    features?: string[];
    testimonials?: Array<{
      text: string;
      author?: string;
    }>;
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    [key: string]: any;
  };
}

export interface IntentExtractionResult {
  intent: WebsiteIntent;
  detectedLanguage: string;
  processingSteps: {
    transcription: boolean;
    translation: boolean;
    intentExtraction: boolean;
  };
}

// Website Types
export interface SaveWebsiteRequest {
  userId: string;
  websiteId: string;
  title: string;
  layout: any[];
  content: Record<string, any>;
}

export interface WebsiteResponse {
  id: string;
  slug: string;
  title: string;
  url: string;
  layoutJson: any[];
  content: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Guest Types
export interface GuestCreationResponse {
  userId: string;
  websiteId: string;
  slug: string;
}

// Error Types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(503, `${service} error: ${message}`);
  }
}
