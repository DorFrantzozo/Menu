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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const DAY_LABELS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"]; // Sun=0…Sat=6

const EditCategoryForm = ({ category, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const item = category || {};
  const [img, setImg] = useState(null);
  const [hide, setHide] = useState(item.hide || false);
  const [name, setName] = useState(item.name || "");
  const [nameEn, setNameEn] = useState(item.nameEn || "");
  const [locationNumber, setLocationNumber] = useState(item.locationNumber || 0);
  const [isLoading, setIsLoading] = useState(false);

  // ── Scheduling ────────────────────────────────────────────────────────────
  const [hasTimeLimit, setHasTimeLimit] = useState(item.hasTimeLimit || false);
  const [activeDays, setActiveDays] = useState(
    item.activeDays?.length ? item.activeDays : [...ALL_DAYS]
  );
  const [startTime, setStartTime] = useState(item.startTime || "");
  const [endTime, setEndTime] = useState(item.endTime || "");

  const toggleDay = (dayIndex) => {
    setActiveDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("newName", name);
    formData.append("nameEn", nameEn);
    formData.append("locationNumber", locationNumber);
    formData.append("hide", hide);
    if (img) formData.append("img", img);

    // Scheduling fields
    formData.append("hasTimeLimit", hasTimeLimit);
    formData.append("startTime", hasTimeLimit ? startTime : "");
    formData.append("endTime", hasTimeLimit ? endTime : "");
    formData.append("activeDays", JSON.stringify(hasTimeLimit ? activeDays : []));

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
    <div className="fixed inset-0 bg-black/60 dark:bg-zinc-950/80 flex items-center justify-center z-50 p-4 transition-colors duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border dark:border-zinc-700/80 max-w-3xl w-full p-6 space-y-6 overflow-auto max-h-[90vh]"
        dir="rtl"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl z-10">
            <Spinner />
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-zinc-50">
          עריכת קטגוריה: {item.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100 mb-1">
              שם הקטגוריה (עברית)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100 mb-1">
              שם הקטגוריה באנגלית <span className="text-xs text-slate-400 font-normal">(אופציונלי)</span>
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              dir="ltr"
              placeholder="e.g. Starters"
              className="w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder-slate-300 dark:placeholder-zinc-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100 mb-1">
              מיקום בתפריט
            </label>
            <input
              type="number"
              value={locationNumber}
              onChange={(e) => setLocationNumber(Number(e.target.value))}
              required
              className="w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* הסתרה */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hide"
            checked={hide}
            onChange={(e) => setHide(e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-400"
          />
          <label htmlFor="hide" className="text-slate-700 dark:text-zinc-100 font-medium">
            הסתר קטגוריה
          </label>
        </div>

        {/* ── הגבלת שעות/ימים ──────────────────────────────────────────────── */}
        <div className="border border-slate-200 dark:border-zinc-700/80 rounded-xl p-5 space-y-4 bg-slate-50 dark:bg-zinc-800/20">
          {/* Toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setHasTimeLimit((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                hasTimeLimit ? "bg-amber-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  hasTimeLimit ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-100">
              הגבל שעות/ימי פעילות
            </span>
          </label>

          {/* Conditional scheduling section */}
          {hasTimeLimit && (
            <div className="space-y-5 pt-2">
              {/* ימים פעילים */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-zinc-100 mb-2">ימים פעילים</p>
                <div className="flex gap-2 flex-wrap">
                  {DAY_LABELS.map((label, idx) => {
                    const dayIndex = idx;
                    const checked = activeDays.includes(dayIndex);
                    return (
                      <button
                        key={dayIndex}
                        type="button"
                        onClick={() => toggleDay(dayIndex)}
                        className={`w-9 h-9 rounded-full text-sm font-semibold border transition ${
                          checked
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-white text-slate-600 border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 hover:border-amber-300"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* טווח שעות */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100 mb-1">
                    שעת התחלה
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100 mb-1">
                    שעת סיום
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                💡 טווחים החוצים את חצות נתמכים (לדוגמה: 22:00 עד 02:00)
              </p>
            </div>
          )}
        </div>

        {/* העלאת תמונה */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100 mb-1">
            תמונה
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 p-6 rounded-lg bg-slate-50">
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
