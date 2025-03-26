import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import AccordionMenu from "@/components/data/AccordionMenu";

import {
  fetchCategoriesAndDishes,
  fetchRestaurant,
  getRestaurantName,
} from "@/utils/fetchData";

const Design3 = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState({});
  const [restaurantName, setRestaurantName] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const location = useLocation();
  const menu = location.state || {};

  const fetchMenuData = async (restaurantId) => {
    try {
      // Always fetch fresh data from server
      const { categories, dishes } =
        await fetchCategoriesAndDishes(restaurantId);
      setCategories(categories);
      setDishes(dishes);
    } catch (error) {
      toast.error("שגיאה בטעינת התפריט: " + error.message);
    }
  };

  useEffect(() => {
    const name = getRestaurantName(menu);
    if (name) {
      setRestaurantName(name);
    }
  }, [menu]);

  useEffect(() => {
    if (restaurantName) {
      const fetchData = async () => {
        try {
          const restaurantData = await fetchRestaurant(restaurantName);
          setRestaurantData(restaurantData);

          if (restaurantData) {
            setRestaurant(restaurantData);
            await fetchMenuData(restaurantData._id);
          } else {
            toast.error("מסעדה לא נמצאה");
          }
        } catch (error) {
          toast.error("שגיאה: " + error.message);
        }
      };
      fetchData();
    }
  }, [restaurantName]);

  if (!restaurant) {
    return <Spinner />;
  }

  return (
    <div
      className="flex justify-center min-h-screen w-full"
      style={{
        background: "linear-gradient(to bottom, #000000, #1a1a1a)",
      }}
    >
      <div className="flex flex-col w-full max-w-2xl py-4">
        <div className="flex justify-center">
          <img
            src={restaurantData.logo}
            className="w-[200px] rounded shadow-lg"
            alt="restaurant logo"
          />
        </div>

        <div className="mt-6 w-[80%] mx-auto">
          <AccordionMenu
            categories={categories}
            dishes={dishes}
            textColor="white"
          />
        </div>
      </div>
    </div>
  );
};

export default Design3;
