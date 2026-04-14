import axiosInstance from "../utils/baseUrl";

export const scanMenuImage = async (file) => {
  const formData = new FormData();
  formData.append("menuImage", file);

  const token = localStorage.getItem("token");

  try {
    const response = await axiosInstance.post("/ai/scan-menu", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 45000, // Important: Don't timeout before the backend returns 503
    });

    return response.data;
  } catch (error) {
    // Pass the specific error up so our frontend retry loop can inspect it
    throw error;
  }
};

export const saveFinalMenu = async (payload) => {
  const token = localStorage.getItem("token");
  
  const response = await axiosInstance.post("/ai/save-scanned", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
