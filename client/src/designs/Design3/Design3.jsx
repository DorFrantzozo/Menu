import { useState, useEffect } from "react";
// ✅ תיקון: הוספת useNavigate לייבוא
import { useLocation, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Design3Accordion from "./Design3Accordion";
import useTrackMenuView from "@/hooks/useTrackMenuView";

import {
  fetchCategoriesAndDishes,
  fetchRestaurant,
  getRestaurantName,
} from "@/utils/fetchData";
import { isCategoryActive } from "@/utils/isCategoryActive";
import FloatingLanguageSelector from "../../components/LanguageSelector/FloatingLanguageSelector";
import { useLanguage } from "../../context/LanguageContext";

const Design3 = ({ menu: menuProp }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState({});
  const [restaurantName, setRestaurantName] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ עכשיו זה יעבוד כי הייבוא תוקן
  const { language } = useLanguage();
  
  const menu = menuProp || location.state || {};

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // מעקב צפיות - משתמש ב-ID בבטחה
  useTrackMenuView(restaurantData?._id || menu?._id);

  const fetchMenuData = async (restaurantId) => {
    try {
      // ✅ שימוש ב-ID נקי כדי למנוע שגיאת [object Object]
      const { categories, dishes } = await fetchCategoriesAndDishes(restaurantId);
      setCategories(categories.filter((cat) => !cat.hide && isCategoryActive(cat)));
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
          const data = await fetchRestaurant(restaurantName);
          setRestaurantData(data);

          if (data) {
            await fetchMenuData(data._id);
            setRestaurant(data);
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
    <>
      <style>{`
        /* Import Premium Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Montserrat:wght@300;400;500&family=Heebo:wght@300;400;500&display=swap');
      `}</style>
      <div 
        className="flex justify-center w-full min-h-screen text-[#f5f5f5] font-['Montserrat',_sans-serif] bg-[#0c0c0e]"
        style={{ backgroundImage: "radial-gradient(circle at top center, #16161a 0%, #0c0c0e 80%)" }}
        dir={language === "en" ? "ltr" : "rtl"}
      >
        <div className="flex flex-col w-full max-w-2xl py-12 px-4 sm:px-6">
          {restaurantName && (
            <div className="flex flex-col items-center mb-6 w-full">
              <h1 className="text-4xl text-center font-['Playfair_Display',_serif] text-[#E5D3C5] font-normal tracking-[0.08em] uppercase mb-2 drop-shadow-[0_2px_10px_rgba(229,211,197,0.15)]">
                {restaurantName}
              </h1>
              {restaurant?.menuDescription && (
                <p className="text-center text-[#E5D3C5] opacity-80 text-sm mt-1 mb-2 whitespace-pre-wrap">
                  {restaurant.menuDescription}
                </p>
              )}
              {/* HR below main title */}
              <div className="w-full h-[1px] bg-white/15 mt-2 mb-2"></div>
            </div>
          )}

          <div className="w-full mx-auto">
            <Design3Accordion
              categories={categories}
              dishes={dishes}
            />
          </div>
        </div>
        <FloatingLanguageSelector />
      </div>
    </>
  );
};

export default Design3;
