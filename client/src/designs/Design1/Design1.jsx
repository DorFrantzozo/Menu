import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/baseUrl";
import Spinner from "@/components/Spinner";

const Design1 = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [restaurantName, setRestaurantName] = useState(null); // ניהול שם המסעדה כסטייט
  const navigate = useNavigate();
  const location = useLocation();
  const menu = location.state || {};
  const restaurantNameFromState = menu?.restaurantName?.toLowerCase();

  // חילוץ הסאב-דומיין אם יש
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const restaurantNameFromSubdomain = parts.length >= 3 ? parts[0] : null;

  useEffect(() => {
    try {
      if (menu?.restaurantName) {
        setRestaurantName(menu?.restaurantName?.toLowerCase());
      } else if (restaurantNameFromSubdomain) {
        setRestaurantName(restaurantNameFromSubdomain);
      }
    } catch (error) {
      console.log(error);
    }
  }, [restaurantNameFromSubdomain, restaurantNameFromState]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosInstance.get(
          `/user/find?name=${restaurantName}`
        );
        if (res.data) {
          setRestaurant(res.data);
          fetchCategories(res.data._id);
        } else {
          toast.error("מסעדה לא נמצאה");
        }
      } catch (error) {
        toast.error("שגיאה: " + error.message);
      }
    };

    if (restaurantName) {
      fetchRestaurant();
    }
  }, [restaurantName]); // כל פעם שהשם משתנה, הרץ את הפונקציה

  // פונקציה לטעינת הקטגוריות
  const fetchCategories = async (userId) => {
    if (!userId) return;
    try {
      const response = await axiosInstance.post("/category/getCategories", {
        userId,
      });
      if (response.data) {
        setCategories(response.data);
      } else {
        toast.error("טעינת הקטגוריות נכשלה");
      }
    } catch (error) {
      toast.error("שגיאה בטעינת הקטגוריות: " + error.message);
    }
  };

  return (
    <div>
      {/* כאן תוכל להציג את המידע */}
      {!restaurant ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-gray-50 p-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            {restaurant.restaurantName}
          </h1>
          {/* להציג קטגוריות */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories
              .sort((a, b) => a.locationNumber - b.locationNumber)
              .map((category) => (
                <div
                  key={category._id}
                  className="p-4 rounded-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
                  onClick={() =>
                    navigate(
                      `${encodeURIComponent(category.name)}/dishes/${restaurant._id}/${category._id}`
                    )
                  }
                >
                  <h2 className="text-xl font-semibold text-center text-gray-700">
                    {category.name}
                  </h2>
                  <img
                    src={category.img}
                    className="w-full h-48 object-cover mt-4 rounded-lg"
                    alt={category.name}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Design1;
