import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SideBar = (categories) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  return (
    <div className="bg-slate-50  block h-screen  justify-center">
      <div className=" text-center text-black p-4">{user.restaurantName}</div>
      <hr className="border-black border-t-1 w-3/4 mt-4 mx-auto" />
      {categories &&
        categories.categories.map((item, index) => (
          <button
            key={index}
            className="text-center w-full text-black p-2 mt-10"
            onClick={() => navigate("/dishesPage", { state: { item: item } })}
          >
            {item.name}
          </button>
        ))}
    </div>
  );
};

export default SideBar;
