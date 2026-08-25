import {useEffect, useState} from "react";
import {
  getRestaurantName,
  fetchRestaurant,
  fetchCategoriesAndDishes,
} from "@/utils/fetchData";
import {isCategoryActive} from "@/utils/isCategoryActive";
import {toWebP} from "@/utils/cloudinaryUrl";
import {useLocation} from "react-router-dom";
import {motion} from "framer-motion";
import Spinner from "@/components/Spinner";
import useTrackMenuView from "@/hooks/useTrackMenuView";
import DishCardDesign5 from "./DishCardDesign5";
import DishModalDesign5 from "./DishModalDesign5";
import {useLanguage} from "../../context/LanguageContext";
import FloatingLanguageSelector from "../../components/LanguageSelector/FloatingLanguageSelector";
import { design5Config } from "./design5.config";
import { parseMenuData } from "../../utils/menuDataParser";

const Design5 = ({menu: menuProp}) => {
  const {language} = useLanguage();
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState("");
  const [selectedDish, setSelectedDish] = useState(null);

  // Filters & Sorting
  const [selectedFilter, setSelectedFilter] = useState("הכל");
  const [sortOrder, setSortOrder] = useState(""); // "", "asc", "desc"

  const location = useLocation();
  const menu = menuProp || location.state || {};

  // Analytics - track menu view once
  useTrackMenuView(restaurantData?._id || menu?._id);

  const filters = [
    {label: "הכל", value: "all"},
    {label: "צמחוני", value: "vegi"},
    {label: "ללא גלוטן", value: "gluten"},
    {label: "מתאים להריון", value: "pregnant"},
    {label: "ללא לקטוז", value: "lactose"},
  ];

  const sortOptions = [
    {label: "מחיר: מהזול ליקר", value: "asc"},
    {label: "מחיר: מהיקר לזול", value: "desc"},
  ];

  // ─── Get restaurant name ───
  useEffect(() => {
    const name = getRestaurantName(menu);
    setRestaurantName(name);
  }, [menu]);

  // ─── Fetch data ───
  useEffect(() => {
    if (!restaurantName) return;

    const loadData = async () => {
      // Try localStorage cache first
      const cachedData = localStorage.getItem(`menu_${restaurantName}`);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.restaurantData)
            setRestaurantData(parsedData.restaurantData);
          if (parsedData.categories) {
            setCategories(parsedData.categories);
            if (parsedData.categories.length > 0) {
              setSelectedCategory(parsedData.categories[0]);
            }
          }
          if (parsedData.heroImage) setHeroImage(parsedData.heroImage);
          setIsLoading(false);
        } catch (e) {
          console.error("Error parsing cached menu data", e);
        }
      }
      await fetchData();
    };

    loadData();
  }, [restaurantName]);

  const fetchData = async () => {
    if (categories.length === 0) setIsLoading(true);
    try {
      const data = await fetchRestaurant(restaurantName);
      setRestaurantData(data);

      const {categories: cats, dishes} = await fetchCategoriesAndDishes(
        data._id,
      );

      const categoriesWithDishes = cats
        .filter((cat) => !cat.hide && isCategoryActive(cat))
        .map((cat) => ({
          ...cat,
          menuDishes: parseMenuData(dishes[cat._id] || [], design5Config.supportsSubCategories),
        }));

      const sortedCategories = categoriesWithDishes.sort(
        (a, b) => a.locationNumber - b.locationNumber,
      );

      setCategories(sortedCategories);

      if (selectedCategory) {
        const freshSelected = sortedCategories.find(
          (c) => c._id === selectedCategory._id,
        );
        setSelectedCategory(freshSelected || sortedCategories[0]);
      } else {
        setSelectedCategory(sortedCategories[0]);
      }

      // Compute hero image from popular dishes or random
      const allDishes = sortedCategories.flatMap((c) => c.menuDishes || []);

      // Preserve existing cache fields if they exist to avoid overwriting them
      let currentHeroImage = "";
      try {
        const cached = JSON.parse(
          localStorage.getItem(`menu_${restaurantName}`) || "{}",
        );
        currentHeroImage = cached.heroImage || "";
      } catch (e) {}

      // Set a fallback image immediately so the banner doesn't wait for getTopDishes
      const fallbackImage = currentHeroImage || allDishes[0]?.img || "";
      setHeroImage(fallbackImage);

      // Save base data to cache immediately
      localStorage.setItem(
        `menu_${restaurantName}`,
        JSON.stringify({
          restaurantData: data,
          categories: sortedCategories,
          heroImage: fallbackImage,
        }),
      );

      // Set hero image if not already set by cache
      if (!currentHeroImage) {
        const randomDish =
          allDishes[Math.floor(Math.random() * allDishes.length)];
        const newHeroImage = randomDish?.img || fallbackImage;
        setHeroImage(newHeroImage);

        localStorage.setItem(
          `menu_${restaurantName}`,
          JSON.stringify({
            restaurantData: data,
            categories: sortedCategories,
            heroImage: newHeroImage,
          }),
        );
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Filter logic ───
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

  // ─── Sort logic ───
  const sortDishes = (dishes) => {
    if (!sortOrder) return dishes;
    return [...dishes].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price,
    );
  };

  const filteredDishes =
    selectedCategory?.menuDishes?.filter(
      (dish) => !dish.hide && filterDishes(dish),
    ) || [];

  const dishesToShow = sortDishes(filteredDishes);

  // ─── Loading state ───
  if (isLoading && !categories.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans w-full overflow-x-hidden"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      {/* ══════════ Hero Section ══════════ */}
      <div className="relative w-full h-60 sm:h-72 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
        {heroImage && (
          <img
            src={toWebP(heroImage)}
            alt="Cover"
            className="w-full h-full object-cover"
            fetchpriority="high"
            loading="eager"
            style={{aspectRatio: "16/9"}}
          />
        )}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 pb-6">
          <motion.h1
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.5, ease: "easeOut"}}
            className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg leading-tight"
          >
            {restaurantData?.displayName || restaurantName}
          </motion.h1>
          <p className="text-white/90 text-sm mt-1 font-medium whitespace-pre-wrap">
            {restaurantData?.menuDescription || "ברוכים הבאים לחוויה קולינרית"}
          </p>
        </div>
      </div>

      {/* ══════════ Sticky Controls ══════════ */}
      <div className="sticky top-0 z-menu-sticky bg-white/95 backdrop-blur-md shadow-sm">
        <div className="lg:max-w-5xl lg:mx-auto">
          {/* Categories Strip */}
          <div
            className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide"
            style={{WebkitOverflowScrolling: "touch"}}
          >
            {categories?.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory?._id === cat._id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {language === "en" && cat.nameEn ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          {/* Filters + Sort Strip */}
          <div
            className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide"
            style={{WebkitOverflowScrolling: "touch"}}
          >
            {/* Filters */}
            {filters?.map((f) => (
              <button
                key={f.value}
                onClick={() => setSelectedFilter(f.label)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  selectedFilter === f.label
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}

            {/* Separator */}
            <div className="flex-shrink-0 w-px bg-slate-200 mx-1"></div>

            {/* Sort */}
            {sortOptions?.map((s) => (
              <button
                key={s.value}
                onClick={() =>
                  setSortOrder(sortOrder === s.value ? "" : s.value)
                }
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  sortOrder === s.value
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ Section Title ══════════ */}
      <div
        className={`flex items-center justify-between px-4 pt-4 pb-2 lg:max-w-5xl lg:mx-auto ${language === "en" ? "flex-row-reverse" : ""}`}
      >
        <h2 className="text-lg font-bold text-slate-900">
          {selectedCategory
            ? language === "en" && selectedCategory.nameEn
              ? selectedCategory.nameEn
              : selectedCategory.name
            : language === "en"
              ? "All Dishes"
              : "כל המנות"}
        </h2>
      </div>

      {/* ══════════ Dish Grid ══════════ */}
      <div className="px-4 pb-24 lg:max-w-5xl lg:mx-auto">
        {dishesToShow.length === 0 ? (
          <div className="text-center text-slate-400 py-16 text-sm">
            אין מנות להצגה בקטגוריה זו
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {dishesToShow?.map((dish) => (
              <DishCardDesign5
                key={dish._id}
                dish={dish}
                onClick={() => setSelectedDish(dish)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════ Dish Modal ══════════ */}
      <DishModalDesign5
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
      />
      <FloatingLanguageSelector />
    </div>
  );
};

export default Design5;
