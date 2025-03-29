import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import AddDataToStart from "../components/Cards/AddDataToStart";
import FreeTrailCounter from "@/components/Cards/FreeTrailCounter";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories
  );

  return (
    <div className="flex justify-center">
      {user?.trialExpiresAt && new Date(user.trialExpiresAt) >= new Date() && (
        <FreeTrailCounter />
      )}
      <div className="flex-1 mt-20">
        {menuCategories?.length > 0 ? (
          <div
            dir="rtl"
            className="grid lg:grid-cols-3 gap-5 justify-items-center grid-cols-2"
          >
            {menuCategories.map((category) => (
              <div key={category._id} className="m-3 relative">
                <button>
                  <p className="text-black text-2xl mb-3 text-center">
                    {category.name}
                  </p>

                  <PencilSquareIcon
                    onClick={() =>
                      navigate("/editCategory", { state: { item: category } })
                    }
                    className="absolute -m-2 w-7 rounded-full z-10 bg-gray-300 p-1"
                  />

                  {/* עטיפה של התמונה ב-div */}
                  <div className="relative">
                    <img
                      className="rounded w-full h-[220px] sm:w-[450px] object-cover"
                      src={category.img}
                      alt={category.name}
                      onClick={() =>
                        navigate("/dishesPage", { state: { item: category } })
                      }
                    />

                    {/* שכבת ההסתרה במקרה שהקטגוריה מוסתרת */}
                    {category.hide && (
                      <div
                        onClick={() =>
                          navigate("/dishesPage", { state: { item: category } })
                        }
                        className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white  text-xl font-bold"
                      >
                        הקטגוריה מוסתרת
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <AddDataToStart />
        )}
      </div>

      <div className="min-w-72 h-full sm:block hidden">
        <SideBar categories={menuCategories} />
      </div>
    </div>
  );
};

export default Dashboard;
