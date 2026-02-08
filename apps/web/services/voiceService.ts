import apiClient from './api';
import type { VoiceProcessResult, ApiResponse } from '../types';

export const processVoice = async (
  audioBlob: Blob,
  userId: string,
  websiteId: string
): Promise<VoiceProcessResult> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('userId', userId);
  formData.append('websiteId', websiteId);

  const response = await apiClient.post<ApiResponse<VoiceProcessResult>>(
    '/api/voice/process',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Voice processing failed');
  }

  return response.data.data;
};
