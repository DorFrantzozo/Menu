import axiosInstance from "./baseUrl";

export const generateMarketingPost = async (platform, format, userText) => {
  try {
    const response = await axiosInstance.post("/marketing/generate", {
      platform,
      format,
      userText
    });

    // Axios automatically parses JSON into response.data
    // Expected to return { success: true, data: ..., creditsLeft: ... }
    return response.data; 
  } catch (error) {
    // Axios throws an error for 4xx/5xx responses. 
    // We extract the custom message from the backend if it exists.
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "שגיאה בחיבור למעבדה");
    }
    throw error;
  }
};
