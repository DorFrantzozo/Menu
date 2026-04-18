import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Alergies from "../../components/sensitivities/Allergies";
import IconDescription from "../../components/sensitivities/IconDescription";
import Design1DishModal from "./Design1DishModal";
import FavoriteHeart from "../../components/buttons/FavoriteHeart";

import axiosInstance from "../../utils/baseUrl";
import { useLanguage } from "../../context/LanguageContext";
import FloatingLanguageSelector from "../../components/LanguageSelector/FloatingLanguageSelector";

const Design1Dish = () => {
  const { userId, categoryId, categoryName } = useParams();
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();



  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axiosInstance.get(
          `/dish/getDish/${userId}/${categoryId}`
        );
        if (response.data) {
          setDishes(response.data);
        } else {
          toast.error("לא נמצאו מנות");
        }
      } catch (error) {
        toast.error("שגיאה בטעינת המנות: " + error.message);
      }
    };

    if (userId && categoryId) {
      fetchDishes();
    }
  }, [userId, categoryId]);

  const handleOpenModal = (dish) => {
    setSelectedDish(dish);
  };

  const handleCloseModal = () => {
    setSelectedDish(null);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 h-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg">
          <div className="flex items-center justify-between px-6 h-full">
            <button
              onClick={() => navigate(-1)}
              className="text-white font-light text-md"
            >
              חזור
            </button>
              <h1 className="text-3xl font-bold text-white text-center flex-1">
                {language === "en" && dishes.length > 0 && dishes[0].categoryNameEn ? dishes[0].categoryNameEn : categoryName}
              </h1>
            </div>
        </div>

        <div className="flex-grow p-6">
          <div className="space-y-8">
            {dishes
              .filter((dish) => !dish.hide)
              .map((dish) => (
                <div
                  key={dish._id}
                  className="flex items-center p-2 space-x-6 cursor-pointer relative"
                  onClick={() => handleOpenModal(dish)}
                >
                  <div className={`flex flex-col w-full ${language === "en" ? "text-left" : "text-right"}`}>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {language === "en" && dish.nameEn ? dish.nameEn : dish.name}
                    </h3>
                    <p className={`text-gray-400 mt-2 text-sm mb-2 ${language === "en" ? "text-left" : "text-right"}`}>
                      {language === "en" && dish.descriptionEn ? dish.descriptionEn : dish.description}
                    </p>
                    <Alergies dish={dish} />
                    <div className={`flex items-center gap-2 mt-2 ${language === "en" ? "justify-start" : "justify-end"}`}>
                      {dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price ? (
                        <>
                          <p className="font-bold text-xl text-emerald-600">{dish.salePrice} ₪</p>
                          <p className="font-bold text-sm text-red-500 line-through opacity-70">{dish.price} ₪</p>
                        </>
                      ) : (
                        <p className="font-bold text-lg text-gray-900">
                          {dish.price} ₪
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteHeart dishId={dish._id} className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <img
                      src={dish.img}
                      className="dish-img rounded-xl object-cover shadow-lg w-[120px] h-[120px]"
                      alt={dish.name}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto bg-white shadow-lg p-4">
          <IconDescription />
        </div>
      </div>

      {/* הצגת המודל רק אם יש מנה נבחרת */}
      <Design1DishModal
        dish={selectedDish}
        isOpen={!!selectedDish} // המודל יפתח אם יש מנה נבחרת
        onClose={handleCloseModal}
      />
      <FloatingLanguageSelector />
    </>
  );
};

export default Design1Dish;
