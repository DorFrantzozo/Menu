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
  return response.data;
};

export default updatePaidStatus;
