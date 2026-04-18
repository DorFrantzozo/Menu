import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/baseUrl";
import { toast } from "react-toastify";

const MORNING_ERROR_MAP = {
  1111: "מספר עוסק / ח.פ אינו תקין. וודא שהזנת 9 ספרות.",
  1120: "כתובת האימייל שהוזנה אינה תקינה.",
  2014: "שגיאת אימות מול השרת (Credentials).",
  1112: "הגעת למכסת המסמכים החודשית בחשבון ה-Morning שלך.",
  1110: "הסכום שהוזן אינו תקין.",
  DEFAULT: "אירעה שגיאה בתהליך התשלום. אנא נסה שנית מאוחר יותר."
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, planName } = location.state || {
    amount: 2900,
    planName: "Essential",
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessId: "",
    address: "",
    city: "",
    zip: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.warn("יש לאשר את התקנון כדי להמשיך", { rtl: true });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        "/payments/checkout",
        {
          ...formData,
          planName: planName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      // חילוץ קוד השגיאה שהשרת מחזיר
      const errorCode = error.response?.data?.errorCode;
      
      // ניסיון לשלוף את ההודעה מהמילון שלנו. אם לא קיים במילון, נציג הודעה מהשרת, אחרת את הודעת ברירת המחדל.
      const errorMessage = MORNING_ERROR_MAP[errorCode] || 
                           error.response?.data?.message || 
                           MORNING_ERROR_MAP.DEFAULT;

      toast.error(`⚠️ ${errorMessage}`, {
        position: "top-right",
        rtl: true, // חשוב לתצוגה תקינה של סימני פיסוק בעברית
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-black text-center mb-6">
          סיכום הזמנה - iMenu
        </h2>

        <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center mb-8 border border-emerald-100">
          <div>
            <p className="font-bold text-emerald-900">חבילת {planName}</p>
            <p className="text-xs text-emerald-700">מנוי שנתי + הקמה</p>
          </div>
          <p className="text-xl font-black">₪{amount.toLocaleString()}</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <input
            name="fullName"
            placeholder="שם העסק / שם מלא לקבלה"
            required
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />
          <input
            name="businessId"
            placeholder="ח.פ / עוסק מורשה / ת.ז לקבלה"
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="אימייל למשלוח קבלה"
            required
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />
          <input
            name="phone"
            type="tel"
            placeholder="טלפון"
            required
            className="w-full p-3 border rounded-xl"
            onChange={handleChange}
          />

          <div className="flex gap-2">
            <input
              name="city"
              placeholder="עיר"
              className="w-1/2 p-3 border rounded-xl"
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="כתובת"
              className="w-1/2 p-3 border rounded-xl"
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start gap-2 py-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-500 leading-tight"
            >
              {" "}
              אני מאשר כי קראתי את{" "}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    "https://www.imenu-il.online/termofservice",
                    "_blank"
                  )
                }
                className="underline cursor-pointer text-blue-600"
              >
                תקנון האתר
              </button>{" "}
              ומדיניות הביטולים.
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
              agreed ? "bg-zinc-900 hover:bg-zinc-800" : "bg-gray-300"
            }`}
          >
            {loading
              ? "מתחבר לסליקה..."
              : `שלם ₪${amount.toLocaleString()} והמשך`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;