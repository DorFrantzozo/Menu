import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  fetchRestaurant,
  getCategories,
  getDishes,
  getRestaurantName,
} from "@/utils/fetchData";

const filters = ["הכל", "צמחוני", "ללא לקטוז", "ללא גלוטן"];

const Design4 = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("הכל");
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [restaurantName, setRestaurantName] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const location = useLocation();

  // קבלת שם המסעדה מה-localStorage כברירת מחדל
  useEffect(() => {
    const nameFromStorage = localStorage.getItem("restaurantName");
    if (nameFromStorage) {
      setRestaurantName(nameFromStorage);
    } else {
      const name = getRestaurantName(location.state || {});
      if (name) {
        setRestaurantName(name);
        localStorage.setItem("restaurantName", name);
      }
    }
  }, [location.state]);

  // שליפת קטגוריות ומנות
  useEffect(() => {
    if (!restaurantName) return;

    const fetchData = async () => {
      try {
        const restaurant = await fetchRestaurant(restaurantName);
        const fetchedCategories = await getCategories(restaurant._id);
        setCategories(fetchedCategories);

        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0]);
          const dishes = await getDishes(
            restaurant._id,
            fetchedCategories[0]._id
          );
          setDishes(dishes);
        }
      } catch (error) {
        console.log("Error fetching restaurant data:", error);
      }
    };

    fetchData();
  }, [restaurantName]);

  // שליפת מנות לפי קטגוריה
  useEffect(() => {
    const fetchDishesByCategory = async () => {
      if (!selectedCategory || !restaurantName) return;

      try {
        const restaurant = await fetchRestaurant(restaurantName);
        const dishes = await getDishes(restaurant._id, selectedCategory._id);
        setDishes(dishes);
      } catch (error) {
        console.error("Error fetching dishes by category:", error);
      }
    };

    fetchDishesByCategory();
  }, [selectedCategory]);

  return (
    <div dir="rtl" className="min-h-screen  ">
      {/* Header */}
      <div className="flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold text-green-600 flex items-center gap-1">
          <span className="text-3xl">🍜</span>
          {restaurantName}
        </h1>
      </div>

      {/* Category Buttons */}
      <div className="flex justify-center gap-2  overflow-x-auto space-x-4 py-2 mb-3 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat)}
            className={`flex flex-col  items-center min-w-[64px] px-3 py-2 rounded-xl transition-all ${
              selectedCategory?._id === cat._id
                ? "bg-zinc-200 text-black"
                : "bg-white text-gray-500"
            } shadow-sm`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-xs font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center bg-gray-200 p-2   shadow-lg  flex-wrap gap-2 mb-5">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm border font-medium transition ${
              selectedFilter === filter
                ? "bg-black text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Dishes */}
      <div className="grid pb-28 px-4 max-w-6xl mx-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {dishes
          .filter((dish) =>
            selectedFilter === "הכל"
              ? true
              : dish.name.toLowerCase().includes(selectedFilter.toLowerCase())
          )
          .map((dish, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden relative hover:shadow-lg transition"
            >
              <img
                src={dish.img}
                alt={dish.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                <Heart size={16} className="text-gray-500" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold truncate">{dish.name}</p>
                <p className="text-sm text-gray-600">{dish.price}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Cart Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-5 py-4 flex justify-between items-center text-sm md:text-base rounded-t-2xl shadow-lg">
        <span>{selectedDishes.length} dishes awaiting ordering</span>
        <ShoppingCart size={22} />
      </div>
    </div>
  );
};

export default Design4;
