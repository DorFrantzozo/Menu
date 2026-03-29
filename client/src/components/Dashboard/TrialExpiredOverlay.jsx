import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PricingCard from "../Cards/PricingCard";

const TrialExpiredOverlay = ({ forceShow = false, onClose }) => {
  const user = useSelector((state) => state.user.user);
  
  const isExpired = useMemo(() => {
    if (!user || user.isPaid) return false;
    if (!user.trialExpiresAt) return false;
    return new Date(user.trialExpiresAt) <= new Date();
  }, [user]);

  // If not expired and not forced to show, render nothing
  if (!isExpired && !forceShow) return null;

  return (
    <div 
      id={forceShow ? "premium-upgrade-overlay" : "trial-expired-overlay"}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      style={forceShow ? { display: "none" } : {}}
      dir="rtl"
    >
      <div className="max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {forceShow && (
          <button 
            onClick={onClose || (() => { document.getElementById("premium-upgrade-overlay").style.display = "none"; })}
            className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors z-10 bg-black/5 rounded-full"
          >
            <span className="material-icons-round">close</span>
          </button>
        )}
        
        <div className={`p-8 text-center border-b ${isExpired ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20'}`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isExpired ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
            <span className="material-icons-round text-3xl">{isExpired ? 'error_outline' : 'workspace_premium'}</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {isExpired ? "התפריט שלך מוסתר מהלקוחות!" : "שדרוג לפרימיום"}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            {isExpired 
              ? "תקופת הניסיון שלך (14 ימים) הסתיימה. כדי להמשיך לחשוף את התפריט ללקוחות, יש לשדרג לפרימיום. כל המידע שלך שמור בבטחה!"
              : "שדרג חשבונך כדי ליהנות משירותים מתקדמים, תמיכה 24/7 וכלים חכמים לניהול המסעדה שלך."
            }
          </p>
        </div>
        
        <div className="p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-900 flex justify-center">
          <PricingCard />
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredOverlay;
