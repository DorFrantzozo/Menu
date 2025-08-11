import { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DropDown from "../DropDown";
import axiosInstance from "@/utils/baseUrl";
import Spinner from "../Spinner";
import {
  getCategories,
  getAllDishesAndMapToCategories,
  fetchCategoriesAndDishes,
} from "@/utils/fetchData";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";

export default function AddDishForm({ closeModal }) {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
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
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("pregnant", pregnant);
    formData.append("gluten", gluten);
    formData.append("vegi", vegi);
    formData.append("lactose", lactose);
    formData.append("img", img);
    if (!img) {
      toast.error("חובה להעלות תמונה");
      return;
    }

    try {
      setIsLoading(true);
      console.log(formData);
      await axiosInstance.post(`/dish/createDish/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const categories = await getCategories(user);
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
      setIsLoading(false);
      closeModal();
    } catch (error) {
      toast.error("שגיאה בעת הוספת המנה");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <div dir="rtl" className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          הוספת מנה חדשה
        </h2>
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-sky-200 focus:border-sky-200"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">מחיר</label>
              <input
                type="number"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:ring-sky-200 focus:border-sky-200"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <DropDown setCategory={setCategory} />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">תיאור</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl h-28 focus:ring-sky-200 focus:border-sky-200"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-2">תמונה</label>
            <div className="border border-dashed border-slate-400 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="תצוגה מקדימה"
                  className="max-h-48 mb-4 rounded-lg shadow"
                />
              )}
              {img ? null : <PhotoIcon className="h-10 w-10 text-slate-400" />}
              <input
                type="file"
                className="hidden"
                id="file-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImg(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
              <label
                htmlFor="file-upload"
                className="mt-3 cursor-pointer text-sky-400 hover:underline"
              >
                {img ? `הקובץ שנבחר: ${img.name}` : "העלה תמונה"}
              </label>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG, עד 10MB</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-slate-700 mb-2">
              התאמות ורגישויות
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "מתאים לצמחונים / טבעונים",
                  value: vegi,
                  setter: setVegi,
                },
                {
                  label: "מתאים לרגישות ללקטוז",
                  value: lactose,
                  setter: setLactose,
                },
                {
                  label: "מתאים להריוניות",
                  value: pregnant,
                  setter: setPregnant,
                },
                {
                  label: "מתאים לרגישות לגלוטן",
                  value: gluten,
                  setter: setGluten,
                },
              ].map(({ label, value, setter }, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className="h-4 w-4 text-sky-400 border-gray-250 rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="text-sm text-slate-600 border bg-zinc-50 rounded-lg p-3 hover:text-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
              onClick={closeModal}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r text-white from-sky-400 via-sky-500 to-sky-700 px-4 py-2 rounded-lg text-sm shadow hover:shadow-xl transition-all duration-300"
            >
              שמור מנה
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
