// DishPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)} // כפתור חזרה לעמוד הקטגוריות
        className="mb-4 text-blue-500 font-semibold"
      >
        חזור לעמוד הקטגוריות
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        {categoryName}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dishes.map((dish) => (
          <div key={dish._id} className="p-4 bg-white shadow-lg rounded-lg">
            <img
              src={dish.img}
              className="w-full h-56 object-cover rounded-lg"
              alt={dish.name}
            />
            <h3 className="text-xl font-semibold text-center text-gray-700 mt-4">
              {dish.name}
            </h3>
            <p className="text-center text-gray-600 mt-2">{dish.description}</p>
            <p className="text-center font-bold text-lg text-gray-900 mt-2">
              {dish.price} ₪
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Design1Dish;
