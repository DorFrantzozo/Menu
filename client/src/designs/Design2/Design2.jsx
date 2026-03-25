import React, { useEffect, useState } from "react";
import useTrackMenuView from "@/hooks/useTrackMenuView";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Allergies from "../../components/sensitivities/Allergies";
import IconDescription from "../../components/sensitivities/IconDescription";
import axiosInstance from "@/utils/baseUrl";
import { fetchCategoriesAndDishes } from "@/utils/fetchData";
import { isCategoryActive } from "@/utils/isCategoryActive";
import { useNavigate } from "react-router-dom";

const Design2 = ({ menu: menuProp }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState({});
  const [restaurantName, setRestaurantName] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const menu = menuProp || location.state || {};

  // ✅ תיקון: שימוש ב-restaurant במקום restaurantData שלא קיים
  // ושימוש ב-ID מה-menu כגיבוי עד שהמסעדה נטענת
  const trackId = restaurant?._id || menu?._id;
  useTrackMenuView(trackId);

  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const restaurantNameFromSubdomain = parts.length >= 3 ? parts[0] : null;
  const restaurantNameFromState = menu?.restaurantName?.toLowerCase();

  useEffect(() => {
    if (restaurantNameFromState) {
      setRestaurantName(restaurantNameFromState);
    } else if (restaurantNameFromSubdomain) {
      setRestaurantName(restaurantNameFromSubdomain);
    }
  }, [restaurantNameFromState, restaurantNameFromSubdomain]);

  useEffect(() => {
    if (restaurantName) {
      const fetchRestaurant = async () => {
        try {
          const res = await axiosInstance.get(
            `/user/find?name=${restaurantName}`
          );
          if (res.data) {
            setRestaurant(res.data);
            // ✅ וידוא ששולחים רק את ה-ID (סטרינג) ולא את האובייקט
            fetchCategories(res.data._id);
          } else {
            toast.error("מסעדה לא נמצאה");
          }
        } catch (error) {
          toast.error("שגיאה: " + error.message);
        }
      };
      fetchRestaurant();
    }
  }, [restaurantName]);

  const fetchCategories = async (userId) => {
    // ✅ הגנה: אם userId הוא אובייקט בטעות, נחלץ את ה-ID
    const cleanId = typeof userId === 'object' ? userId._id : userId;
    if (!cleanId) return;

    try {
      const { categories, dishes } = await fetchCategoriesAndDishes(cleanId);
      setCategories(categories);
      setDishes(dishes);
    } catch (error) {
      toast.error("שגיאה בטעינת התפריט: " + error.message);
    }
  };

  return (
    <div className="flex justify-center">
      {!restaurant ? (
        <Spinner />
      ) : (
        <div className="min-h-screen flex flex-col p-6">
          <h1 className="text-4xl mb-10 font-bold text-center text-gray-800">
            {restaurant?.displayName}
          </h1>
          <hr className="style-seven" />
          <div className="mt-10 w-full">
            {categories
              .sort((a, b) => a.locationNumber - b.locationNumber)
              .filter((category) => !category.hide && isCategoryActive(category))
              .map((category) => (
                <div key={category._id} className="mb-6">
                  <h2 className="text-2xl font-semibold flex justify-center text-gray-700 border-b pb-2 mb-4">
                    {category.name}
                  </h2>
                  <div>
                    {dishes[category._id] &&
                      dishes[category._id].map((dish) => (
                        <div key={dish._id} className="p-4 w-full">
                          <div className="flex justify-between items-center">
                            <Allergies dish={dish} />
                            <h3 className="text-lg font-semibold text-gray-700 text-wrap">
                              {dish.name}
                            </h3>
                          </div>

                          <div className="flex justify-between text-gray-600 text-sm mt-2">
                            <div className="flex items-center gap-2 ms-2">
                              {dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price ? (
                                <>
                                  <p className="font-bold text-emerald-600 text-lg">{dish.salePrice}₪</p>
                                  <p className="font-semibold text-red-500 line-through opacity-70 text-sm">{dish.price}₪</p>
                                </>
                              ) : (
                                <p className="font-semibold text-gray-800">
                                  {dish.price}₪
                                </p>
                              )}
                            </div>
                            <p className="whitespace-normal break-words text-sm sm:text-base md:text-lg lg:text-xl text-right ms-10">
                                {dish.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-auto">
            <IconDescription />
          </div>
        </div>
      )}
    </div>
  );
};

export default Design2;