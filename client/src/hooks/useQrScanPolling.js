import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchQrScanCount } from '@/utils/fetchData';

const POLL_INTERVAL = 30000; // 30 seconds

/**
 * Custom hook for real-time QR scan count polling.
 * Polls every 30s and pauses when the browser tab is not visible.
 */
const useQrScanPolling = (userId, initialCount = 0) => {
  const [scanCount, setScanCount] = useState(initialCount);
  const intervalRef = useRef(null);

  const poll = useCallback(async () => {
    if (!userId) return;
    const count = await fetchQrScanCount(userId);
    if (count !== null) setScanCount(count);
  }, [userId]);

  useEffect(() => {
    poll();

    const start = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(poll, POLL_INTERVAL);
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        poll();
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [poll]);

  return scanCount;
};

export default useQrScanPolling;
