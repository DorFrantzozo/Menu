import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import axiosInstance from "@/utils/baseUrl";
import { updateUser } from "@/state/user/userSlice";
import DesignCard from "../Cards/DesignCard";

import design1Tambneil from "../../assets/img/design1Tambneil.png";
import design2Tambneil from "../../assets/img/design2Tambneil.png";
import design3Tambneil from "../../assets/img/design3Tambneil.png";
import design4Tambneil from "../../assets/img/design4Tambneil.png";
import design5Tambneil from "../../assets/img/design5Tambneil.png";

const Designs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const name = user.restaurantName.toLowerCase() || "";

  const [isLoading, setIsLoading] = useState(false);
  const [menu, setMenu] = useState([]);

  const designs = [
    { img: design1Tambneil, number: 1, title: "Design 1", desc: "עיצוב מודרני ובהיר" },
    { img: design5Tambneil, number: 5, title: "Design 2", desc: "עיצוב פרימיום מודרני" },
      { img: design4Tambneil, number: 4, title: "Design 3", desc: "עיצוב צבעוני ודינאמי" },
    { img: design2Tambneil, number: 2, title: "Design 4", desc: "תצוגה קלאסית נקייה" },
    { img: design3Tambneil, number: 3, title: "Design 5", desc: "עיצוב כהה יוקרתי" },
  ,
   ,
  ];

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
      toast.success("העיצוב שונה בהצלחה");
      dispatch(updateUser(response.data.user));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
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
    fetchData();
  }, [name]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-zinc-100">בחר את עיצוב התפריט שלך</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">* לחוויה טובה תחילה הוסף את כל המנות לתפריט</p>
        <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-7xl">
          {designs.map((design) => (
            <DesignCard
              key={design.number}
              design={design}
              onTry={() => navigate(`/design${design.number}`, { state: menu })}
              onSelect={() => handleChangeMenuDesign(design.number)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Designs;
