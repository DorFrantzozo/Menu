import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import axiosInstance from "@/utils/baseUrl";
import {
  setMenuCategories,
  updateMenuCategories,
} from "@/state/menu/menuCategoriesSlice";
import {
  getAllDishesAndMapToCategories,
  getCategories,
} from "@/utils/fetchData";

export default function AddCategoryForm({ onCancel }) {
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector((state) => state.menuCategories.menuCategories);
  const dispatch = useDispatch();

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Calculate new location number
    const maxLocation = menuCategories.reduce(
      (max, cat) => (cat.locationNumber > max ? cat.locationNumber : max),
      0
    );
    const newLocationNumber = menuCategories.length > 0 ? maxLocation + 1 : 0;

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);

    formData.append("locationNumber", newLocationNumber);
    formData.append("description", description);
    if (img) formData.append("img", img);

    try {
      setIsLoading(true);
      await axiosInstance.post(`/category/createCategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedCategories = await getCategories(user._id);
      dispatch(updateMenuCategories(updatedCategories));
      const categoriesWithDishes = await getAllDishesAndMapToCategories(
        user,
        updatedCategories
      );

      dispatch(setMenuCategories(categoriesWithDishes));
      setIsLoading(false);
      toast.success("הקטגוריה נוספה בהצלחה");
      // אם תרצה כאן ניתן להוסיף פעולה לסגירת הטופס
      if (onCancel) onCancel();
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
        <div className="fixed -inset-full z-50 flex items-center justify-center bg-black/40">
          <Spinner />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg space-y-8"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800">
          יצירת קטגוריה חדשה
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* שם הקטגוריה */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              שם הקטגוריה (עברית)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
              placeholder="לדוגמה: ראשונות"
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
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
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
            <label className="mt-4 inline-block cursor-pointer rounded bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white shadow hover:from-amber-600 hover:to-orange-600 transition">
              העלה תמונה
              <input
                type="file"
                name="img"
                onChange={(e) => {
                  setImg(e.target.files[0]);
                  if (img) {
                    setPreviewUrl(URL.createObjectURL(img));
                  }
                }}
                className="sr-only"
              />
            </label>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF עד 10MB</p>
          </div>
        </div>

        {/* כפתורים */}
        <div className="flex justify-center gap-6 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-amber-500 px-6 py-2 text-amber-600 hover:bg-zinc-100 transition"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition"
          >
            שמור
          </button>
        </div>
      </form>
    </>
  );
}
