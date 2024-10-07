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
            console.log(response.data);
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
    <div className="flex justify-center ">
      {dishes.map((dish) => (
        <MenuCard item={dish} key={dish._id} />
      ))}
    </div>
  );
};

export default DishPage;
