import { motion } from "framer-motion";
import { toWebP } from "@/utils/cloudinaryUrl";
import { useState } from "react";

const dietaryBadge = (dish) => {
  const tags = [];
  if (dish.vegi) tags.push("צמחוני");
  if (dish.gluten) tags.push("ללא גלוטן");
  if (dish.lactose) tags.push("ללא לקטוז");
  if (dish.pregnant) tags.push("להריון");
  return tags;
};

const DishCardDesign5 = ({ dish, isPopular, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const tags = dietaryBadge(dish);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-200">
        {/* Optional simple pulse effect while loading */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-300"></div>
        )}
        <img
          src={toWebP(dish.img)}
          alt={dish.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Popular Badge */}
        {isPopular && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <span>⭐</span> Popular
          </span>
        )}

        {/* Dietary Tags (floating over image, top-left) */}
        {tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-slate-900 truncate leading-tight">
          {dish.name}
        </h3>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug min-h-[28px]">
          {dish.description}
        </p>
        <p className="text-sm font-bold text-slate-900 mt-2">
          ₪{dish.price}
        </p>
      </div>
    </motion.div>
  );
};

export default DishCardDesign5;
