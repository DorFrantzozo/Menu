import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
const Edit = () => {
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();

  // Run the useEffect only when user is updated, not on initial render
  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to homepage if no user
    }
  }, [user, navigate]); // Added user as dependency to trigger useEffect when it changes

  // Conditional rendering to avoid trying to access restaurantName if user is null
  if (!user) {
    return (
      <div>
        <Spinner />
        ...
      </div>
    ); // Or a spinner/loading component
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
