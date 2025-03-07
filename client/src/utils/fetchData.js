import axios from "axios";
import axiosInstance from "../utils/baseUrl";
const getAllUsers = async () => {
  const response = await axiosInstance.get("/user/getAllUsers");
  return response.data;
};

export { getAllUsers };
