import { useState, useEffect } from "react";
import axiosInstance from "@/utils/baseUrl";

export const usePeakActivity = (userId) => {
  const [data, setData] = useState({ daysData: [], hoursData: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPeakActivity = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/analytics/peak-activity/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "שגיאה בטעינת הנתונים");
          console.error("Error fetching peak activity:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPeakActivity();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { data, isLoading, error };
};
