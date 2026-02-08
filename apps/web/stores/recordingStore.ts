import { create } from 'zustand';
import type { RecordingState, VoiceProcessResult } from '@/types';

interface RecordingStore {
  state: RecordingState;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
  result: VoiceProcessResult | null;
  error: string | null;

  setRecordingState: (state: RecordingState) => void;
  setAudioBlob: (blob: Blob) => void;
  setDuration: (duration: number) => void;
  setResult: (result: VoiceProcessResult) => void;
  setError: (error: string) => void;
  resetRecording: () => void;
}

export const useRecordingStore = create<RecordingStore>((set, get) => ({
  state: 'idle',
  audioBlob: null,
  audioUrl: null,
  duration: 0,
  result: null,
  error: null,

  setRecordingState: (state) => set({ state }),

  setAudioBlob: (blob) => {
    const currentUrl = get().audioUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    set({
      audioBlob: blob,
      audioUrl: URL.createObjectURL(blob),
    });
  },

  setDuration: (duration) => set({ duration }),

  setResult: (result) => set({ result, state: 'stopped' }),

  setError: (error) => set({ error, state: 'idle' }),

  resetRecording: () => {
    const { audioUrl } = get();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    set({
      state: 'idle',
      audioBlob: null,
      audioUrl: null,
      duration: 0,
      result: null,
      error: null,
    });
  },
}));
