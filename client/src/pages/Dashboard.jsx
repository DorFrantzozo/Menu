import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (user && user._id) {
      const fetchCategories = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `http://localhost:8000/api/category/getCategories`,
            {
              userId: user._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach token in the Authorization header
              },
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
    <div className="flex">
      <div className="flex-1 mt-20">
        <div className="md:flex md:justify-center ">
          {categories &&
            categories.map((category) => (
              <div key={category._id} className="m-5">
                <button
                  onClick={() =>
                    navigate("/dishesPage", { state: { item: category } })
                  }
                >
                  <p className="text-white mb-5 ">{category.name}</p>
                  <img
                    src={category.img}
                    width={"350px"}
                    height={"250px"}
                    alt=""
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="min-w-72 h-full">
        <SideBar categories={categories} />
      </div>
    </div>
  );
};

export default Dashboard;
