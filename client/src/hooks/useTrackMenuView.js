import { useEffect, useRef } from 'react';
import { recordMenuView } from '../utils/fetchData';

const useTrackMenuView = (restaurantId) => {
  // Use a ref to prevent double-firing in Strict Mode locally, though logic handles it via sessionStorage
  const hasFired = useRef(false);

  useEffect(() => {
    if (!restaurantId || hasFired.current) return;

    const sessionKey = `viewed_${restaurantId}`;
    const hasViewed = sessionStorage.getItem(sessionKey);

    if (!hasViewed) {
      hasFired.current = true;
      recordMenuView(restaurantId);
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [restaurantId]);
};

export default useTrackMenuView;
