import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import axiosInstance from "@/utils/baseUrl";
import {
  getAllDishesAndMapToCategories,
  getCategories,
} from "@/utils/fetchData";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";

const EditDishForm = ({dish,setShowEditForm}) => {
  const navigate = useNavigate();
  console.log(dish)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");

  const location = useLocation();
//   const { item } = location.state || {};
//   const dish = item?.item;

  const [dishName, setDishName] = useState(dish?.name || "");
  const [description, setDescription] = useState(dish?.description || "");
  const [price, setPrice] = useState(dish?.price || "");
  const [img, setImg] = useState(null);
  const [gluten, setGluten] = useState(dish?.gluten || false);
  const [pregnant, setPregnant] = useState(dish?.pregnant || false);
  const [lactose, setLactose] = useState(dish?.lactose || false);
  const [vegi, setVegi] = useState(dish?.vegi || false);
  const [hide, setHide] = useState(dish?.hide || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", dishName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("gluten", gluten);
    formData.append("pregnant", pregnant);
    formData.append("lactose", lactose);
    formData.append("vegi", vegi);
    formData.append("category", dish?.category);
    formData.append("hide", hide);
    if (img) formData.append("img", img);

    try {
      await axiosInstance.put(
        `/dish/updateDish/${user._id}/${dish._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const categories = await getCategories(user);
      const categoriesWithDishes = await getAllDishesAndMapToCategories(
        user,
        categories
      );
      dispatch(setMenuCategories(categoriesWithDishes));
      toast.success("המנה עודכנה בהצלחה");
      setShowEditForm(false);
    } catch (error) {
      console.error(error);
      toast.error("שגיאה בעדכון המנה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-6 space-y-6 overflow-auto max-h-[90vh]"
        dir="rtl"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl z-10">
            <Spinner />
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-slate-800">
          עריכת מנה: {dish?.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              שם המנה
            </label>
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              מחיר
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            תיאור המנה
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none resize-y"
          />
        </div>

        {/* תכונות המנה */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "ללא גלוטן", value: gluten, setter: setGluten },
            { label: "מתאים להריון", value: pregnant, setter: setPregnant },
            { label: "ללא לקטוז", value: lactose, setter: setLactose },
            { label: "צמחוני", value: vegi, setter: setVegi },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => item.setter(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-400"
              />
              <label className="text-slate-700 font-medium">{item.label}</label>
            </div>
          ))}
        </div>

        {/* הסתרה */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hide}
            onChange={(e) => setHide(e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-400"
          />
          <label className="text-slate-700 font-medium">הסתר מנה</label>
        </div>

        {/* העלאת תמונה */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            תמונה
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-6 rounded-lg bg-slate-50">
            {dish?.img || img ? (
              <img
                src={img ? URL.createObjectURL(img) : dish?.img}
                alt="dish"
                className="w-full max-w-xs rounded-md mb-4"
              />
            ) : (
              <div className="text-slate-400 mb-4">אין תמונה</div>
            )}
            <label className="cursor-pointer bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded shadow hover:from-amber-500 hover:to-amber-700 transition">
              בחר תמונה
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">PNG, JPG, עד 10MB</p>
          </div>
        </div>

        {/* כפתורים */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowEditForm(false)}
            className="px-6 py-2 rounded-md border border-amber-400 text-amber-600 hover:bg-amber-100 transition"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 transition"
          >
            שמור
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDishForm;
