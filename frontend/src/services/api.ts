import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RecordingCreateRequest {
  audio_data: string; // Base64 encoded audio data
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface RecordingResponse {
  id: string;
  text: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  created_at: string;
}

export interface MemorySearchQuery {
  query: string;
  limit?: number;
}

export interface MemorySearchResult {
  id: string;
  text: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  similarity: number;
}

export const recordingApi = {
  createRecording: async (data: RecordingCreateRequest): Promise<RecordingResponse> => {
    const response = await api.post('/api/recordings', data);
    return response.data;
  },

  getRecordings: async (): Promise<RecordingResponse[]> => {
    const response = await api.get('/api/recordings');
    return response.data;
  },

  getRecording: async (id: string): Promise<RecordingResponse> => {
    const response = await api.get(`/api/recordings/${id}`);
    return response.data;
  },

  deleteRecording: async (id: string): Promise<void> => {
    await api.delete(`/api/recordings/${id}`);
  }
};

export default api;
