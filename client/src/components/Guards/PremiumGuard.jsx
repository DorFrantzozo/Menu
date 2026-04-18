import React from "react";
import { useNavigate } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/solid";

const planTiers = { "Essential": 1, "Advance": 2, "iMenu PRO": 3 };

const PremiumGuard = ({ requiredPlan, currentPlan, children }) => {
  const navigate = useNavigate();
  const currentTier = planTiers[currentPlan] || 1;
  const requiredTier = planTiers[requiredPlan] || 1;
  const isAllowed = currentTier >= requiredTier;

  if (isAllowed) return <>{children}</>;

  return (
    <div className="relative w-full h-full min-h-full flex flex-col rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      
      {/* התוכן המטושטש */}
      <div className="w-full h-full flex-1 filter  blur-[12px] opacity-40 pointer-events-none select-none">
        {children}
      </div>

      {/* שכבת הנעילה - Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/70 backdrop-blur-md p-6 text-center z-50 rounded-2xl border-none shadow-none">
        
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-xl mb-4">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
        </div>

        <h4 className="text-zinc-900 dark:text-white font-extrabold text-xl mb-1">
          שדרג ל-{requiredPlan}
        </h4>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-[220px]">
          כדי לפתוח את תובנות ה-AI
        </p>
        
        <button
          onClick={() => navigate("/upgrade")}
          className="w-full max-w-[240px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-transform"
        >
          שדרג עכשיו
        </button>
      </div>
    </div>
  );
};

export default PremiumGuard;