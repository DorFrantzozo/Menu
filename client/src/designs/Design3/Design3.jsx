import AccordionMenu from "@/components/data/AccordionMenu";
import { getCategories, getRestaurantName } from "@/utils/fetchData";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Design3 = () => {
  const [restaurantName, setRestaurantName] = useState(null);
  const [categories, setCategories] = useState(null);
  const location = useLocation();
  const menu = location.state || {};
  useEffect(() => {
    setRestaurantName(getRestaurantName(menu));
    try {
      const categoriesFromLocalStorage = localStorage.getItem("categories");
      if (categoriesFromLocalStorage) {
        setCategories(categoriesFromLocalStorage);
      } else {
        setCategories(getCategories(menu));
      }
      console.log(categories);
    } catch (error) {}
  }, [menu]);
  return (
    <div className="p-10">
      <AccordionMenu restaurantDetils={menu} />
    </div>
  );
};

export default Design3;
