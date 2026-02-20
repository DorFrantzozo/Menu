import { useLocation, useNavigate } from "react-router-dom";
import useTrackDishView from "@/hooks/useTrackDishView";
import Allergies from "@/components/sensitivities/Allergies";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Design4DishDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dish = location.state?.dish;

  useTrackDishView(dish?._id);

  if (!dish) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">לא נמצאה מנה להצגה</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white  pb-20 relative flex flex-col items-center"
    >
      <motion.div
        className="w-full  "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={dish.img}
          alt={dish.name}
          className="w-full h-72 md:h-[800px] md:object-fill object-cover  shadow-md mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <div className="space-y-3 px-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {dish.name}
          </h2>
          <h2 className="text-xl  text-gray-900">
            {dish.description}
          </h2>
          <p className="text-lg text-gray-700 font-semibold">{dish.price} ₪</p>
          <div className="text-gray-600 flex justify-center leading-relaxed ">
            <Allergies dish={dish} />
          </div>
        </div>
      </motion.div>
      <hr className="text-black h-2 w-[80%] mt-10" />
      <button
        onClick={() => navigate(-1)}
        className=" text-black flex items-center gap-1 mt-20"
      >
        <ArrowRight size={20} />
        חזרה
      </button>
    </div>
  );
};

export default Design4DishDetails;
