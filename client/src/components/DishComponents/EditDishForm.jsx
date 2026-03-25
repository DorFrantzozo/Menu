import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import axiosInstance from "@/utils/baseUrl";
import {
  getAllDishesAndMapToCategories,
  getCategories,
} from "@/utils/fetchData";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";

const EditDishForm = ({ dish, setShowEditForm }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");

  // State בסיסי
  const [dishName, setDishName] = useState(dish?.name || "");
  const [description, setDescription] = useState(dish?.description || "");
  const [price, setPrice] = useState(dish?.price || "");
  const [salePrice, setSalePrice] = useState(dish?.salePrice || "");
  const [discountPercent, setDiscountPercent] = useState("");
  
  // State נוסף
  const [img, setImg] = useState(null);
  const [gluten, setGluten] = useState(dish?.gluten || false);
  const [pregnant, setPregnant] = useState(dish?.pregnant || false);
  const [lactose, setLactose] = useState(dish?.lactose || false);
  const [vegi, setVegi] = useState(dish?.vegi || false);
  const [hide, setHide] = useState(dish?.hide || false);
  const [isLoading, setIsLoading] = useState(false);

  // חישוב אחוז הנחה ראשוני בטעינה אם יש salePrice
  useEffect(() => {
    if (dish?.salePrice && dish?.price) {
      const percent = Math.round(100 - (dish.salePrice / dish.price) * 100);
      setDiscountPercent(percent);
    }
  }, [dish]);

  // לוגיקת עדכון מחיר לפי אחוז
  const handlePercentChange = (percent) => {
    setDiscountPercent(percent);
    if (price && percent) {
      const newSalePrice = Math.round(price - (price * percent) / 100);
      setSalePrice(newSalePrice);
    } else {
      setSalePrice("");
    }
  };

  // לוגיקת עדכון אחוז לפי מחיר סופי
  const handleSalePriceChange = (sPrice) => {
    setSalePrice(sPrice);
    if (price && sPrice) {
      const percent = Math.round(100 - (sPrice / price) * 100);
      setDiscountPercent(percent);
    } else {
      setDiscountPercent("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(salePrice);
    const formData = new FormData();
    formData.append("name", dishName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("salePrice", salePrice || 0); // שליחת מחיר המבצע
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
      const categoriesWithDishes = await getAllDishesAndMapToCategories(user, categories);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-6 overflow-auto max-h-[90vh] relative"
        dir="rtl"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl z-20">
            <Spinner />
          </div>
        )}

        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-slate-800">עריכת מנה: {dish?.name}</h2>
          <button type="button" onClick={() => setShowEditForm(false)} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* פרטים בסיסיים */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">שם המנה</label>
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">מחיר מקורי (₪)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* אזור הנחות - מעוצב מחדש */}
        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
          <label className="block text-sm font-bold text-amber-800 mb-3">ניהול מבצע והנחה</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-medium text-amber-700 mb-1 block">אחוז הנחה (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => handlePercentChange(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="absolute left-3 top-9 text-amber-400">%</span>
            </div>
            <div className="relative">
              <label className="text-xs font-medium text-amber-700 mb-1 block">מחיר מבצע סופי (₪)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => handleSalePriceChange(e.target.value)}
                placeholder="מחיר לאחר הנחה"
                className="w-full rounded-xl border border-amber-200 px-4 py-2 font-bold text-amber-600 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="absolute left-3 top-9 text-amber-400">₪</span>
            </div>
          </div>
          {salePrice && price && (
            <p className="text-xs text-amber-600 mt-2 font-medium">
              הלקוח יחסוך {price - salePrice} ₪ מהמחיר המקורי
            </p>
          )}
        </div>

        {/* תיאור */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">תיאור המנה</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none transition-all"
          />
        </div>

        {/* תכונות צ'קבוקסים */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-2">
          {[
            { label: "ללא גלוטן", value: gluten, setter: setGluten },
            { label: "מתאים להריון", value: pregnant, setter: setPregnant },
            { label: "ללא לקטוז", value: lactose, setter: setLactose },
            { label: "צמחוני", value: vegi, setter: setVegi },
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => item.setter(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 transition-all"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
            </label>
          ))}
        </div>

        {/* הסתרה והעלאת תמונה */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
           <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
            <input
              type="checkbox"
              checked={hide}
              onChange={(e) => setHide(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-400"
            />
            <label className="text-sm font-bold text-slate-700">הסתר מנה מהתפריט</label>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center">
            {dish?.img || img ? (
              <img
                src={img ? URL.createObjectURL(img) : dish?.img}
                alt="preview"
                className="w-32 h-32 object-cover rounded-xl shadow-md mb-3"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-2 text-slate-400">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            <label className="cursor-pointer bg-white border border-amber-400 text-amber-600 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-amber-50 transition-all">
              החלף תמונה
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImg(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setShowEditForm(false)}
            className="px-8 py-2.5 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 transition-all"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="px-10 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-white font-bold shadow-lg shadow-amber-200 hover:scale-105 active:scale-95 transition-all"
          >
            שמור שינויים
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDishForm;