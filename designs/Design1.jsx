import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import SideBar from "../client/src/components/SideBar";
const Design1 = (menu) => {
  const user = useSelector((state) => state.user.user);
  console.log(menu);
  const useridFromMenu = menu._id;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (menu && useridFromMenu) {
      const fetchCategories = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `http://localhost:8000/api/category/getCategories`,
            {
              userId: useridFromMenu,
            }
            // { TODO: i cancel IsAuth from router
            //   headers: {
            //     Authorization: `Bearer ${token}`, // Attach token in the Authorization header
            //   },
            // }
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
  }, [menu]);
  return (
    <div className="flex">
      {/* Main Content */}

      <div className="flex-grow p-4" style={{ marginRight: "13rem" }}>
        {" "}
        {/* Sidebar width margin */}
        <div className="block w-full">
          <h1 className="text-2xl font-semibold text-black mt-10">
            {menu.menu.restaurantName}
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-2 mt-4">
          {categories &&
            categories.map((category) => (
              <div key={category._id} className="m-3">
                <button>
                  <p className="text-black text-2xl mb-3 text-center">
                    {category.name}
                  </p>

                  <img
                    className="rounded w-full h-auto max-w-[350px] min-h-[200px] object-cover"
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

      {/* Sidebar */}
      <div className="w-72 h-screen fixed right-0 bg-gray-200">
        {/* <SideBar categories={categories} /> */}
      </div>
    </div>
  );
};

export default Design1;
