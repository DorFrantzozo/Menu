import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../utils/baseUrl";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      const fetchCategories = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.post(
            `/category/getCategories`,
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
  }, [user, categories]);

  return (
    <div className="flex justify-center">
      <div className="flex-1 mt-20">
        <div className="grid lg:grid-cols-3 gap-5 justify-items-center grid-cols-2">
          {categories &&
            categories.map((category) => (
              <div key={category._id} className="m-3">
                <button>
                  <p className="text-black text-2xl mb-3 text-center">
                    {category.name}
                  </p>

                  <PencilSquareIcon
                    onClick={() =>
                      navigate("/editCategory", { state: { item: category } })
                    }
                    className="absolute -m-2  w-7 rounded-full bg-gray-300 p-1"
                  />

                  <img
                    className="rounded w-full h-auto max-w-[450px] sm:max-w-[350px] min-h-[200px] object-cover"
                    src={category.img}
                    alt={category.name}
                    onClick={() =>
                      navigate("/dishesPage", {
                        state: { item: category },
                      })
                    }
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="min-w-72 h-full sm:block hidden">
        <SideBar categories={categories} />
      </div>
    </div>
  );
};

export default Dashboard;
