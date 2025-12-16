import { useState, useEffect, useCallback } from 'react';
import type { AxiosError } from 'axios';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

export function useApiMutation<T, P = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async <ActualP extends P>(apiCall: (params: ActualP) => Promise<{ success: boolean; data?: T; error?: string }>, params: ActualP) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(params);
      if (response.success) {
        setData(response.data || null);
        return response.data;
      } else {
        const errorMsg = response.error || 'An error occurred';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMsg = axiosError.message || 'Network error occurred';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, mutate };
}
