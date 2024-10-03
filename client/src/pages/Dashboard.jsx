import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import MenuCard from "../components/MenuCard";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (user && user._id) {
      const fetchCategories = async () => {
        try {
          const response = await axios.post(
            `http://localhost:8000/api/category/getCategories`,
            {
              userId: user._id,
            }
          );

          if (response.data) {
            setCategories(response.data);
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
    <div>
      <div className=" flex justify-center  ">
        <img src={user.logo} width={80} height={100} alt="" />
        <h1 className="text-white mt-4 font-semibold text-2xl ">
          {user.restaurantName.toUpperCase()}'S Menu
        </h1>
        <div className="md:flex md:justify-between block mt-20">
          {categories &&
            categories.map((category) => (
              <MenuCard key={category._id} item={category} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
