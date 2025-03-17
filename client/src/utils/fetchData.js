import axiosInstance from "../utils/baseUrl";

const getAllUsers = async () => {
  const response = await axiosInstance.get("/user/getAllUsers");
  return response.data;
};

const getCategories = async (user) => {
  try {
    const response = await axiosInstance.post(
      "/category/getCategories",
      { userId: user._id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
   
    return response.data;
  } catch (error) {
    return error;
  }
};

export { getAllUsers, getCategories };
