import { useCallback, useEffect, useState } from "react";

export function useApiResource(fetcher, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const next = await fetcher();
      setData(next);
    } catch (err) {
      setError(err.message || "Something went wrong");
      // ADDED: keep showing initialValue/stale data on error
      // instead of wiping the UI blank on a failed refetch
      setData((current) => current ?? initialValue);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  // ADDED: isEmpty helper — true when data is an empty array
  // use this in pages to show empty states cleanly
  const isEmpty = Array.isArray(data) && data.length === 0;

  return {
    data,
    setData,
    loading,
    error,
    isEmpty,                                    // ADDED: use in pages for empty state
    reload: load,                               // call this to manually refetch
  };
}