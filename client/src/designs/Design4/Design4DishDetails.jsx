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
    <div className="min-h-screen bg-white pb-20 relative flex flex-col items-center">
      <motion.div
        // הוספנו הגבלת רוחב למסכים גדולים: max-w-4xl כדי שלא יימרח על כל המסך
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={dish.img}
          alt={dish.name}
          // מחקנו את ה-md:object-fill. הוספנו עיגול פינות עדין במסכים גדולים (md:rounded-b-2xl)
          // והקטנו טיפה את הגובה במסך גדול מ-800 ל-500 כדי שזה לא יתפוס את כל הגלילה
          className="w-full h-72 md:h-[500px] object-cover shadow-md mb-6 md:rounded-b-3xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* עטפנו את התוכן עם padding שונה למובייל ומחשב */}
        <div className="space-y-4 px-4 md:px-8 text-center md:text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {dish.name}
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {dish.description}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3">
            {dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price ? (
              <>
                <p className="text-3xl text-emerald-600 font-bold">{dish.salePrice} ₪</p>
                <p className="text-xl text-red-500 line-through opacity-70 font-bold">{dish.price} ₪</p>
              </>
            ) : (
              <p className="text-2xl text-gray-900 font-bold">{dish.price} ₪</p>
            )}
          </div>
          
          <div className="text-gray-600 flex justify-center md:justify-start pt-2">
            <Allergies dish={dish} />
          </div>
        </div>
      </motion.div>
      
      <hr className="border-gray-300 h-px w-[80%] max-w-4xl mt-10" />
      
      <button
        onClick={() => navigate(-1)}
        className="text-black flex items-center gap-2 mt-10 hover:text-gray-600 transition-colors font-medium text-lg"
      >
        <ArrowRight size={24} />
        חזרה לתפריט
      </button>
    </div>
  );
};

export default Design4DishDetails;