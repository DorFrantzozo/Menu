import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import design1Tambneil from "../assets/img/design1Tambneil.png";
import design2Tambneil from "../assets/img/design2Tambneil.png";
import design3Tambneil from "../assets/img/design3Tambneil.png";
import design4Tambneil from "../assets/img/design4Tambneil.png";
import DefaultButton from "@/components/buttons/DefaultButton";
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
  const designs =[{img: design1Tambneil, number: 1,title: "design 1"}, {img: design2Tambneil, number: 2, title: "design 2"}, {img: design3Tambneil, number: 3 , title: "design 3" }, {img: design4Tambneil, number: 4, title: "design 4"}];
  const handleChangeMenuDesign = async (designNumber) => {
    setIsLoading(true);
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
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(name);
  }, [name]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="flex flex-col items-center mt-10 mb-20">
        <CardCarousel
          designs={designs}
          onSelect={handleChangeMenuDesign}
          onTry={(designNumber) => navigate(`/design${designNumber}`, { state: menu })}
        />
      </div>
    </>
  );
};

export default Designs;
