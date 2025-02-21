import dish from "../assets/img/dish.jpg";
import category from "../assets/img/category.png";
import { useNavigate } from "react-router-dom";
import tomatoAndCarrot from "../assets/img/tomatoAndCarrot.jpg";

const Card = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mb-10">
      {/* Category Card */}
      <div className="w-full max-w-[350px] h-auto flex flex-col items-center">
        <img
          className="rounded-lg hover:scale-105 transition duration-300"
          src={category}
          alt="קטגוריה"
        />
        <button
          onClick={() => navigate("/add-category")}
          className="text-white text-lg sm:text-xl w-full rounded-lg p-3 mt-4 bg-stone-400 hover:bg-stone-500 transition duration-300"
        >
          הוסף קטגוריה חדשה
        </button>
      </div>

      {/* Dish Card */}
      <div className="w-full max-w-[350px] h-auto flex flex-col items-center">
        <img
          className="rounded-lg hover:scale-105 transition duration-300"
          src={dish}
          alt="מנה"
        />
        <button
          onClick={() => navigate("/add-dish")}
          className="text-white text-lg sm:text-xl w-full rounded-lg p-3 mt-4 bg-stone-400 hover:bg-stone-500 transition duration-300"
        >
          הוסף מנה חדשה
        </button>
      </div>

      {/* Assets Card */}
      <div className="w-full max-w-[350px] h-auto flex flex-col items-center">
        <img
          className="rounded-lg hover:scale-105 transition duration-300"
          src={tomatoAndCarrot}
          alt="Assets"
        />
        <button
          onClick={() => navigate("/add-asset")}
          className="text-white text-lg sm:text-xl w-full rounded-lg p-3 mt-4 bg-stone-400 hover:bg-stone-500 transition duration-300"
        >
          הוסף תמונות
        </button>
      </div>
    </div>
  );
};

export default Card;
