import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories
  );

  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="flex-1 mt-20">
        <div className="grid lg:grid-cols-3 gap-5 justify-items-center grid-cols-2">
          {menuCategories &&
            menuCategories.map((category) => (
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
        <SideBar categories={menuCategories} />
      </div>
    </div>
  );
};

export default Dashboard;
