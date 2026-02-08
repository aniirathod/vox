import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from './api';
import type { Website, ApiResponse } from '../types';

// API Functions
export const saveWebsite = async (data: {
  userId: string;
  websiteId: string;
  title: string;
  layout: any[];
  content: Record<string, any>;
}): Promise<Website> => {
  const response = await apiClient.post<ApiResponse<Website>>('/api/website/save', data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to save website');
  }

  return response.data.data;
};

export const getWebsiteBySlug = async (slug: string): Promise<Website> => {
  const response = await apiClient.get<ApiResponse<Website>>(`/api/website/${slug}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Website not found');
  }

  return response.data.data;
};

export const getUserWebsites = async (userId: string): Promise<Website[]> => {
  const response = await apiClient.get<ApiResponse<Website[]>>(`/api/website/user/${userId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch websites');
  }

  return response.data.data;
};

// TanStack Query Hooks
export const useSaveWebsite = () => {
  return useMutation({
    mutationFn: saveWebsite,
  });
};

export const useWebsite = (slug: string) => {
  return useQuery({
    queryKey: ['website', slug],
    queryFn: () => getWebsiteBySlug(slug),
    enabled: !!slug,
  });
};

export const useUserWebsites = (userId: string) => {
  return useQuery({
    queryKey: ['websites', userId],
    queryFn: () => getUserWebsites(userId),
    enabled: !!userId,
  });
};
