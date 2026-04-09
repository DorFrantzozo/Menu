import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";

const FoodCard = ({ dish, variant = 'small', fullWidth = false, onClick }) => {
  const { language } = useLanguage();
  
  // Clean typography, price tag, high-quality image placement
  // Remove green plus buttons, star ratings, popular this week banners.
  
  const title = language === "en" && dish.nameEn ? dish.nameEn : dish.name;
  const description = language === "en" && dish.descriptionEn ? dish.descriptionEn : dish.description;
  const price = dish.price || 0;
  
  // Base card styles with subtle drop shadow
  const baseCardStyle = "bg-white rounded-2xl flex-shrink-0 snap-start overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex cursor-pointer transition-transform duration-200 active:scale-95";
  
  if (variant === 'small') {
    // Vertical card, e.g. Nigiri
    return (
      <div 
        onClick={() => onClick?.(dish)}
        className={`${baseCardStyle} flex-col ${fullWidth ? 'w-full' : 'w-44 sm:w-56 md:w-64 lg:w-72'} m-1`}
      >
        <div className="w-full h-32 sm:h-44 md:h-52 bg-gray-100 flex-shrink-0">
          {dish.img ? (
            <img src={dish.img} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="p-3 sm:p-5 flex flex-col flex-grow">
          <h3 className="text-gray-900 font-semibold text-sm sm:text-lg leading-tight mb-1 sm:mb-2 line-clamp-1">{title}</h3>
          {description && (
            <p className="text-gray-500 text-xs sm:text-base line-clamp-2 mb-3 flex-grow">{description}</p>
          )}
          <div className="mt-auto flex justify-between items-center">
            <span className="text-gray-900 font-bold text-sm sm:text-lg">₪{price}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'medium') {
    // Horizontal card, e.g. Maki Roles - Re-adding title and price
    return (
      <div 
        onClick={() => onClick?.(dish)}
        className={`${baseCardStyle} w-64 sm:w-[400px] md:w-[480px] flex-row h-24 sm:h-36 md:h-44 m-1`}
      >
        <div className="w-1/2 h-full bg-gray-100 flex-shrink-0">
          {dish.img ? (
            <img src={dish.img} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="w-1/2 bg-white p-3 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold text-sm sm:text-lg lg:text-xl leading-tight line-clamp-1 mb-1">{title}</h3>
            {description && (
              <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">{description}</p>
            )}
          </div>
          <div className="mt-auto">
            <span className="text-gray-900 font-bold text-sm sm:text-lg">₪{price}</span>
          </div>
        </div>
      </div>
    );
  }

  // Hero variant - e.g. Special Items
  return (
    <div 
      onClick={() => onClick?.(dish)}
      className={`${baseCardStyle} flex-col w-72 sm:w-[450px] md:w-[550px] m-1`}
    >
      <div className="w-full h-44 sm:h-64 md:h-72 bg-gray-100 flex-shrink-0 relative">
        {dish.img ? (
          <img src={dish.img} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
           <span className="text-gray-900 font-bold text-sm sm:text-lg">₪{price}</span>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-gray-900 font-bold text-lg sm:text-2xl leading-tight mb-2 line-clamp-1">{title}</h3>
        {description && (
          <p className="text-gray-500 text-sm sm:text-lg line-clamp-2 mb-2 flex-grow">{description}</p>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
