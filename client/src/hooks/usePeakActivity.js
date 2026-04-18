import { useCallback } from "react";
import axiosInstance from "@/utils/baseUrl";
import { useCachedFetch } from "@/hooks/useCachedFetch";

export const usePeakActivity = (userId) => {
  const fetchPeakActivity = useCallback(async () => {
    if (!userId) {
      return { daysData: [], hoursData: [] };
    }

    const response = await axiosInstance.get(`/analytics/peak-activity/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response.data;
  }, [userId]);

  const { data, isLoading, error } = useCachedFetch(
    userId ? `peak_activity_${userId}` : null,
    fetchPeakActivity,
    [userId]
  );

  return { data: data || { daysData: [], hoursData: [] }, isLoading, error };
};
