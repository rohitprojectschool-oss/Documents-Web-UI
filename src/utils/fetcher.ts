import { BASE_URL } from '../constants/urls';

export const fetcher = {
  get: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json() as Promise<T>;
  },

  post: async <T>(path: string, body: unknown, options?: RequestInit): Promise<T> => {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { ...headers, ...options?.headers as any },
      body: isFormData ? (body as FormData) : JSON.stringify(body),
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json() as Promise<T>;
  },

  put: async <T>(path: string, body: unknown, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        ...options?.headers as any 
      },
      body: JSON.stringify(body),
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json() as Promise<T>;
  },

  delete: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        ...options?.headers as any 
      },
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json() as Promise<T>;
  },
};
