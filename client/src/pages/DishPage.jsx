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
    <div className="p-4">
      <h1 className="text-center font-semibold text-2xl md:text-3xl mt-6 mb-6 md:mt-10 md:mb-10">
        {title}
      </h1>
      <div className=" place-items-center grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2md:flex-row gap-4">
        {categoryDishes.map((dish) => (
          <div key={dish._id} className="relative w-full max-w-sm">
            <MenuCard item={dish} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishPage;
