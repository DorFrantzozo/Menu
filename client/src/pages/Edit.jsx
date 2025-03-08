import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useSelector } from "react-redux";
const Edit = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  if (!user) {
    navigate("/");
  }

  return (
    <div className="lg:h-[80vh]">
      <h2 className="text-2xl font-semibold  text-black sm:text-4xl flex justify-center mt-24">
        {user.restaurantName} ניהול תפריט
      </h2>
      <div className="flex justify-center mt-20">
        <Card />
      </div>
    </div>
  );
};

export default Edit;
