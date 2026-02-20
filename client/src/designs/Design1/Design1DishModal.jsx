import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Alergies from "../../components/sensitivities/Allergies";
import { Button } from "@/components/ui/button";
import useTrackDishView from "@/hooks/useTrackDishView";

const Design1DishModal = ({ dish, isOpen, onClose }) => {
  useTrackDishView(isOpen ? dish?._id : null);

  if (!dish) return null; // אם אין מנה, לא נטען שום דבר

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative w-full h-full bg-white shadow-lg overflow-y-auto">
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-900 z-50"
            variant="ghost"
          >
            <X size={24} />
          </Button>

          <div
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-full">
              <img
                src={dish.img}
                alt={dish.name}
                className="w-full lg:h-[700px] xl:object-fit object-fit "
              />
              {/* דירוג (fade) בין התמונה לתיאור */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-black/50 to-transparent"></div>{" "}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-8">
              {dish.name}
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              {dish.description}
            </p>
            <p className="text-xl font-semibold text-gray-800 mt-4">
              {dish.price} ₪
            </p>
            <Alergies dish={dish} className="mt-4" />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Design1DishModal;
