// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Guest Session
export interface GuestSession {
  userId: string;
  websiteId: string;
  slug: string;
}

// Voice Processing
export interface VoiceProcessResult {
  intent: WebsiteIntent;
  detectedLanguage: string;
  processingSteps: {
    transcription: boolean;
    translation: boolean;
    intentExtraction: boolean;
  };
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

// Website
export interface Website {
  id: string;
  slug: string;
  title: string;
  url: string;
  layoutJson: LayoutSection[];
  content: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface LayoutSection {
  id: string;
  type: string;
  order: number;
}

// Recording States
export type RecordingState = 'idle' | 'recording' | 'stopped' | 'processing';

// Processing States
export type ProcessingStep =
  | 'transcribing'
  | 'translating'
  | 'extracting'
  | 'building'
  | 'complete';

export interface ProcessingProgress {
  step: ProcessingStep;
  message: string;
  progress: number;
}
