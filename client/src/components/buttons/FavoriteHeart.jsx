import React, {useState, useEffect, useRef} from "react";
import {Heart} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {toggleLikeLocal, reportLikeToDB} from "../../utils/likeList";

const FavoriteHeart = ({dishId, onToggle, className = ""}) => {
  const [isLiked, setIsLiked] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    const checkLiked = () => {
      const favorites = JSON.parse(
        localStorage.getItem("menu_favorites") || "[]",
      );
      setIsLiked(favorites.includes(dishId));
    };

    checkLiked();

    window.addEventListener("favoritesUpdated", checkLiked);
    return () => window.removeEventListener("favoritesUpdated", checkLiked);
  }, [dishId]);

  const toggleFavorite = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    toggleLikeLocal(dishId);
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    if (onToggle) onToggle(dishId, newIsLiked);

    // Call DB only on intentional likes, debounced to prevent spam API calls
    if (newIsLiked) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        reportLikeToDB(dishId);
      }, 500);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`relative flex items-center justify-center w-8 h-8 transition-transform active:scale-90 ${className}`}
      aria-label="Add to favorites"
    >
      {/* הרקע העגול הלבן עם הצל העדין */}
      <div className="absolute inset-0 bg-white border border-gray-100 rounded-full shadow-md opacity-90" />

      {/* הלב עם האנימציה */}
      <motion.div
        animate={isLiked ? {scale: [1, 1.3, 1]} : {scale: 1}}
        transition={{duration: 0.3}}
        className="relative z-10"
      >
        <Heart
          size={18}
          strokeWidth={2}
          className={`transition-colors duration-300 ${
            isLiked
              ? "fill-red-500 stroke-red-500"
              : "fill-none stroke-gray-400"
          }`}
        />
      </motion.div>

      {/* אפקט "התזה" קטן כשנבחר */}
      <AnimatePresence>
        {isLiked && (
          <motion.div
            initial={{scale: 0, opacity: 1}}
            animate={{scale: 1.5, opacity: 0}}
            exit={{opacity: 0}}
            className="absolute inset-0 bg-red-200 rounded-full z-0"
          />
        )}
      </AnimatePresence>
    </button>
  );
};

export default FavoriteHeart;
