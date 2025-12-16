import apiClient from './client';
import type {
  Mitarbeiter,
  Event,
  Kunde,
  Serviceschein,
  Material,
  MaterialBewegung,
  Diktat,
  ApiHealth,
  ApiError,
  FilterOptions,
  ApiResponse,
} from '../types';

// Mitarbeiter API
export const mitarbeiterApi = {
  getAll: async (): Promise<ApiResponse<Mitarbeiter[]>> => {
    const response = await apiClient.get('mitarbeiter');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Mitarbeiter>> => {
    const response = await apiClient.get(`mitarbeiter/${id}`);
    return response.data;
  },

  create: async (data: Partial<Mitarbeiter>): Promise<ApiResponse<Mitarbeiter>> => {
    const response = await apiClient.post('mitarbeiter', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Mitarbeiter>): Promise<ApiResponse<Mitarbeiter>> => {
    const response = await apiClient.put(`mitarbeiter/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`mitarbeiter/${id}`);
    return response.data;
  },
};

// Events API
export const eventsApi = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<Event[]>> => {
    const response = await apiClient.get('events', { params: filters });
    return response.data;
  },

  getRecent: async (limit = 50): Promise<ApiResponse<Event[]>> => {
    const response = await apiClient.get('events/recent', { params: { limit } });
    return response.data;
  },

  getPending: async (): Promise<ApiResponse<Event[]>> => {
    const response = await apiClient.get('events/pending');
    return response.data;
  },

  getFailed: async (): Promise<ApiResponse<Event[]>> => {
    const response = await apiClient.get('events/failed');
    return response.data;
  },

  retry: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await apiClient.post(`events/${id}/retry`);
    return response.data;
  },

  accept: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await apiClient.post(`events/${id}/accept`);
    return response.data;
  },

  resend: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await apiClient.post(`events/${id}/resend`);
    return response.data;
  },
};

// Kunden API
export const kundenApi = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<Kunde[]>> => {
    const response = await apiClient.get('kunden', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Kunde>> => {
    const response = await apiClient.get(`kunden/${id}`);
    return response.data;
  },

  create: async (data: Partial<Kunde>): Promise<ApiResponse<Kunde>> => {
    const response = await apiClient.post('kunden', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Kunde>): Promise<ApiResponse<Kunde>> => {
    const response = await apiClient.put(`kunden/${id}`, data);
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<Kunde[]>> => {
    const response = await apiClient.get('kunden/search', { params: { q: query } });
    return response.data;
  },
};

// Servicescheine API
export const servicescheineApi = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<Serviceschein[]>> => {
    const response = await apiClient.get('servicescheine', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Serviceschein>> => {
    const response = await apiClient.get(`servicescheine/${id}`);
    return response.data;
  },

  create: async (data: Partial<Serviceschein>): Promise<ApiResponse<Serviceschein>> => {
    const response = await apiClient.post('servicescheine', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Serviceschein>): Promise<ApiResponse<Serviceschein>> => {
    const response = await apiClient.put(`servicescheine/${id}`, data);
    return response.data;
  },

  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`servicescheine/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  resend: async (id: string): Promise<ApiResponse<Serviceschein>> => {
    const response = await apiClient.post(`servicescheine/${id}/resend`);
    return response.data;
  },
};

// Material API
export const materialApi = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<Material[]>> => {
    const response = await apiClient.get('material', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Material>> => {
    const response = await apiClient.get(`material/${id}`);
    return response.data;
  },

  getBewegungen: async (filters?: FilterOptions): Promise<ApiResponse<MaterialBewegung[]>> => {
    const response = await apiClient.get('material/bewegungen', { params: filters });
    return response.data;
  },
};

// Diktate API
export const diktateApi = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<Diktat[]>> => {
    const response = await apiClient.get('diktate', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Diktat>> => {
    const response = await apiClient.get(`diktate/${id}`);
    return response.data;
  },
};

// System/Health API
export const systemApi = {
  getHealth: async (): Promise<ApiResponse<ApiHealth>> => {
    const response = await apiClient.get('system/health');
    return response.data;
  },

  getErrors: async (limit = 100): Promise<ApiResponse<ApiError[]>> => {
    const response = await apiClient.get('system/errors', { params: { limit } });
    return response.data;
  },

  retrySync: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('system/retry-sync');
    return response.data;
  },
};

// Export all APIs
export default {
  mitarbeiter: mitarbeiterApi,
  events: eventsApi,
  kunden: kundenApi,
  servicescheine: servicescheineApi,
  material: materialApi,
  diktate: diktateApi,
  system: systemApi,
};
