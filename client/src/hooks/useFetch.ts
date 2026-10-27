import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../services/api';

export interface FetchState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  reload: () => void;
}

/** Loads data with abort-on-unmount and exposes loading / error / reload. `deps` re-triggers the load. */
export function useFetch<T>(loader: (signal: AbortSignal) => Promise<T>, deps: unknown[] = []): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    loaderRef
      .current(ctrl.signal)
      .then((d) => {
        if (!ctrl.signal.aborted) setData(d);
      })
      .catch((e) => {
        if (e?.name !== 'AbortError' && !ctrl.signal.aborted) setError(e instanceof ApiError ? e : new ApiError(0, 'Something went wrong'));
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading, reload };
}
