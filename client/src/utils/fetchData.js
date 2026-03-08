import axiosInstance from "../utils/baseUrl";

// פונקציית עזר פנימית למניעת שגיאת [object Object]
const getSafeId = (idOrObject) => {
  if (typeof idOrObject === 'object' && idOrObject !== null) {
    return idOrObject._id || idOrObject.id;
  }
  return idOrObject;
};

const getAllUsers = async () => {
  const response = await axiosInstance.get("/user/getAllUsers");
  return response.data;
};

const getCategories = async (userIdOrUser) => {
  const userId = getSafeId(userIdOrUser); // חילוץ ה-ID בבטחה
  if (!userId) return [];
  
  try {
    const response = await axiosInstance.get(
      `/category/getCategories/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
};

const getDishes = async (userIdOrUser, categoryId) => {
  const userId = getSafeId(userIdOrUser);
  try {
    const response = await axiosInstance.get(
      `/dish/getDish/${userId}/${categoryId}`
    );
    return response.data || response;
  } catch (error) {
    return error;
  }
};

const getAllDishesAndMapToCategories = async (userIdOrUser, categories) => {
  const userId = getSafeId(userIdOrUser);
  if (!userId) return [];

  try {
    const response = await axiosInstance.get(`/dish/getAllDishes/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const allDishes = response.data;

    const updatedCategories = categories.map((category) => ({
      ...category,
      menuDishes: allDishes.filter((dish) => String(dish.category) === String(category._id)),
    }));

    return updatedCategories;
  } catch (error) {
    console.error("Error in getAllDishesAndMapToCategories:", error);
    return [];
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

const fetchCategoriesAndDishes = async (userIdOrUser) => {
  const userId = getSafeId(userIdOrUser);
  if (!userId) throw new Error("User ID is required");

  try {
    // 1. שליפת קטגוריות
    const categoriesResponse = await axiosInstance.get(
      `/category/getCategories/${userId}`
    );

    if (!categoriesResponse.data) {
      throw new Error("Failed to fetch categories");
    }

    const categories = categoriesResponse.data;
    const dishesMap = {};

    // 2. שליפת כל המנות במכה אחת (הכי יעיל)
    const dishesResponse = await axiosInstance.get(
      `/dish/getAllDishes/${userId}`
    );
    const allDishes = dishesResponse.data || [];

    // 3. מיפוי המנות לקטגוריות בזיכרון
    categories.forEach((category) => {
      dishesMap[category._id] = allDishes.filter(
        (dish) => String(dish.category) === String(category._id)
      );
    });

    return {
      categories,
      dishes: dishesMap,
      lastUpdated: new Date().getTime(),
    };
  } catch (error) {
    console.error("Error fetching categories and dishes:", error);
    throw error;
  }
};

const checkIfUserLoggedIn = async () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const getTopDishes = async (restaurantIdOrUser, period = 'month') => {
  const restaurantId = getSafeId(restaurantIdOrUser);
  try {
    const response = await axiosInstance.get('/analytics/top-dishes', {
      params: { restaurantId, period }
    });
    return response.data;
  } catch (error) {
    console.error('Error in getTopDishes:', error);
    return [];
  }
};

const recordMenuView = async (restaurantIdOrUser) => {
  const restaurantId = getSafeId(restaurantIdOrUser);
  try {
    await axiosInstance.post("/analytics/menu-view", { restaurantId });
  } catch (error) {
    console.error("Error regarding menu view:", error);
  }
};

const getMenuStats = async (restaurantIdOrUser, days = 30) => {
  const restaurantId = getSafeId(restaurantIdOrUser);
  try {
    const response = await axiosInstance.get("/analytics/menu-views", {
      params: { restaurantId, days },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching menu stats:", error);
    return [];
  }
};

const fetchQrScanCount = async (userIdOrUser) => {
  const userId = getSafeId(userIdOrUser);
  try {
    const response = await axiosInstance.get(`/user/qr-scan-count/${userId}`);
    return response.data.totalQrScans;
  } catch (error) {
    console.error('Error fetching QR scan count:', error);
    return null;
  }
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
  getTopDishes,
  recordMenuView,
  getMenuStats,
  fetchQrScanCount,
};