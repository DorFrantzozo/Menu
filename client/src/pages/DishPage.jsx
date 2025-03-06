import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import MenuCard from "../components/MenuCard";

const DishPage = () => {
  const user = useSelector((state) => state.user.user);
  const [dishes, setDishes] = useState([]);
  const location = useLocation();
  const { item } = location.state || {};
  const title = item.name;

  useEffect(() => {
    if (user && user._id) {
      const fetchCategories = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:8000/api/dish/getDish/${user._id}/${item._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach token in the Authorization header
              },
            }
          );

          if (response.data) {
            setDishes(response.data);
          } else {
            toast.error("Failed to fetch categories");
          }
        } catch (error) {
          toast.error("Error: " + error.message);
        }
      };

      fetchCategories();
    }
  }, [user]);
  return (
    <div className="p-4 lg:h-[80vh]">
      <h1 className="text-center font-semibold text-2xl md:text-3xl mt-6 mb-6 md:mt-10 md:mb-10">
        {title}
      </h1>
      <div className="block lg:flex  lg:justify-center ">
        {dishes.map((dish) => (
          <MenuCard item={dish} key={dish._id} />
        ))}
      </div>
    </div>
  );
};
export default DishPage;
