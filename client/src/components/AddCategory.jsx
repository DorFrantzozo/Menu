import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import axiosInstance from "../utils/baseUrl";
import {
  setMenuCategories,
  updateMenuCategories,
} from "@/state/menu/menuCategoriesSlice";
import { getCategories } from "@/utils/fetchData";

export default function AddCategory() {
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationNumber, setLocationNumber] = useState(0);
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    formData.append("locationNumber", locationNumber);
    formData.append("description", description);
    formData.append("img", img);

    try {
      setIsLoading(true);
      await axiosInstance.post(`/category/createCategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedCategories = await getCategories(user); //sets categories
      //now handle dishes too
      dispatch(updateMenuCategories(updatedCategories));
      const categoriesWithDishes = await getAllDishesAndMapToCategories(
        user,
        updatedCategories
      );
      dispatch(setMenuCategories(categoriesWithDishes));
      console.log(categoriesWithDishes);

      setIsLoading(false);
      toast.success("הקטגוריה נוספה בהצלחה");
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message || error.message || "שגיאה התרחשה";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <Spinner />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg space-y-8"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800">
          יצירת קטגוריה חדשה
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* שם הקטגוריה */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              שם הקטגוריה
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
          </div>

          {/* מספר מיקום */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              מספר מיקום
            </label>
            <span className="text-xs text-slate-500 block mb-1">
              מייצג את הסדר בתפריט (מתחיל מ־0)
            </span>
            <input
              type="number"
              required
              value={locationNumber}
              onChange={(e) => setLocationNumber(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
          </div>
        </div>

        {/* תיאור */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            תיאור הקטגוריה{" "}
            <span className="text-xs text-slate-400">(אופציונלי)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </div>

        {/* העלאת תמונה */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            תמונה
          </label>
          <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-6 rounded-lg bg-slate-50">
            <PhotoIcon className="h-12 w-12 text-slate-400" />
            {img && (
              <p className="mt-2 text-sm text-green-600">
                קובץ שנבחר: {img.name}
              </p>
            )}
            <label className="mt-4 inline-block cursor-pointer rounded bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-white shadow hover:from-green-500 hover:to-green-700 transition">
              העלה תמונה
              <input
                type="file"
                name="img"
                onChange={(e) => setImg(e.target.files[0])}
                className="sr-only"
              />
            </label>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF עד 10MB</p>
          </div>
        </div>

        {/* כפתורים */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="submit"
            className="rounded-md bg-gradient-to-r from-green-500 to-green-600 px-5 py-2 text-white shadow-md hover:from-green-600 hover:to-green-700 transition"
          >
            שמור
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-md px-5 py-2 text-slate-600 hover:text-slate-800"
          >
            ביטול
          </button>
        </div>
      </form>
    </>
  );
}
