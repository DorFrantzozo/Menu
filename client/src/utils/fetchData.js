import axios from "axios";

const getAllUsers = async () => {
  const response = await axios.get(
    "http://localhost:8000/api/user/getAllUsers"
  );
  return response.data;
};

export { getAllUsers };
