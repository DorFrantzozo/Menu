// DishPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Alergies from "../../components/sensitivities/Allergies";
import IconDescription from "../../components/sensitivities/IconDescription";
const Design1Dish = () => {
  const { userId, categoryId, categoryName } = useParams(); // לקבל את ה- userId וה- categoryId מה-URL
  const [dishes, setDishes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/dish/getDish/${userId}/${categoryId}`
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

  return (
    <div className="min-h-screen  p-6">
      <button
        onClick={() => navigate(-1)} // כפתור חזרה לעמוד הקטגוריות
        className="mb-4  font-semibold"
      >
        חזור לעמוד הקטגוריות
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        {categoryName}
      </h1>

      <div className="space-y-8 ">
        {dishes.map((dish) => (
          <div
            key={dish._id}
            className="flex items-center p-2   mb-10 shadow-lg rounded-lg space-x-6"
          >
            <img src={dish.img} className="dish-img rounded " alt={dish.name} />

            <div className="flex flex-col w-full">
              <h3 className="text-xl font-semibold text-right text-gray-700">
                {dish.name}
              </h3>
              <p className="text-gray-600 mt-2 text-right">
                {dish.description}
              </p>
              <p className="font-bold text-lg text-gray-900 mt-2">
                {dish.price} ₪
              </p>
              <Alergies dish={dish} />
            </div>
          </div>
        ))}
        <IconDescription />
      </div>
    </div>
  );
};

export default Design1Dish;
