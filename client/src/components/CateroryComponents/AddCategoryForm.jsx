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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const DAY_LABELS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"]; // Sun=0…Sat=6

export default function AddCategoryForm({ onCancel }) {
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector((state) => state.menuCategories.menuCategories);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ── Scheduling ────────────────────────────────────────────────────────────
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [activeDays, setActiveDays] = useState([...ALL_DAYS]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const toggleDay = (dayIndex) => {
    setActiveDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    // Scheduling fields
    formData.append("hasTimeLimit", hasTimeLimit);
    if (hasTimeLimit) {
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("activeDays", JSON.stringify(activeDays));
    }

    try {
      setIsLoading(true);
      await axiosInstance.post(`/category/createCategory`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
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
        className="max-w-3xl mx-auto mt-12 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border dark:border-zinc-700/80 space-y-8 transition-colors duration-200"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-zinc-50">
          יצירת קטגוריה חדשה
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* שם הקטגוריה */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100">
              שם הקטגוריה (עברית)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
              placeholder="לדוגמה: ראשונות"
            />
          </div>
        </div>

        {/* תיאור */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-100">
            תיאור הקטגוריה{" "}
            <span className="text-xs text-slate-400 dark:text-zinc-400">(אופציונלי)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
          />
        </div>

        {/* העלאת תמונה */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            תמונה
          </label>
          <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 p-6 rounded-lg bg-slate-50">
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
                  if (e.target.files[0]) {
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="sr-only"
              />
            </label>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF עד 10MB</p>
          </div>
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
            <span className="text-sm font-medium text-slate-700">
              הגבל שעות/ימי פעילות
            </span>
          </label>

          {/* Conditional scheduling section */}
          {hasTimeLimit && (
            <div className="space-y-5 pt-2">
              {/* ימים פעילים */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">ימים פעילים</p>
                <div className="flex gap-2 flex-wrap">
                  {DAY_LABELS.map((label, idx) => {
                    const dayIndex = idx; // 0=Sun…6=Sat
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
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

        {/* כפתורים */}
        <div className="flex justify-center gap-6 pt-4">
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
