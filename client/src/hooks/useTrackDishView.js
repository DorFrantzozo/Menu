import { useEffect, useRef } from 'react';
import axiosInstance from '@/utils/baseUrl';

const useTrackDishView = (dishId) => {
  const hasTrackedRef = useRef(new Set());

  useEffect(() => {
    if (!dishId || hasTrackedRef.current.has(dishId)) return;

    const trackView = async () => {
      try {
        await axiosInstance.post('/analytics/view', { dishId });
        hasTrackedRef.current.add(dishId);
      } catch (error) {
        // Silent catch as per requirements
        console.error('Failed to track dish view', error);
      }
    };

    trackView();
  }, [dishId]);
};

export default useTrackDishView;
