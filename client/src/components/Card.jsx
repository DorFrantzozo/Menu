import dish from "../assets/img/dish.jpg";
import category from "../assets/img/category.png";
import { useNavigate } from "react-router-dom";

const Card = () => {
  const navigate = useNavigate();
  const handleAddDish = () => {
    navigate("/add-dish");
  };

  const handleAddCategory = () => {
    navigate("/add-category");
  };
  return (
    <>
      <div className="sm:flex block">
        <div className="block  w-[350px] h-[450px] mr-10 sm:mb-40">
          <img
            className="rounded hover:scale-110 transition duration-500"
            src={category}
            width="350px"
            alt=""
          />

          <button
            onClick={handleAddCategory}
            className="text-white text-2xl w-full rounded p-3 flex justify-center mt-5 bg-stone-400"
          >
            Add New Category
          </button>
        </div>
        <div className="block   w-[350px] h-[450px] mb-40 ">
          <img
            className="rounded hover:scale-110 transition duration-500"
            src={dish}
            width="350px"
            alt=""
          />

          <button
            onClick={handleAddDish}
            className="text-white text-2xl w-full rounded p-3 flex justify-center mt-5 bg-stone-400"
          >
            Add New Dish
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
