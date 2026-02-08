import { create } from 'zustand';
import type { ProcessingProgress } from '@/types';

interface UIStore {
  recordingModalOpen: boolean;
  processingProgress: ProcessingProgress | null;
  isProcessing: boolean;

  openRecordingModal: () => void;
  closeRecordingModal: () => void;
  setProcessingProgress: (progress: ProcessingProgress | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  recordingModalOpen: false,
  processingProgress: null,
  isProcessing: false,

  openRecordingModal: () => set({ recordingModalOpen: true }),

  closeRecordingModal: () => set({ recordingModalOpen: false }),

  setProcessingProgress: (progress) =>
    set({
      processingProgress: progress,
      isProcessing: progress !== null,
    }),
}));
