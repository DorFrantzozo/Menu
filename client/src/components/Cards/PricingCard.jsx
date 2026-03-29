import React from "react";
import {CheckCircleIcon} from "@heroicons/react/20/solid";

const features = [
  "זמן בלתי מוגבל לתפריט החכם שלך",
  "דאשבורד אנליטיקה מתקדם",
  "עדכונים חיים לללא הגבלה",
  "אפשרות להוספת מדבקות NFC חכמות",
  "תמיכה טכנית מועדפת ",
];

const PricingCard = () => {
  const handleUpgrade = () => {
    console.log("Connect to Stripe via handleUpgrade here");
    alert("מודול סליקה יחובר בקרוב!");
  };

  return (
    <div className="relative group w-full max-w-sm h-full" dir="rtl">
      {/* 1. שכבת הבסיס */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl z-0"></div>

      {/* --- 2. אפקט Siri INNER GLOW --- */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none z-10">
        {/* שים לב: החלפתי את ה-animate-[spin...] ב-animate-spin-slow המותאם אישית שלנו */}
        <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#e4e4e7_0%,#e4e4e7_10%,#a7f3d0_25%,#e4e4e7_40%,#e4e4e7_60%,#d9f99d_75%,#e4e4e7_90%,#e4e4e7_100%)] opacity-30 group-hover:opacity-100 transition-opacity duration-1000 animate-spin-slow"></div>

        {/* ב. אפקט ה-INNER GLOW + Backdrop Blur */}
        <div className="absolute inset-[4px] rounded-[2.2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border-4 border-white/20 dark:border-zinc-900/20 shadow-[inset_0_0_20px_rgba(167,243,208,0.2)] group-hover:shadow-[inset_0_0_40px_rgba(167,243,208,0.4)] transition-shadow duration-1000"></div>
      </div>

      {/* 3. הילה חיצונית עדינה */}
      <div className="absolute -inset-[10px] rounded-[3rem] bg-gradient-to-r from-emerald-200/5 to-white/5 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none z-0"></div>

      {/* --- 4. גוף הכרטיס --- */}
      <div className="relative w-full rounded-[2.5rem] p-10 flex flex-col z-20 transition-all group-hover:scale-[1.01] duration-500">
        <h3 className="text-xl font-black leading-8 text-emerald-600 dark:text-emerald-400">
          מסלול פרימיום
        </h3>
        <p className="mt-4 text-base leading-6 text-zinc-600 dark:text-zinc-400 font-medium">
          הפתרון המושלם למסעדות שרוצות את הטוב ביותר עבור הלקוחות שלהן.
        </p>
        <p className="mt-8 flex items-baseline gap-x-2">
          <span className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            ₪149
          </span>
          <span className="text-sm font-semibold leading-6 text-zinc-600 dark:text-zinc-400">
            / לחודש
          </span>
        </p>

        <button
          onClick={handleUpgrade}
          className="relative overflow-hidden mt-8 block w-full rounded-2xl bg-emerald-600 px-4 py-4 text-center text-md font-black text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-500 transition-all active:scale-95 group/btn"
        >
          <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover/btn:animate-[shine_3s_infinite]"></span>
          <span className="relative z-10">שדרג עכשיו לתכנית פרימיום</span>
        </button>

        <ul
          role="list"
          className="mt-10 space-y-4 text-sm font-semibold leading-6 text-zinc-600 dark:text-zinc-400 text-right"
        >
          {features.map((feature) => (
            <li key={feature} className="flex gap-x-4 items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center ring-1 ring-emerald-600/10">
                <CheckCircleIcon
                  className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
              </div>
              <span className="flex-1">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes shine {
          100% { left: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* כאן אתה שולט במהירות בצורה הכי מדויקת שיש */
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PricingCard;
