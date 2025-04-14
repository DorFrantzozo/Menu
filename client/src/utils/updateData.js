import axiosInstance from "./baseUrl";

const updatePaidStatus = async (userId, isPaid) => {
  const response = await axiosInstance.put(
    `/user/updateUser/${userId}`,
    { isPaid },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data);
  return response.data;
};

const updateMenuSettings = async ({
  userId,
  wifiSsid,
  wifiPassword,
  displayWifi,
}) => {
  try {
    const response = await axiosInstance.put(`/user/updateUserMenuSettings`, {
      userId,
      wifiSsid,
      wifiPassword,
      displayWifi,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating menu settings:", error);
    return error?.response?.data?.message || "Unknown error";
  }
};

export { updatePaidStatus, updateMenuSettings };
