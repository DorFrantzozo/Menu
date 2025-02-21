import { useNavigate } from "react-router-dom";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Alergies from "./sensitivities/Alergies";
const MenuCard = (item) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/editDish", { state: { item: item } });
  };

  return (
    <button>
      <PencilSquareIcon
        onClick={handleEditClick}
        className="absolute w-7 rounded-full bg-gray-300 p-1"
      />

      <div className="max-w-sm rounded overflow-hidden shadow-lg flex flex-col bg-stone-200 m-5 h-[500px]">
        <div className="flex">
          {item.item.img ? (
            <img
              src={item.item.img}
              alt={item.item.name}
              className="w-[400px] h-[250px] text-white object-fit"
            />
          ) : (
            <div className="w-full bg-gray-200 flex items-center justify-center">
              <span className="text-black">No Image Available</span>
            </div>
          )}
        </div>
        <div className="px-6 py-4">
          <div className="font-semibold text-xl mb-2 text-slate-900 flex justify-center">
            {item.item.name}
          </div>
        </div>
        <div className="mt-4 h-24 overflow-hidden">
          <p className="text-slate-900 text-base">{item.item.description}</p>
          {item.item.price && (
            <p className="text-slate-900 text-base mt-1">{item.item.price} ₪</p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Alergies dish={item.item} />
        </div>
      </div>
    </button>
  );
};

export default MenuCard;
