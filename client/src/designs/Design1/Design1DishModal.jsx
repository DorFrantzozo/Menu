import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Alergies from "../../components/sensitivities/Allergies";
import { Button } from "@/components/ui/button";
import useTrackDishView from "@/hooks/useTrackDishView";
import { useLanguage } from "../../context/LanguageContext";
import FavoriteHeart from "../../components/buttons/FavoriteHeart";

const Design1DishModal = ({ dish, isOpen, onClose }) => {
  const { language } = useLanguage();
  useTrackDishView(isOpen ? dish?._id : null);

  if (!dish) return null; // אם אין מנה, לא נטען שום דבר

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-menu-modal">
        <div className="relative w-full h-full bg-white shadow-lg overflow-y-auto">
          <Button
            onClick={onClose}
            className="absolute top-4 left-4 text-white hover:text-white z-50 bg-gray-900/80 hover:bg-gray-900 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-lg transition-all"
            variant="ghost"
          >
            <X size={24} strokeWidth={2.5} />
          </Button>

          <div
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-full">
              <div className="absolute top-4 right-4 z-50">
                <FavoriteHeart dishId={dish._id} />
              </div>
              <img
                src={dish.img}
                alt={dish.name}
                className="w-full lg:h-[700px] xl:object-fit object-fit "
              />
              {/* דירוג (fade) בין התמונה לתיאור */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-black/50 to-transparent"></div>{" "}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-8">
              {language === "en" && dish.nameEn ? dish.nameEn : dish.name}
            </h2>
            <p className="text-gray-500 mt-2 text-lg px-4 text-center">
              {language === "en" && dish.descriptionEn ? dish.descriptionEn : dish.description}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              {dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price ? (
                <>
                  <p className="text-2xl font-bold text-emerald-600">{dish.salePrice} ₪</p>
                  <p className="text-lg font-semibold text-red-500 line-through opacity-70">{dish.price} ₪</p>
                </>
              ) : (
                <p className="text-xl font-semibold text-gray-800">
                  {dish.price} ₪
                </p>
              )}
            </div>
            <Alergies dish={dish} className="mt-4" />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Design1DishModal;
