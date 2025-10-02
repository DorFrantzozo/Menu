import { useState } from "react";

import Spinner from "../Spinner";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { updateMenuCategories } from "@/state/menu/menuCategoriesSlice";
import {
  getCategories,
  getAllDishesAndMapToCategories,
} from "@/utils/fetchData";
import { useNavigate } from "react-router-dom";

const EditCategoryForm = ({ category, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // השתמש ב-props שמגיעים
  const item = category || {};
  const [img, setImg] = useState(null);
  const [hide, setHide] = useState(item.hide || false);
  const [name, setName] = useState(item.name || "");
  const [locationNumber, setLocationNumber] = useState(
    item.locationNumber || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("newName", name);
    formData.append("locationNumber", locationNumber);
    formData.append("hide", hide);
    if (img) formData.append("img", img);

    try {
      await axiosInstance.put(
        `/category/updateCategory/${user._id}/${item._id}`,
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
      dispatch(updateMenuCategories(categoriesWithDishes));

      toast.success("קטגוריה עודכנה בהצלחה");
      navigate("/dashboard");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "שגיאה בעדכון קטגוריה");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50 p-4">
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
          עריכת קטגוריה: {item.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* שדות טקסט */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              שם הקטגוריה
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              מיקום בתפריט
            </label>
            <input
              type="number"
              value={locationNumber}
              onChange={(e) => setLocationNumber(Number(e.target.value))}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* תיבת הסתרה */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hide"
            checked={hide}
            onChange={(e) => setHide(e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-400"
          />
          <label htmlFor="hide" className="text-slate-700 font-medium">
            הסתר קטגוריה
          </label>
        </div>

        {/* העלאת תמונה */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            תמונה
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-6 rounded-lg bg-slate-50">
            {item.img || img ? (
              <img
                src={img ? URL.createObjectURL(img) : item.img}
                alt="category"
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
            <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF עד 10MB</p>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
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

export default EditCategoryForm;
