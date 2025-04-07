import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Alergies from "../../components/sensitivities/Allergies";
import IconDescription from "../../components/sensitivities/IconDescription";
import Design1DishModal from "./Design1DishModal";
import axiosInstance from "../../utils/baseUrl";

const Design1Dish = () => {
  const { userId, categoryId, categoryName } = useParams();
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const navigate = useNavigate();

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
              {categoryName}
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
                  className="flex items-center p-2 space-x-6 cursor-pointer"
                  onClick={() => handleOpenModal(dish)}
                >
                  <div className="flex flex-col w-full">
                    <h3 className="text-lg font-semibold text-right text-gray-700">
                      {dish.name}
                    </h3>
                    <p className="text-gray-400 mt-2 text-right text-sm mb-2">
                      {dish.description}
                    </p>
                    <Alergies dish={dish} />
                    <p className="font-bold text-lg text-gray-900 mt-2">
                      {dish.price} ₪
                    </p>
                  </div>
                  <img
                    src={dish.img}
                    className="dish-img rounded-xl object-cover shadow-lg w-[120px] h-[120px]"
                    alt={dish.name}
                  />
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
    </>
  );
};

export default Design1Dish;
