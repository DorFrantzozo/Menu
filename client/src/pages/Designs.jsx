import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { updateUser } from "@/state/user/userSlice";
import axiosInstance from "../utils/baseUrl";
import  CardCarousel  from "@/components/Carousel/CardCarousel";


const Designs = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const name = user.restaurantName.toLowerCase() || "";
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [menu, setMenu] = useState([]);
  const designs =[{ number: 1,title: "design 1"}, { number: 2, title: "design 2"}, { number: 3 , title: "design 3" }, { number: 4, title: "design 4"}, { number: 5, title: "design 5"}, { number: 6, title: "design 6"}];
  const handleChangeMenuDesign = async (designNumber) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/user/updateDesign`,
        { number: designNumber, userId: user._id },
        { 
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          } 
        }
      );
      toast.success(designNumber);
      dispatch(updateUser(response.data.user));
    } catch (error) {
      toast.error("שגיאה בעדכון עיצוב");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (name) => {
    try {
      const response = await axiosInstance.get("/user/find", {
        params: { name },
      });

      setMenu(response.data);
    } catch (error) {
      toast.error("שגיאה בטעינת התפריט");
    }
  };
  useEffect(() => {
    fetchData(name);
  }, [name]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="min-h-screen dark:bg-zinc-950 transition-colors duration-200 pt-10">
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-zinc-100 mb-8">
          בחר עיצוב לתפריט הדיגיטלי
        </h1>
        <div className="flex flex-col items-center mb-20">
        <CardCarousel
          designs={designs}
          onSelect={handleChangeMenuDesign}
          onTry={(designNumber) => navigate(`/design${designNumber}`, { state: menu })}
        />
        </div>
      </div>
    </>
  );
};

export default Designs;
