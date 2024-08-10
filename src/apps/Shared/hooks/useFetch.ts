/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  useState, 
  useEffect,
} from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type FetchOptions = Record<string, any> & {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, any>;
}

export const useFetch: (
  url: string, 
  options: FetchOptions,
) => [any | null, string | null, boolean] = (url, options) => {
  const [data, setData,] = useState<any | null>(null);
  const [error, setError,] = useState<string | null>(null);
  const [loading, setLoading,] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const {
        body,
        method,
        headers,
      } = options

      const endpoint = new URL(url, BACKEND_URL);

      const response = await fetch(endpoint, {
        ...options,
        method,
        ...(headers && {
          ...headers,
        }),
        ...(body && {
          body: JSON.stringify(body),
        }),
      });
      const data = await response.json();
      return data;
    };

    fetchData()
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [url, options]);

  return [data, error, loading];
};