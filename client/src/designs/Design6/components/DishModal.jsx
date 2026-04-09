import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";
import useTrackDishView from "@/hooks/useTrackDishView";
import Allergies from "@/components/sensitivities/Allergies";
import "./DishModal.css";

const DishModal = ({ dish, isOpen, onClose }) => {
  const { language } = useLanguage();
  useTrackDishView(isOpen ? dish?._id : null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!dish) return null;

  const title = language === "en" && dish.nameEn ? dish.nameEn : dish.name;
  const description = language === "en" && dish.descriptionEn ? dish.descriptionEn : dish.description;
  const price = dish.price || 0;
  const isRTL = language !== 'en';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dish-modal-overlay"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl overflow-hidden dish-modal-container dish-modal-content flex flex-col md:flex-row shadow-2xl items-stretch"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white transition-all duration-200 text-gray-800`}
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Large Image Section */}
            <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-auto flex-shrink-0 relative overflow-hidden">
              {dish.img ? (
                <img 
                  src={dish.img} 
                  alt={title} 
                  className="w-full h-full md:absolute md:inset-0 object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col overflow-y-auto bg-white max-h-[60vh] md:max-h-full">
              <div className="flex-grow">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {title}
                </h2>
                
                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-[#00C38B]/10 text-[#00C38B] px-4 py-1.5 rounded-full text-base font-bold">
                    ₪{price}
                  </span>
                  {dish.salePrice && dish.salePrice < price && (
                    <span className="text-gray-400 line-through text-sm italic">
                      ₪{dish.price}
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {language === 'en' ? 'About this dish' : 'על המנה'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                      {description || (language === 'en' ? 'No description available for this item.' : 'אין תיאור זמין עבור מנה זו.')}
                    </p>
                  </div>

                  {/* Allergens Section */}
                  <div className="pt-6 border-t border-black/50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      {language === 'en' ? 'Sensitivities & Allergens' : 'רגישויות ואלרגנים'}
                    </h4>
                    <Allergies dish={dish} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DishModal;
