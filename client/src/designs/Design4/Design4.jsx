import { useEffect, useState } from "react";
import {
  getCategories,
  getRestaurantName,
  fetchRestaurant,
  fetchCategoriesAndDishes,
} from "@/utils/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import Allergies from "@/components/sensitivities/Allergies";
import { motion } from "framer-motion";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";

const Design4 = () => {
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

  const location = useLocation();
  const navigate = useNavigate();
  const menu = location.state || {};

  useEffect(() => {
    const name = getRestaurantName(menu);
    setRestaurantName(name);
  }, [menu]);

  useEffect(() => {
    if (!restaurantName) return;

    const loadData = async () => {
      // const localCategories = localStorage.getItem("categories");
      // if (localCategories) {
      //   try {
      //     const parsed = JSON.parse(localCategories);
      //     if (Array.isArray(parsed)) {
      //       // מיין לפי locationNumber
      //       const sortedCategories = parsed.sort(
      //         (a, b) => a.locationNumber - b.locationNumber
      //       );
      //       setCategories(sortedCategories);
      //       setSelectedCategory(sortedCategories[0]);
      //       return;
      //     }
      //   } catch (e) {
      //     console.error("Failed to parse local categories:", e);
      //   }
      // }
      await fetchData();
    };

    loadData();
  }, [restaurantName]);

  const fetchData = async () => {
    try {
      const data = await fetchRestaurant(restaurantName);
      setRestaurantData(data);

      const { categories, dishes } = await fetchCategoriesAndDishes(data._id);

      const categoriesWithDishes = categories.map((cat) => ({
        ...cat,
        menuDishes: dishes[cat._id] || [],
      }));

      // מיין לפי locationNumber
      const sortedCategories = categoriesWithDishes.sort(
        (a, b) => a.locationNumber - b.locationNumber
      );

      setCategories(sortedCategories);
      setSelectedCategory(sortedCategories[0]);

      localStorage.setItem("categories", JSON.stringify(sortedCategories));
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
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
    <div dir="rtl" className="min-h-screen overflow-x-hidden">
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
            .filter((cat) => !cat.hide)
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
        {dishesToShow.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10 text-lg">
            אין מנות להצגה
          </div>
        ) : (
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
                <p className="text-sm font-semibold truncate">{dish.name}</p>
                <p className="text-sm font-light truncate">
                  {dish.description}
                </p>
                <p className="p-1 text-gray-600">
                  <Allergies dish={dish} />
                </p>
                <p className="text-sm text-left text-gray-600">
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
