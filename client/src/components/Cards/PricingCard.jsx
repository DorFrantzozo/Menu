import React from "react";

const PricingCard = ({plan, price, features, isBestValue, onUpgrade, isCurrentPlan}) => {
  const isPro = plan === "iMenu PRO";
  const isEssential = plan === "Essential";

  return (
    <div
      className={`group relative flex flex-col p-8 rounded-[3rem] transition-all duration-700 bg-white dark:bg-zinc-900 border-2 ${
        isBestValue
          ? "border-emerald-500 z-20 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
          : "border-zinc-100 dark:border-zinc-800 z-10"
      } hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:z-30`}
    >
      {/* --- Siri Glow טבעי (לא מהבהב) --- */}
      {isBestValue && (
        <div className="absolute -inset-[4px] rounded-[3.2rem] bg-gradient-to-tr from-emerald-500/30 via-lime-400/30 to-emerald-600/30 blur-[20px] -z-10 animate-siri-slow" />
      )}

      {/* תגית BEST VALUE */}
      {isBestValue && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg uppercase z-30">
          Best Value
        </div>
      )}

      {/* Header */}
      <div className="mb-8 text-right relative z-10">
        <div className="flex items-center justify-end gap-2 mb-2">
          <h3
            className={`text-2xl font-black ${isBestValue ? "text-emerald-600" : "text-zinc-900 dark:text-white"}`}
          >
            {plan}
          </h3>
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              isPro
                ? "bg-purple-500 shadow-[0_0_10px_#a855f7]"
                : isEssential
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : "bg-emerald-500 shadow-[0_0_10px_#10b981]"
            }`}
          />
        </div>
        <div className="flex items-baseline justify-end gap-1" dir="ltr">
          <span className="text-4xl font-black text-zinc-900 dark:text-white">
            ₪{price}
          </span>
          <span className="text-zinc-400 font-bold text-xs">/YEAR</span>
        </div>
      </div>

      {/* Features List - V מימין וירוק */}
      <ul className="flex-1 space-y-5 mb-10 text-right relative z-10" dir="rtl">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400"
          >
            <span className="material-icons-round text-[20px] text-emerald-500">
              check_circle
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={onUpgrade}
        disabled={isCurrentPlan}
        className={`relative overflow-hidden w-full py-4 rounded-[1.5rem] font-black text-sm transition-all z-10 ${
          isCurrentPlan 
            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border-2 border-transparent"
            : isBestValue
              ? "bg-emerald-600 text-white shadow-lg active:scale-95 group-hover/btn:animate-[shine_1.5s_infinite] group/btn"
              : "bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-95 group/btn"
        }`}
      >
        {!isCurrentPlan && (
          <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover/btn:animate-[shine_1.5s_infinite]"></span>
        )}
        {isCurrentPlan ? "התוכנית הנוכחית שלך" : "בחר מסלול קדימה"}
      </button>

      {/* CSS לאנימציה הטבעית */}
      <style>{`
        @keyframes siri-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        .animate-siri-slow {
          animation: siri-slow 4s ease-in-out infinite;
        }
        @keyframes shine { 100% { left: 100%; } }
      `}</style>
    </div>
  );
};

export default PricingCard;
