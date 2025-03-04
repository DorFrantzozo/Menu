import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import design1Tamneil from "../assets/img/design1Tamneil.png";
import Design2Tamneil from "../assets/img/Design2Tamneil.png";
import DefaultButton from "@/components/buttons/DefaultButton";
const Designs = () => {
  const items = [design1Tamneil];
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const name = user.restaurantName.toLowerCase();

  const [menu, setMenu] = useState([]);
  const handleChangeMenuDesign = async (designNumber) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/updateDesign`,
        { designNumber: designNumber, userId: user._id },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
    // <div className="mt-16">
    //   <button
    //     className="px-4 py-2 text-xl text-white border rounded-2xl "
    //     onClick={() => navigate("/design1", { state: menu })}
    //   >
    //     <img src={design1Tamneil} className="w-40" alt="design1Tamneil" />
    //     design1
    //   </button>
    //   <button
    //     className="px-4 py-2 text-xl text-white border rounded bg-black"
    //     onClick={() => navigate("/design2", { state: menu })}
    //   >
    //     design2
    //   </button>
    // </div>
    <div className=" flex">
      <div className="text-center mt-20 ">
        <img
          src={design1Tamneil}
          className="shadow-slate-200  mt-10  mb-10 ms-10 hover:scale-110 transition duration-500 rounded-lg shadow-lg"
          width={200}
          alt=""
        />
        <DefaultButton
          text="החל"
          bg="zinc-800"
          color="white"
          onClick={() => handleChangeMenuDesign(1)}
        />
        <DefaultButton
          text="לנסות"
          bg="zinc-800"
          color="white"
          onClick={() => navigate("/design1")}
        />
      </div>
      <div className="text-center mt-10  mb-20">
        <img
          src={Design2Tamneil}
          className="shadow-slate-200 mt-20 mb- ms-10 hover:scale-110 transition duration-500 rounded-lg shadow-lg"
          width={200}
          alt=""
        />
        <DefaultButton
          text="החל"
          bg="zinc-800"
          color="white"
          onClick={() => handleChangeMenuDesign(1)}
        />
        <DefaultButton
          text="לנסות"
          bg="zinc-800"
          color="white"
          onClick={() => navigate("/design2")}
        />
      </div>
    </div>
  );
};

export default Designs;
