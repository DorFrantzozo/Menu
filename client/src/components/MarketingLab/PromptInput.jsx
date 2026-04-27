import React, {useState, useRef, useEffect} from "react";
import {Edit3, ChevronDown, UtensilsCrossed} from "lucide-react";
import {useSelector} from "react-redux";
import {motion, AnimatePresence} from "framer-motion";

export default function PromptInput({
  prompt,
  setPrompt,
  disabled,
  selectedDishContext,
  setSelectedDishContext,
}) {
  const categories = useSelector(
    (state) => state.menuCategories?.menuCategories || [],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDish = (dish) => {
    const dishName = dish.dishName || dish.name;
    setPrompt(dishName);
    setSelectedDishContext(dish);
    setIsDropdownOpen(false);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    // Optional: if user completely clears or heavily edits the dish name,
    // we could clear the context, but we leave it as the user might just be appending text.
    if (e.target.value === "") {
      setSelectedDishContext(null);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Dropdown for Context */}
      <div className="relative z-20" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
          className="w-full bg-[#1e1b24] border border-white/10 rounded-xl py-3.5 px-4 text-gray-300 hover:border-white/20 transition-colors flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-pink-500/10 transition-colors">
              <UtensilsCrossed className="w-4 h-4 text-pink-400" />
            </div>
            {selectedDishContext ? (
              <span className="text-white font-medium">
                {selectedDishContext.dishName || selectedDishContext.name}{" "}
                <span className="text-emerald-400 text-xs font-normal mr-2 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  מחובר להקשר
                </span>
              </span>
            ) : (
              <span>בחירת מנה מהתפריט לקידום חכם (מומלץ)</span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-white" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{opacity: 0, y: -10, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: -10, scale: 0.98}}
              transition={{duration: 0.2}}
              className="absolute top-[calc(100%+8px)] right-0 w-full max-h-64 overflow-y-auto bg-[#231b2c] border border-white/10 rounded-xl shadow-2xl z-30 scrollbar-hide"
            >
              {categories.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  לא נמצאו מנות בתפריט. נא להוסיף מנות בהגדרות התפריט.
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat._id || cat.name}
                    className="border-b border-white/5 last:border-0"
                  >
                    <div className="px-4 py-2.5 bg-black/20 text-xs font-semibold text-gray-400 sticky top-0 backdrop-blur-md z-10 flex items-center gap-2">
                      <div className="w-1 h-3 bg-pink-500/50 rounded-full"></div>
                      {cat.categoryName || cat.name}
                    </div>
                    {cat.menuDishes?.length > 0 ? (
                      cat.menuDishes.map((dish) => (
                        <button
                          key={dish._id || dish.name}
                          type="button"
                          onClick={() => handleSelectDish(dish)}
                          className="w-full text-right px-5 py-3 hover:bg-pink-500/10 text-gray-300 hover:text-white transition-colors flex justify-between items-center group"
                        >
                          <span className="font-medium">
                            {dish.dishName || dish.name}
                          </span>
                          {dish.price && (
                            <span className="text-sm text-gray-500 group-hover:text-pink-300 transition-colors">
                              ₪{dish.price}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-sm text-gray-500">
                        אין מנות בקטגוריה זו
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Free Text Input */}
      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          disabled={disabled}
          placeholder="או הקלד חופשי מה תרצה לקדם הערב..."
          className="w-full bg-[#1e1b24] border border-white/10 rounded-xl py-4 pr-12 pl-16 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Edit3 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}
