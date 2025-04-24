import { useEffect, useState } from "react";
import {
  getCategories,
  getRestaurantName,
  fetchRestaurant,
} from "@/utils/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import Allergies from "@/components/sensitivities/Allergies";
import { motion } from "framer-motion";

const Design4 = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("הכל");
  const [dishes, setDishes] = useState([]);
  // const [selectedDishes, setSelectedDishes] = useState([]);
  const [filters] = useState([
    "הכל",
    "צמחוני",
    "ללא גלוטן",
    "ללא לקטוז",
    "מתאים להריון",
  ]);
  const location = useLocation();
  const menu = location.state || {};
  const navigate = useNavigate();
  useEffect(() => {
    const name = getRestaurantName(menu);
    setRestaurantName(name);
    const localCategories = localStorage.getItem("categories");
    if (localCategories) {
      const parsed = JSON.parse(localCategories);
      setCategories(parsed);
      setSelectedCategory(parsed[0]);
      const allDishes = parsed.flatMap((cat) => cat.menuDishes || []);
      setDishes(allDishes);
    } else {
      fetchData();
    }
  }, [restaurantName]);

  const fetchData = async () => {
    try {
      console.log(restaurantName);
      const data = await fetchRestaurant(restaurantName);
      console.log(data);
      setRestaurantData(data);
      const fetchedCategories = await getCategories(data._id);
      if (Array.isArray(fetchedCategories)) {
        setCategories(fetchedCategories);
        setSelectedCategory(fetchedCategories[0]);
        const allDishes = fetchedCategories.flatMap(
          (cat) => cat.menuDishes || []
        );
        setDishes(allDishes);
      } else {
        console.error("Categories fetched are not an array");
      }
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

  return (
    <div dir="rtl" className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold text-black flex items-center gap-1">
          <span className="text-3xl">🍜</span>
          {restaurantName}
        </h1>
      </div>

      <div
        className="flex overflow-x-auto max-w-full ms-2 px-4 py-2 mb-3 gap-5 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories &&
          categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex flex-col items-center shadow-lg  min-w-[64px] px-10 py-4 rounded-xl transition-all snap-start ${
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
      <div className="flex justify-center   overflow-x-auto  bg-gray-200 p-2 shadow-lg gap-2 mb-5">
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

      {/* Dishes */}
      <div className="grid mt-10 pb-28 px-4 max-w-6xl mx-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {selectedCategory?.menuDishes?.filter(filterDishes).length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10 text-lg">
            אין מנות להצגה
          </div>
        ) : (
          selectedCategory?.menuDishes
            ?.filter(filterDishes)
            .map((dish, index) => (
              <div
                key={index}
                onClick={() =>
                  navigate(`/design4DishDetails/`, {
                    state: { dish },
                  })
                }
                className="bg-gray-100 rounded-xl  overflow-hidden relative hover:shadow-lg transition"
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
                  <p className=" p-1 text-gray-600">
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
