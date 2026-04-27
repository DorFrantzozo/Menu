// frontend/src/utils/insightsApi.js
import axiosInstance from "../utils/baseUrl";

export const fetchActiveInsights = async () => {
  try {
    const response = await axiosInstance.get("/insights");
    return response.data;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

export const dismissInsight = async (insightId) => {
  try {
    const response = await axiosInstance.patch(
      `/insights/${insightId}/dismiss`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error dismissing insight ${insightId}:`, error);
    throw error;
  }
};

export const finishedInsight = async (insightId) => {
  try {
    const response = await axiosInstance.patch(`/insights/${insightId}/done`);
    return response.data;
  } catch (error) {
    console.error(`Error finishing insight ${insightId}:`, error);
    throw error;
  }
};
