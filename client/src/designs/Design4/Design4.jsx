import { useEffect, useState } from "react";
import {
  getCategories,
  getRestaurantName,
  fetchRestaurant,
  fetchCategoriesAndDishes,
} from "@/utils/fetchData";
import { isCategoryActive } from "@/utils/isCategoryActive";
import { useLocation, useNavigate } from "react-router-dom";
import Allergies from "@/components/sensitivities/Allergies";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";

import useTrackMenuView from "@/hooks/useTrackMenuView";

const Design4 = ({ menu: menuProp }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("הכל");
  const [filters] = useState([
    "הכל",
    "צמחוני",
    "ללא גלוטן",
    "ללא לקטוז",
    "מתאים להריון",
  ]);

  // 💡 מצב חדש לניהול טעינה
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  
  const menu = menuProp || location.state || {};

  useTrackMenuView(restaurantData?._id || menu?._id);

  useEffect(() => {
    const name = getRestaurantName(menu);
    setRestaurantName(name);
  }, [menu]);

  useEffect(() => {
    if (!restaurantName) return;

    const loadData = async () => {
      // 💡 נסה לטעון מה-localStorage קודם
      const cachedData = localStorage.getItem(`menu_${restaurantName}`);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setRestaurantData(parsedData.restaurantData);
          setCategories(parsedData.categories);
          if (parsedData.categories.length > 0) {
            setSelectedCategory(parsedData.categories[0]);
          }
          setIsLoading(false); // הצג מיד את הנתונים מהקאש
        } catch (e) {
          console.error("Error parsing cached menu data", e);
        }
      }

      await fetchData();
    };

    loadData();
  }, [restaurantName]);

  const fetchData = async () => {
    // רק אם אין לנו כבר קטגוריות (מהקאש), נציג טעינה
    if (categories.length === 0) setIsLoading(true);
    try {
      const data = await fetchRestaurant(restaurantName);
      setRestaurantData(data);

      const { categories, dishes } = await fetchCategoriesAndDishes(data._id);

      const categoriesWithDishes = categories
        .filter((cat) => !cat.hide && isCategoryActive(cat))
        .map((cat) => ({
          ...cat,
          menuDishes: dishes[cat._id] || [],
        }));

      // מיין לפי locationNumber
      const sortedCategories = categoriesWithDishes.sort(
        (a, b) => a.locationNumber - b.locationNumber
      );

      setCategories(sortedCategories);

      // Update selectedCategory to point to the new object with fresh dishes
      if (selectedCategory) {
        const freshSelected = sortedCategories.find(c => c._id === selectedCategory._id);
        setSelectedCategory(freshSelected || sortedCategories[0]);
      } else {
        setSelectedCategory(sortedCategories[0]);
      }

      // שמור את הנתונים ב-localStorage עם מפתח ייחודי למסעדה
      localStorage.setItem(
        `menu_${restaurantName}`,
        JSON.stringify({
          restaurantData: data,
          categories: sortedCategories,
        })
      );
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setIsLoading(false); // 💡 מסיימים טעינה
    }
  };

  const filterDishes = (dish) => {
    switch (selectedFilter) {
      case "צמחוני":
        return dish.vegi;
      case "ללא גלוטן":
        return dish.gluten;
      case "ללא לקטוז":
        return dish.lactose;
      case "מתאים להריון":
        return dish.pregnant;
      default:
        return true;
    }
  };

  const dishesToShow =
    selectedCategory?.menuDishes?.filter(
      (dish) => !dish.hide && filterDishes(dish)
    ) || [];

  return (
    <div className="min-h-screen overflow-x-hidden" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-lg ">
        <div className="flex justify-between items-center py-5 px-4">
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <span className="text-3xl ms-14">🛎️</span>
            {restaurantData?.displayName ||
              JSON.parse(localStorage.getItem("user"))?.displayName ||
              restaurantName}
          </h1>
        </div>

        {/* Categories */}
        <div
          className="flex overflow-x-auto max-w-full ms-2 px-4 py-2 mb-3 gap-5 scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            overflowY: "hidden",
            maxWidth: "95vw",
          }}
        >
          {categories
            .sort((a, b) => a.locationNumber - b.locationNumber)
            .map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex flex-col items-center min-w-[88px] p-3 rounded-xl transition-all snap-start ${
                  selectedCategory?._id === cat._id
                    ? "bg-zinc-200 text-black"
                    : "bg-white border shadow-md text-gray-500"
                } shadow-sm`}
                style={{ flexShrink: 0 }}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-xs font-medium text-center">
                  {cat.name}
                </span>
              </button>
            ))}
        </div>

        {/* Filters */}
        <div className="flex justify-center overflow-x-auto bg-gray-200 p-2 shadow-lg gap-2 mb-5">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`p-2 rounded-full text-sm border font-medium transition ${
                selectedFilter === filter
                  ? "bg-black text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes */}
      <div className="grid mt-10 pb-28 px-4 max-w-6xl mx-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? ( // 💡 בדיקה 1: האם הנתונים עדיין נטענים?
          <div className="col-span-full text-center text-gray-500 py-10 text-lg">
            <Spinner />
          </div>
        ) : dishesToShow.length === 0 ? ( // 💡 בדיקה 2: הסתיימה הטעינה, אבל המערך ריק (בגלל סינון או חוסר מנות בקטגוריה)?
          <div className="col-span-full text-center text-gray-500 py-10 text-lg">
            אין מנות להצגה בקטגוריה זו או בהתאם לפילטר שנבחר.
          </div>
        ) : (
          // 💡 תצוגת המנות
          dishesToShow.map((dish, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/design4DishDetails/`, { state: { dish } })
              }
              className="bg-gray-100 rounded-xl overflow-hidden relative hover:shadow-lg transition"
            >
              <motion.img
                src={dish.img}
                alt={dish.name}
                className="w-full h-32 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="p-3">
                <p className="text-sm font-semibold truncate">
                  {dish.name}
                </p>
                <p className="text-sm font-light truncate">
                    {dish.description}
                </p>
                <p className="p-1 text-gray-600">
                  <Allergies dish={dish} />
                </p>
                <p className="text-sm text-gray-600">
                  ₪ {dish.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Design4;
