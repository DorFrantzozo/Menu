import { useNavigate } from "react-router-dom";
import milk from "../assets/img/milk.png";
import pregnant from "../assets/img/pregnant.png";
import gluten from "../assets/img/gluten.png";

const MenuCard = (item) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dishesPage", { state: { item: item.item } })}
    >
      <div className="max-w-sm rounded overflow-hidden shadow-lg  flex flex-col bg-stone-200 m-5 h-[500px] ">
        <div className="flex">
          {item.item.img ? (
            <img
              src={item.item.img}
              alt={item.item.name}
              className="w-[400px] h-[250px] text-white  object-fit"
            />
          ) : (
            <div className="w-full  bg-gray-200 flex items-center justify-center">
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
          <div className="block">
            {!item.item.lactose && <img src={milk} alt="milk" width={40} />}
          </div>
          <div>
            {!item.item.gluten && <img src={gluten} alt="gluten" width={40} />}
          </div>
          <div>
            {!item.item.pregnant && (
              <img src={pregnant} alt="pregnant" width={40} />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default MenuCard;
