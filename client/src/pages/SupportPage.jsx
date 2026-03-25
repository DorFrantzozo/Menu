import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../utils/baseUrl";
import { LifeBuoy, Send } from "lucide-react";
import { motion } from "framer-motion";

const SupportPage = () => {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "תקלה טכנית",
    message: "",
    urgency: "Low",
  });

  const subjects = [
    "תקלה טכנית",
    "גבייה ותשלומים",
    "בקשת פיצ'ר חדש",
    "ניהול תפריט",
    "אחר",
  ];

  const urgencies = [
    { 
      id: "Low", 
      label: "נמוכה", 
      activeClass: "border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
    },
    { 
      id: "Medium", 
      label: "בינונית", 
      activeClass: "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
    },
    { 
      id: "Urgent", 
      label: "דחופה!", 
      activeClass: "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      return toast.error("אנא הזן הודעה");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("/support/open-ticket", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("פנייתך התקבלה, נחזור אליך בהקדם!");
      setFormData({ ...formData, message: "" });
    } catch (error) {
      console.error("Support error:", error);
      toast.error("שגיאה בשליחת הפנייה, נסה שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900/50 p-4 lg:p-8" dir="rtl">
      <div className="max-w-2xl mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <LifeBuoy size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">מרכז תמיכה</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">אנחנו כאן כדי לעזור בכל נושא</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                נושא הפנייה
              </label>
              <div className="relative">
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 pr-16 pl-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white outline-none cursor-pointer !appearance-none !bg-none"
                  style={{
                    backgroundImage: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
                  }}
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="dark:bg-zinc-800">
                      {s}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                מידת דחיפות
              </label>
              <div className="grid grid-cols-3 gap-3">
                {urgencies.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: u.id })}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                      formData.urgency === u.id
                        ? u.activeClass
                        : "border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-200 dark:hover:border-zinc-700"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                הודעה
              </label>
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ספר לנו במה אפשר לעזור..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white outline-none resize-none"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>שלח פנייה</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Info */}
        <div className="mt-8 text-center bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            מענה ממוצע לקריאות תמיכה הוא פחות מ-24 שעות. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
