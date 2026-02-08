export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const RECORDING_MAX_DURATION = 60; // seconds

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getProcessingMessage = (step: string): string => {
  const messages: Record<string, string> = {
    transcribing: '🎤 Transcribing your voice...',
    translating: '🌍 Understanding your language...',
    extracting: '🧠 Analyzing your business...',
    building: '🎨 Creating your website...',
    complete: '✨ All done!',
  };
  return messages[step] || 'Processing...';
};
