import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DropDown from "./DropDown";
import axiosInstance from "../utils/baseUrl";
import Spinner from "./Spinner";
import {
  getCategories,
  getAllDishesAndMapToCategories,
  fetchCategoriesAndDishes,
} from "@/utils/fetchData";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";

export default function AddDish() {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [pregnant, setPregnant] = useState(false);
  const [gluten, setGluten] = useState(false);
  const [lactose, setLactose] = useState(false);
  const [vegi, setVegi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    formData.append("nameEn", nameEn);
    formData.append("img", img);
    formData.append("description", description);
    formData.append("descriptionEn", descriptionEn);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("pregnant", pregnant);
    formData.append("gluten", gluten);
    formData.append("vegi", vegi);
    formData.append("lactose", lactose);

    try {
      setIsLoading(true);
      await axiosInstance.post(`/dish/createDish/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const categories = await getCategories(user._id);
      const categoriesWithDishes = await getAllDishesAndMapToCategories(
        user,
        categories
      );
      dispatch(setMenuCategories(categoriesWithDishes));

      const { categories: newCategories, dishes: newDishes } =
        await fetchCategoriesAndDishes(user._id);
      localStorage.setItem(
        `menu_${user.restaurantName}`,
        JSON.stringify({ categories: newCategories, dishes: newDishes })
      );
      localStorage.setItem("categories", JSON.stringify(categoriesWithDishes));

      toast.success("המנה נוספה בהצלחה");
      navigate("/dashboard");
    } catch (error) {
      toast.error("שגיאה בעת הוספת המנה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 right-0 w-full h-full bg-black/40 z-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <div dir="rtl" className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">הוספת מנה חדשה</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">שם המנה</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                שם המנה באנגלית <span className="text-xs text-slate-400 font-normal">(אופציונלי)</span>
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                dir="ltr"
                placeholder="e.g. Hamburger"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-green-500 focus:border-green-500 placeholder-slate-300"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">מחיר <span className="text-xs text-slate-400 font-normal">(אופציונלי)</span></label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <DropDown setCategory={setCategory} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">תיאור</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="תיאור מרכיבי המנה"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                תיאור באנגלית <span className="text-xs text-slate-400 font-normal">(אופציונלי)</span>
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-green-500 focus:border-green-500 placeholder-slate-300"
                placeholder="Dish description"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">תמונה</label>
            <div className="border border-dashed border-slate-400 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
              <PhotoIcon className="h-10 w-10 text-slate-400" />
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => setImg(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="mt-3 cursor-pointer text-green-700 hover:underline">
                {img ? `הקובץ שנבחר: ${img.name}` : "העלה תמונה"}
              </label>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG, עד 10MB</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-slate-700 mb-2">התאמות ורגישויות</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "מתאים לצמחונים / טבעונים", value: vegi, setter: setVegi },
                { label: "מתאים לרגישות ללקטוז", value: lactose, setter: setLactose },
                { label: "מתאים להריוניות", value: pregnant, setter: setPregnant },
                { label: "מתאים לרגישות לגלוטן", value: gluten, setter: setGluten },
              ].map(({ label, value, setter }, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className="h-4 w-4 text-green-500 border-gray-300 rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="text-sm text-slate-600 hover:text-slate-800"
              onClick={() => navigate("/dashboard")}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow"
            >
              שמור מנה
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
