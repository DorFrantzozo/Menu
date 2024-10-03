import { useNavigate } from "react-router-dom";
const MenuCard = (item) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/dishesPage", { state: { item: item } })}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg  p-4">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-white flex justify-center">
            {item.item.name}
          </div>
        </div>
        {item.item.img ? (
          <img
            src={item.item.img}
            alt={item.item.name}
            className="w-[400px] h-[250px] text-white rounded"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-white">No Image Available</span>
          </div>
        )}
        <p className="text-white text-base mt-4">{item.item.description}</p>
      </div>
    </button>
  );
};

export default MenuCard;
