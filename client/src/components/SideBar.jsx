import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories
  );

  return (
    <div className="bg-gray-950 block h-screen  justify-center">
      <div className=" text-center text-white p-4">{user.restaurantName}</div>
      <hr className="border-white border-t-1 w-3/4 mt-4 mx-auto" />
      {menuCategories &&
        menuCategories.map((item, index) => (
          <button
            key={index}
            className="text-center w-full text-white p-2 mt-10"
            onClick={() => navigate("/dishesPage", { state: { item: item } })}
          >
            {item.name}
          </button>
        ))}
    </div>
  );
};

export default SideBar;
