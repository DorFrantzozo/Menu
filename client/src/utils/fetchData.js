import { error } from "console";
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

const getAllDishesAndMapToCategories = async (user, categories) => {
  try {
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        const response = await axiosInstance.get(
          `/dish/getDish/${user._id}/${category._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        return {
          ...category,
          menuDishes: response.data,
        };
      })
    );

    return updatedCategories;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return error;
  }
};

const getRestaurantName = (menu) => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const restaurantNameFromSubdomain = parts.length >= 3 ? parts[0] : null;
  const restaurantNameFromState = menu?.restaurantName?.toLowerCase();

  return restaurantNameFromState || restaurantNameFromSubdomain || null;
};

const fetchRestaurant = async (restaurantName) => {
  try {
    const res = await axiosInstance.get(`/user/find?name=${restaurantName}`);
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    return "שגיאה: " + error.message;
  }
};

export {
  getAllUsers,
  getCategories,
  getAllDishesAndMapToCategories,
  getRestaurantName,
  fetchRestaurant,
};
