import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<any>,
  dependencies: any[] = []
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
        setData(response.data);
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
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

export function useApiMutation<T, P = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (apiCall: (params: P) => Promise<any>, params: P) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(params);
      if (response.success) {
        setData(response.data);
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
