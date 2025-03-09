import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import design1Tambneil from "../assets/img/design1Tamneil.png";
import design2Tambneil from "../assets/img/design2Tambneil.png";
import DefaultButton from "@/components/buttons/DefaultButton";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { updateUser } from "@/state/user/userSlice";
import axiosInstance from "../utils/baseUrl";
const Designs = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  console.log(user._id);
  const name = user.restaurantName.toLowerCase() || "";
  const dispatch = useDispatch();

  const [menu, setMenu] = useState([]);
  const handleChangeMenuDesign = async (designNumber) => {
    try {
      const response = await axiosInstance.put(
        `/user/updateDesign`,
        { number: designNumber, userId: user._id },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("העיצוב שונה בהצלחה");
      dispatch(updateUser(response.data.user));
  
    } catch (error) {
      console.log(error);
    }
  };

  const fatchData = async (name) => {
    try {
      const response = await axiosInstance.get("/user/find", {
        params: { name },
      });

      setMenu(response.data);
    
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
    <>
      <div className="block md:flex justify-center gap-10">
        <div className="flex flex-col items-center">
          <img
            src={design1Tambneil}
            className="shadow-slate-200 h-[700px] mb-10 mt-20 hover:scale-110 transition duration-500 rounded-lg shadow-lg"
            alt=""
          />
          <div className="flex gap-10 justify-around mt-5 w-full sm:w-auto">
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
              onClick={() => navigate("/design1", { state: menu })}
            />
          </div>
        </div>

        <div className="flex flex-col items-center mb-20">
          <img
            src={design2Tambneil}
            className="shadow-slate-200 h-[700px] mb-10 mt-20 hover:scale-110 transition duration-500 rounded-lg shadow-lg"
            alt=""
          />
          <div className="flex justify-around gap-10 mt-5 w-full sm:w-auto">
            <DefaultButton
              text="החל"
              bg="zinc-800"
              color="white"
              onClick={() => handleChangeMenuDesign(2)}
            />
            <DefaultButton
              text="לנסות"
              bg="zinc-800"
              color="white"
              onClick={() => navigate("/design2", { state: menu })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Designs;
