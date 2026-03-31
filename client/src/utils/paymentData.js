import axiosInstance from "./baseUrl";

export const fetchPaymentHistory = async (token) => {
  try {
    const response = await axiosInstance.get("/payments/paymentHistory", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
};
