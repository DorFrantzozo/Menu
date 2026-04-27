import React from 'react';
import { CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// ייבוא המשתנים המעודכנים מהקובץ החדש
import { ALL_PLANS, GLOBAL_FEATURE_LIST } from '../../config/plans';

const SubscriptionStatusCard = ({ currentPlan = 'Essential' }) => {
  const navigate = useNavigate();
  
  // שליפת הנתונים לפי המבנה של ALL_PLANS
  const planData = ALL_PLANS[currentPlan] || ALL_PLANS['Essential'];
  const activeFeatures = planData.features;
  const isPro = currentPlan === 'iMenu PRO';

  return (
    /* h-full גורם לקומפוננטה להימתח לגובה המקסימלי של ה-Parent (למשל לצד ה-QR) */
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center justify-between h-full" dir="rtl">
      
      <div className="flex-1 w-full text-right flex flex-col h-full">
        {/* תג סטטוס */}
        <div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 mb-4 border border-emerald-100 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            התוכנית הנוכחית שלך
            </span>

            {/* שם התוכנית */}
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            {currentPlan}
            {isPro ? <span className="text-2xl">🏆</span> : <span className="text-2xl">⭐</span>}
            </h3>
        </div>

        {/* רשימת פיצ'רים דינמית - גדלה כדי למלא את המרחב */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 flex-grow">
          {GLOBAL_FEATURE_LIST.map((feature, i) => {
            const isActive = activeFeatures.includes(feature);
            
            return (
              <li key={i} className="flex items-center gap-3 text-sm transition-all">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-zinc-100 dark:bg-zinc-800/50'
                }`}>
                  {isActive ? (
                    <CheckCircle2 className="text-emerald-500 w-3.5 h-3.5" />
                  ) : (
                    <Lock className="text-zinc-400 dark:text-zinc-600 w-3 h-3" />
                  )}
                </div>
                <span className={isActive 
                  ? "text-zinc-700 dark:text-zinc-200 font-medium" 
                  : "text-zinc-400 dark:text-zinc-500 italic"
                }>
                  {feature}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* אזור שדרוג */}
      {!isPro && (
        <div className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-r border-zinc-100 dark:border-zinc-800 pt-6 md:pt-0 md:pr-8 flex items-center">
          <div className="w-full flex flex-col items-center text-center p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 bg-white dark:bg-zinc-900 shadow-sm rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h4 className="font-bold text-zinc-800 dark:text-white mb-2 leading-tight">רוצים יותר יכולות?</h4>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6">
              שדרגו עכשיו ותהנו מהזנת תפריט מלאה ועיצוב VIP.
            </p>
            <button
              onClick={() => navigate('/upgrade')}
              className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              צפה בשדרוגים
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatusCard;