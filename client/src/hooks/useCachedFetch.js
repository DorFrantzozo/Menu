import { useState, useEffect } from 'react';

/**
 * Custom hook for Stale-While-Revalidate data fetching.
 * Handles dynamic cache key changes efficiently (e.g. changing period filters).
 * 
 * @param {string} cacheKey - The unique key for localStorage
 * @param {function} fetchFunction - An async function that returns the data
 * @param {Array} dependencies - Array of dependencies for the useEffect (will trigger refetch)
 * @returns {object} { data, isLoading, isRefetching, error, setData }
 */
export const useCachedFetch = (cacheKey, fetchFunction, dependencies = []) => {
  const [state, setState] = useState(() => {
    let initialData = null;
    let initialLoading = true;
    
    if (cacheKey) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          initialData = JSON.parse(cached);
          initialLoading = false;
        }
      } catch (e) {
        console.error("Error parsing cache for", cacheKey, e);
      }
    }
    
    return {
      currentKey: cacheKey,
      data: initialData,
      isLoading: initialLoading,
      isRefetching: false,
      error: null
    };
  });

  // Derived state to catch key changes synchronously without a flicker render
  if (cacheKey !== state.currentKey) {
    let newData = null;
    let newLoading = true;
    if (cacheKey) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          newData = JSON.parse(cached);
          newLoading = false;
        }
      } catch (e) {
        // Ignore
      }
    }
    setState({
      currentKey: cacheKey,
      data: newData,
      isLoading: newLoading,
      isRefetching: false,
      error: null
    });
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!cacheKey) return;

      setState(prev => ({
        ...prev,
        isLoading: !prev.data, // only hard-load if we don't have data
        isRefetching: !!prev.data, // background refetch if we do
        error: null
      }));

      try {
        const result = await fetchFunction();
        if (isMounted && result !== undefined) {
          setState(prev => ({
            ...prev,
            data: result,
            isLoading: false,
            isRefetching: false
          }));
          try {
            localStorage.setItem(cacheKey, JSON.stringify(result));
          } catch(e) {
            console.error("Error setting cache", e);
          }
        }
      } catch (err) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            error: err.response?.data?.message || err.message || "שגיאה בטעינת הנתונים",
            isLoading: false,
            isRefetching: false
          }));
          console.error(`Error fetching ${cacheKey}:`, err);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, ...dependencies]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    isRefetching: state.isRefetching,
    error: state.error,
    setData: (newData) => setState(prev => ({ ...prev, data: newData }))
  };
};
