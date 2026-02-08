import apiClient from './api';
import type { GuestSession, ApiResponse } from '../types';

export const createGuest = async (): Promise<GuestSession> => {
  const response = await apiClient.post<ApiResponse<GuestSession>>('/api/guest/create');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create guest');
  }

  return response.data.data;
};
