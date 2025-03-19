import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MenuCard from "../components/MenuCard";

const DishPage = () => {
  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories
  );
  const location = useLocation();
  const { item } = location.state || {};
  const title = item.name;

  // Find the category that matches the current item
  const currentCategory = menuCategories.find(
    (category) => category._id === item._id
  );
  // Get the dishes for this category
  const categoryDishes = currentCategory?.menuDishes || [];

  return (
    <div className="p-4 lg:h-[80vh]">
      <h1 className="text-center font-semibold text-2xl md:text-3xl mt-6 mb-6 md:mt-10 md:mb-10">
        {title}
      </h1>
      <div className="block lg:flex lg:justify-center">
        {categoryDishes.map((dish) => (
          <MenuCard item={dish} key={dish._id} />
        ))}
      </div>
    </div>
  );
};

export default DishPage;
