import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";

const CategoryFilter = ({ categories, activeCategoryId, onSelectCategory }) => {
  const { language } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-[#FAF9F6]/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 space-x-reverse snap-x snap-mandatory pb-1">
        
        {/* "All Items" Chip */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            activeCategoryId === 'all'
              ? 'bg-[#00C38B] text-white border-[#00C38B]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {language === "en" ? "All Items" : "כל הפריטים"}
        </button>

        {/* Category Chips */}
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category._id)}
            className={`flex-shrink-0 snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeCategoryId === category._id
                ? 'bg-[#00C38B] text-white border-[#00C38B]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {language === "en" && category.nameEn ? category.nameEn : category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
