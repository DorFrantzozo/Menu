import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Allergies from "../../components/sensitivities/Allergies";
import IconDescription from "../../components/sensitivities/IconDescription";
import axiosInstance from "@/utils/baseUrl";

const Design2 = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState({});
  const location = useLocation();

  // משתנים לשם המסעדה שמגיע מהדומיין או מה-state של React Router
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  let restaurantName = parts.length >= 2 ? parts[0].toLowerCase() : null; // מוודאים ששם המסעדה קטן

  // פונקציה לשחזור שם מסעדה מה-state
  const handleNoRestaurantNameInUrl = async () => {
    const name = location.state?.restaurantName?.toLowerCase();
    console.log(name);
    if (name) {
      restaurantName = name;
    }
    try {
      const res = await axiosInstance.get(`user/find?name=${restaurantName}`);
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

  // פונקציה להורדת קטגוריות
  const fetchCategories = async (userId) => {
    if (!userId) return;
    try {
      const response = await axiosInstance.post(`/category/getCategories`, {
        userId,
      });
      if (response.data) {
        setCategories(response.data);
        response.data.forEach((category) => {
          fetchDishes(userId, category._id);
        });
      } else {
        toast.error("טעינת הקטגוריות נכשלה");
      }
    } catch (error) {
      toast.error("שגיאה בטעינת הקטגוריות: " + error.message);
    }
  };

  // פונקציה להורדת מנות
  const fetchDishes = async (userId, categoryId) => {
    try {
      const response = await axiosInstance.get(
        `/dish/getDish/${userId}/${categoryId}`
      );
      if (response.data) {
        setDishes((prevDishes) => ({
          ...prevDishes,
          [categoryId]: response.data,
        }));
      } else {
        toast.error("לא נמצאו מנות");
      }
    } catch (error) {
      toast.error("שגיאה בטעינת המנות: " + error.message);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (!restaurantName) {
          await handleNoRestaurantNameInUrl(); // אם לא נמצא שם בדומיין, נקרא לפונקציה כדי לבדוק ב-state
        } else {
          const res = await axiosInstance.get(
            `/user/find?name=${restaurantName}`
          );
          if (res.data) {
            setRestaurant(res.data);
            fetchCategories(res.data._id);
          } else {
            toast.error("מסעדה לא נמצאה");
          }
        }
      } catch (error) {
        toast.error("שגיאה: " + error.message);
      }
    };
    fetchRestaurant();
  }, [restaurantName]); // התלות היא על restaurantName

  return (
    <div className="flex justify-center">
      {!restaurant ? (
        <Spinner />
      ) : (
        <div className="min-h-screen flex flex-col p-6">
          <h1 className="text-4xl mb-10 font-bold text-center text-gray-800">
            {restaurant.restaurantName}
          </h1>
          <hr className="style-seven" />
          <div className="mt-10 w-full">
            {categories
              .sort((a, b) => a.locationNumber - b.locationNumber)
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
                            <p className="font-semibold text-gray-800 ms-2">
                              {dish.price}₪
                            </p>
                            <p className="whitespace-normal ms-10 break-words text-right text-sm sm:text-base md:text-lg lg:text-xl">
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
