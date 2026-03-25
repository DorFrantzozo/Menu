import { useEffect } from 'react';
import axiosInstance from '@/utils/baseUrl';

const SESSION_KEY = 'tracked_dish_views';

const useTrackDishView = (dishId) => {
  useEffect(() => {
    if (!dishId) return;

    // Use sessionStorage so deduplication persists across
    // modal open/close cycles within the same browser tab,
    // but resets naturally when the tab is closed.
    const tracked = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
    if (tracked.includes(dishId)) return;

    const trackView = async () => {
      try {
        await axiosInstance.post('/analytics/view', { dishId });
        // Mark as tracked AFTER a successful request
        sessionStorage.setItem(SESSION_KEY, JSON.stringify([...tracked, dishId]));
      } catch (error) {
        // Silent catch – analytics failure must never affect UX
        console.error('Failed to track dish view', error);
      }
    };

    trackView();
  }, [dishId]);
};

export default useTrackDishView;
