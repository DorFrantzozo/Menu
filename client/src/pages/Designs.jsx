import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const Designs = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const name = user.restaurantName.toLowerCase();

  const [menu, setMenu] = useState([]);

  const fatchData = async (name) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/find", {
        params: { name },
      });

      setMenu(response.data);
      console.log(menu);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fatchData(name);
  }, [name]);

  return (
    <div>
      <button
        className="px-4 py-2 text-xl text-white border rounded bg-black"
        onClick={() => navigate("/design1", { state: menu })}
      >
        design1
      </button>
      <button
        className="px-4 py-2 text-xl text-white border rounded bg-black"
        onClick={() => navigate("/design2", { state: menu })}
      >
        design2
      </button>
    </div>
  );
};

export default Designs;
