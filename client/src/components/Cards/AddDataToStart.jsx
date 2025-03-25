import { PlusCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AddDataToStart = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-2xl semibold text-center" dir="rtl">
        נראה שעדיין לא שיתפת מידע....
      </h1>
      <div className=" flex   justify-center">
        <button
          onClick={() => navigate("/edit")}
          className=" text-green-500 hover:text-green-600 hover:scale-150 transition-all duration-300"
        >
          <PlusCircleIcon />
        </button>

        <h1 className="text-2xl text-center ms-4 ">הוסף קטגוריה כדי להתחיל</h1>
      </div>
    </div>
  );
};

export default AddDataToStart;
