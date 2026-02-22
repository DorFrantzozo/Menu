import React, { useState, useEffect } from "react";
import useTrackMenuView from "@/hooks/useTrackMenuView";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/baseUrl";
import Spinner from "@/components/Spinner";
// ✅ ייבוא הפונקציה המסודרת שיצרנו ב-fetchData
import { getCategories } from "@/utils/fetchData";
import { isCategoryActive } from "@/utils/isCategoryActive";

const Design1 = ({ menu: menuProp }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [restaurantName, setRestaurantName] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const menu = menuProp || location.state || {};

  // ✅ תיקון המעקב - שימוש בסטייט הקיים
  useTrackMenuView(restaurant?._id || menu?._id);

  const restaurantNameFromState = menu?.restaurantName?.toLowerCase();
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const restaurantNameFromSubdomain = parts.length >= 3 ? parts[0] : null;

  useEffect(() => {
    if (menu?.restaurantName) {
      setRestaurantName(menu.restaurantName.toLowerCase());
    } else if (restaurantNameFromSubdomain) {
      setRestaurantName(restaurantNameFromSubdomain);
    }
  }, [restaurantNameFromSubdomain, restaurantNameFromState]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `/user/find?name=${restaurantName}`
        );
        if (res.data) {
          setRestaurant(res.data);
          // ✅ קריאה לפונקציית הטעינה עם ה-ID שחזר
          loadCategories(res.data._id);
        } else {
          toast.error("מסעדה לא נמצאה");
        }
      } catch (error) {
        toast.error("שגיאה: " + error.message);
      }
    };

    if (restaurantName) {
      fetchRestaurantDetails();
    }
  }, [restaurantName]);

  // ✅ פונקציה מעודכנת שמשתמשת ב-GET ובנתיב הנכון
  const loadCategories = async (userId) => {
    if (!userId) return;
    try {
      // משתמשים בפונקציה הגלובלית שסידרנו כדי למנוע כפילויות קוד ובאגים
      const data = await getCategories(userId);
      if (data) {
        setCategories(data);
      } else {
        toast.error("טעינת הקטגוריות נכשלה");
      }
    } catch (error) {
      toast.error("שגיאה בטעינת הקטגוריות: " + error.message);
    }
  };

  return (
    <div>
      {!restaurant ? (
        <Spinner />
      ) : (
        <div className="min-h-screen p-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            {restaurant.displayName || restaurant.restaurantName}
          </h1>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories
              .filter((category) => !category.hide && isCategoryActive(category))
              .sort((a, b) => a.locationNumber - b.locationNumber)
              .map((category) => (
                <div
                  key={category._id}
                  className="p-4 rounded cursor-pointer transform transition-all hover:scale-110 "
                  onClick={() =>
                    navigate(
                      `${encodeURIComponent(category.name)}/dishes/${restaurant._id}/${category._id}`
                    )
                  }
                >
                  <h2 className="text-xl font-semibold text-center text-gray-800">
                    {category.name}
                  </h2>
                  <img
                    src={category.img}
                    className="w-full h-[200px] object-cover mt-4 rounded-lg shadow-md"
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