import axiosInstance from "../utils/baseUrl";

const getAllUsers = async () => {
  const response = await axiosInstance.get("/user/getAllUsers");
  return response.data;
};

const getCategories = async (userId) => {
  try {
    const response = await axiosInstance.post(
      "/category/getCategories",
      { userId: userId },
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
const getDishes = async (userId, categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/dish/getDish/${userId}/${categoryId}`
    );
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
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
    console.log("Error fetching dishes:", error);
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
    return error;
  }
};

// new function for getting categories and dishes
const fetchCategoriesAndDishes = async (userId) => {
  try {
    // Fetch categories from server
    const categoriesResponse = await axiosInstance.post(
      `/category/getCategories`,
      {
        userId,
      }
    );

    if (!categoriesResponse.data) {
      throw new Error("Failed to fetch categories");
    }

    const categories = categoriesResponse.data;
    const dishesMap = {};

    // Fetch dishes for each category
    await Promise.all(
      categories.map(async (category) => {
        const dishesResponse = await axiosInstance.get(
          `/dish/getDish/${userId}/${category._id}`
        );
        dishesMap[category._id] = dishesResponse.data || [];
      })
    );

    return {
      categories,
      dishes: dishesMap,
      lastUpdated: new Date().getTime(), // Add timestamp for reference
    };
  } catch (error) {
    console.error("Error fetching categories and dishes:", error);
    throw error;
  }
};

const checkIfUserLoggedIn = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  return true;
};

export {
  getAllUsers,
  getCategories,
  getAllDishesAndMapToCategories,
  getRestaurantName,
  fetchRestaurant,
  getDishes,
  fetchCategoriesAndDishes,
  checkIfUserLoggedIn,
};
