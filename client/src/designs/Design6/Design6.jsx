import React, { useState, useEffect, useRef } from "react";
import useTrackMenuView from "@/hooks/useTrackMenuView";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/baseUrl";
import Spinner from "@/components/Spinner";
import { fetchCategoriesAndDishes } from "@/utils/fetchData";
import { isCategoryActive } from "@/utils/isCategoryActive";
import { useLanguage } from "../../context/LanguageContext";
import FloatingLanguageSelector from "../../components/LanguageSelector/FloatingLanguageSelector";

import CategoryFilter from "./components/CategoryFilter";
import FoodCard from "./components/FoodCard";
import DishModal from "./components/DishModal";

const Design6Section = ({ category, catIndex, dishes, language, getVariant, sectionRefs, onCardClick }) => {
  const scrollRef = useRef(null);
  
  if (dishes.length === 0) return null;
  
  const variant = getVariant(catIndex);
  const categoryName = language === "en" && category.nameEn ? category.nameEn : category.name;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction * 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id={`section-${category._id}`}
      ref={(el) => sectionRefs.current[category._id] = el}
      className="mb-14 relative group animate-in fade-in duration-700"
    >
      <div className="flex justify-between items-end mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-[#00C38B] pr-3 leading-none">
          {categoryName}
        </h2>
        
        <div className="hidden md:flex items-center space-x-3 space-x-reverse">
          <button 
            onClick={() => scroll(500)}
            className="w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-[#00C38B]/30 transition-all duration-300 group/btn"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover/btn:text-[#00C38B] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button 
            onClick={() => scroll(-500)}
            className="w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-[#00C38B]/30 transition-all duration-300 group/btn"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover/btn:text-[#00C38B] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex flex-nowrap overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar scroll-ps-4 px-2"
      >
        {dishes.map((dish) => (
          <FoodCard key={dish._id} dish={dish} variant={variant} onClick={onCardClick} />
        ))}
        <div className="flex-shrink-0 w-16" />
      </div>
    </section>
  );
};

const Design6 = ({ menu: menuProp }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishesMap, setDishesMap] = useState({});
  const [restaurantName, setRestaurantName] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const location = useLocation();
  const { language } = useLanguage();
  const menu = menuProp || location.state || {};
  const sectionRefs = useRef({});

  useTrackMenuView(restaurant?._id || menu?._id);

  useEffect(() => {
    if (menuProp) {
      setRestaurant(menuProp.user);
      setCategories(menuProp.categories);
      setDishesMap(menuProp.dishesMap);
    } else {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      const name = parts.length >= 3 ? parts[0] : menu?.restaurantName?.toLowerCase();
      if (name) setRestaurantName(name);
    }
  }, [menuProp, menu?.restaurantName]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axiosInstance.get(`/user/find?name=${restaurantName}`);
        if (res.data) {
          setRestaurant(res.data);
          loadData(res.data._id);
        }
      } catch (error) {
        toast.error("שגיאה בטעינת נתונים");
      }
    };

    if (restaurantName && !menuProp) {
      fetchRestaurantDetails();
    }
  }, [restaurantName, menuProp]);

  const loadData = async (userId) => {
    if (!userId) return;
    try {
      const { categories: fetchedCategories, dishes: fetchedDishesMap } = await fetchCategoriesAndDishes(userId);
      if (fetchedCategories) {
        const activeCategories = fetchedCategories
          .filter((cat) => !cat.hide && isCategoryActive(cat))
          .sort((a, b) => a.locationNumber - b.locationNumber);
          
        setCategories(activeCategories);
        setDishesMap(fetchedDishesMap);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getVariant = (index) => {
    if (index % 3 === 0) return 'small';
    if (index % 3 === 1) return 'medium';
    return 'hero';
  };

  const handleSelectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    setViewMode(categoryId === 'all' ? 'all' : 'grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (viewMode !== 'all') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.scrollY > 100) {
            setActiveCategoryId(entry.target.id.replace('section-', ''));
          } else if (window.scrollY <= 100) {
            setActiveCategoryId('all');
          }
        });
      },
      { rootMargin: '-150px 0px -50% 0px' }
    );

    categories.forEach((cat) => {
      const el = sectionRefs.current[cat._id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories, viewMode]);

  if (!restaurant) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#ffffff] font-[Inter,sans-serif] text-gray-900 overflow-x-hidden" dir="rtl">
      
      {/* Header Area */}
      <div className="pt-6 bg-[#FAF9F6]">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
             {restaurant.displayName || restaurant.restaurantName}
          </h1>
          
          <CategoryFilter 
             categories={categories} 
             activeCategoryId={activeCategoryId} 
             onSelectCategory={handleSelectCategory} 
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-screen-2xl mx-auto pb-24 px-4 sm:px-12 mt-10">
        {viewMode === 'all' ? (
          categories.map((category, catIndex) => (
            <Design6Section 
              key={category._id}
              category={category}
              catIndex={catIndex}
              dishes={dishesMap[category._id] || []}
              language={language}
              getVariant={getVariant}
              sectionRefs={sectionRefs}
              onCardClick={handleCardClick}
            />
          ))
        ) : (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-5 ps-2">
              {language === "en" && categories.find(c => c._id === activeCategoryId)?.nameEn 
                ? categories.find(c => c._id === activeCategoryId)?.nameEn 
                : categories.find(c => c._id === activeCategoryId)?.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10 px-2 mt-6">
              {dishesMap[activeCategoryId]?.map((dish) => (
                <FoodCard key={dish._id} dish={dish} variant="small" fullWidth={true} onClick={handleCardClick} />
              ))}
            </div>
          </section>
        )}
      </div>

      <DishModal 
        dish={selectedDish} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <FloatingLanguageSelector />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
        }
        .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
        }
      `}} />
    </div>
  );
};

export default Design6;
