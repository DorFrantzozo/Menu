import React from "react";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import PricingCard from "../components/Cards/PricingCard";

const faqs = [
  {
    question: "האם יש התחייבות?",
    answer:
      "לא, השירות ניתן במתכונת של מנוי חודשי ללא התחייבות. תוכלו לבטל מתי שתרצו בלחיצת כפתור.",
  },
  {
    question: "איך מקבלים מדבקות NFC?",
    answer:
      "לאחר השדרוג תוכלו להזמין מדבקות NFC חכמות וממותגות ישירות לבית העסק שלכם דרך מרכז התמיכה.",
  },
  {
    question: "מה קורה למידע שלי אם לא אשדרג?",
    answer:
      "התפריט וכל המידע ישמרו במערכת שלנו באופן מאובטח, אך הוא לא יהיה נגיש לסריקה עד להסדרת המנוי.",
  },
];

const Upgrade = () => {
  const user = useSelector((state) => state.user.user);

  if (user?.isPaid) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="relative flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      dir="rtl"
    >
      {/* --- רקע דינמי (Blobs) - שונה לירוק --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-lime-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* אייקון - שונה לירוק */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-600 text-white mb-6 shadow-xl shadow-emerald-500/20 transform hover:rotate-6 transition-transform overflow-hidden relative group">
            {/* אפקט ברק על האייקון */}
            <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1.5s_infinite]"></span>
            <span className="material-icons-round text-3xl relative z-10">
              auto_awesome
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
            חוויית ה-Premium של {/* טקסט כותרת - שונה לירוק */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500 animate-pulse">
              iMenu
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            הפוך את המסעדה שלך לדיגיטלית באמת. יותר סריקות, יותר הזמנות, וניהול
            חכם מאי פעם.
          </p>
        </div>

        {/* --- הסקציה המרכזית: איור NFC + Pricing Card --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          {/* צד ימין: איור NFC דינמי (שונה לירוק) */}
          <div className="hidden lg:flex flex-col items-center justify-center relative p-12 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative w-full max-w-md h-[400px] flex items-center justify-center relative">
              {/* הילת רקע עדינה לאיור */}
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>

              {/* המדבקה (Tag) - שונה לירוק */}
              <div className="w-40 h-40 rounded-full bg-white dark:bg-zinc-900 border-8 border-emerald-600 shadow-2xl flex items-center justify-center z-10 relative transition-transform hover:scale-110 duration-500">
                <div className="w-full h-full rounded-full border-2 border-dashed border-emerald-200 dark:border-emerald-800 animate-[spin_20s_linear_infinite] absolute" />
                <span className="material-icons-round text-6xl text-emerald-600">
                  contactless
                </span>
              </div>

              {/* גלי שידור (Ripples) - שונה לירוק */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-emerald-500/30 animate-[ping_3s_linear_infinite]" />
              <div className="absolute w-40 h-40 rounded-full border-2 border-lime-500/20 animate-[ping_3s_linear_infinite] delay-1000" />

              {/* טלפון צף - נשאר Dark אבל הפיצ'רים הפנימיים שונו לירוק */}
              <div className="absolute top-0 right-0 w-32 h-64 bg-zinc-900 rounded-[2.5rem] border-4 border-zinc-800 shadow-2xl p-2 animate-[float_4s_ease-in-out_infinite] z-20 overflow-hidden">
                <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-2" />
                <div className="w-full h-full bg-emerald-600/10 rounded-[1.5rem] flex items-center justify-center border border-emerald-900/50">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 mx-auto mb-2 flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/30 relative overflow-hidden">
                      {/* ברק על כפתור הטלפון */}
                      <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite]"></span>
                      <span className="material-icons-round text-white text-xl relative z-10">
                        restaurant_menu
                      </span>
                    </div>
                    <div className="w-16 h-2 bg-emerald-300 dark:bg-emerald-800 rounded-full mx-auto animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            {/* כיתוב מתחת לאיור */}
            <p className="mt-10 text-emerald-700 dark:text-emerald-400 font-bold text-lg flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 px-4 py-2 rounded-full ring-1 ring-emerald-600/10 shadow-inner">
              <span className="material-icons-round text-sm animate-pulse">
                sensors
              </span>
              NFC
            </p>
          </div>

          {/* צד שמאל: כרטיס המחיר */}
          <div className="flex justify-center lg:justify-start animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            <PricingCard />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-16 border-t border-zinc-200 dark:border-zinc-800 relative">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-10 text-center">
            שאלות נפוצות
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <dt className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  {/* נקודת סימון - שונה לירוק */}
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 animate-pulse" />
                  {faq.question}
                </dt>
                <dd className="mt-3 pr-6 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* אנימציות CSS נייטיב */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(20px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes shine {
          100% { left: 100%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Upgrade;
