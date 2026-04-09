import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import useTrackDishView from "@/hooks/useTrackDishView";
import Allergies from "@/components/sensitivities/Allergies";
import { useLanguage } from "../../context/LanguageContext";

const DishModalDesign5 = ({ dish, isOpen, onClose }) => {
  const { language } = useLanguage();
  useTrackDishView(isOpen ? dish?._id : null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && dish && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[90vh] bg-white rounded-t-3xl overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
            >
              <X size={18} className="text-slate-700" />
            </button>

            {/* Dish Image */}
            <div className="w-full h-56 sm:h-72 flex-shrink-0 overflow-hidden">
              <img
                src={dish.img}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto p-5 pb-8 ${language === "en" ? "text-left" : "text-right"}`} dir={language === "en" ? "ltr" : "rtl"}>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {language === "en" && dish.nameEn ? dish.nameEn : dish.name}
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {language === "en" && dish.descriptionEn ? dish.descriptionEn : dish.description}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price ? (
                    <>
                      <span className="text-3xl font-bold text-emerald-600">₪{dish.salePrice}</span>
                      <span className="text-xl font-bold text-red-500 line-through opacity-70 border-none">₪{dish.price}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-slate-900">
                      ₪{dish.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Allergies/Sensitivities */}
              <div className="border-t border-slate-100 pt-4">
                <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 ${language === "en" ? "text-left" : "text-right"}`}>
                  {language === "en" ? "Nutritional Information" : "מידע תזונתי"}
                </p>
                <div className={`flex ${language === "en" ? "justify-start" : "justify-start"}`}>
                  <Allergies dish={dish} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DishModalDesign5;
