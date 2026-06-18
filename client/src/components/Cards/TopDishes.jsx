import React, { useState, useCallback } from "react";
import { getTopDishes } from "@/utils/fetchData";
import Spinner from "@/components/Spinner";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { useNavigate } from "react-router-dom";

const TopDishes = ({
  userId,
  sortBy = "views",
  title = "מנות פופולריות",
  isTeaserMode = false,
}) => {
  const [period, setPeriod] = useState("month");
  const navigate = useNavigate();

  const fetchTopDishesData = useCallback(async () => {
    if (!userId) return [];
    return await getTopDishes(userId, period, sortBy);
  }, [userId, period, sortBy]);

  const { data, isLoading, error } = useCachedFetch(
    userId ? `top_dishes_${userId}_${period}_${sortBy}` : null,
    fetchTopDishesData,
    [userId, period, sortBy],
  );

  const dishes = data || [];
  const isLikes = sortBy === "likes";
  const showLockedOverlay = isTeaserMode && isLikes;

  // הגבלת כמות המנות שמרנדרים במובייל/מצב נעול כדי למנוע חשיפת מידע
  const displayDishes = showLockedOverlay ? dishes.slice(0, 3) : dishes.slice(0, 10);

  const getRankBadgeColor = (index) => {
  switch (index) {
    case 0: 
      // מקום ראשון - ירוק מותג חזק ובולט
      return "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"; 
    case 1: 
      // מקום שני - ירוק מעט יותר כהה/שקוף
      return "bg-emerald-600/80 text-emerald-50"; 
    case 2: 
      // מקום שלישי - ירוק כהה עם יותר שקיפות
      return "bg-emerald-700/60 text-emerald-100"; 
    default: 
      // שאר המקומות - ניטרלי כדי לא לגנוב את הפוקוס
      return "bg-zinc-800 text-zinc-400 border border-zinc-700/50"; 
  }
};

const getProgressColor = (index) => {
  // במידה ומדובר ב"לייקים" - נשתמש בסכמה של אדום/רוז (סמנטי ללב)
  if (isLikes) {
    switch (index) {
      case 0: return "bg-rose-500";         // מקום 1: בולט
      case 1: return "bg-rose-500/80";      // מקום 2: מעט שקוף
      case 2: return "bg-rose-500/60";      // מקום 3: עוד יותר שקוף
      default: return "bg-rose-500/30";     // כל השאר: רקע עדין
    }
  }

  // סכמה רגילה (ירוק מותג) - היררכיה מונוכרומטית
  switch (index) {
    case 0: return "bg-emerald-500";        // הצבע המוביל
    case 1: return "bg-emerald-500/80";     // דרגה שנייה
    case 2: return "bg-emerald-500/60";     // דרגה שלישית
    default: return "bg-emerald-500/30";    // שאר הרשימה
  }
};
  const maxValue = dishes.length > 0
    ? Math.max(...dishes.map((d) => (isLikes ? d.likes || 0 : d.totalViews || 0)))
    : 1;

  if (!userId) return null;

  return (
    <div
      dir="rtl"
      className={`frosted-glass-card p-6 lg:p-8 rounded-2xl flex flex-col w-full relative overflow-hidden transition-all duration-500 flex-1
        ${showLockedOverlay 
          ? 'h-[340px] md:h-[450px]' 
          : 'h-full min-h-[400px]'
        } 
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0 relative z-30">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isLikes ? "bg-red-50 dark:bg-red-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}>
            <span className={`material-icons-round text-base ${isLikes ? "text-red-500" : "text-blue-500"}`}>
              {isLikes ? "favorite" : "visibility"}
            </span>
          </div>
          <h2 className="text-base font-bold text-zinc-800 dark:text-white">{title}</h2>
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-1.5 pr-3 pl-8 rounded-lg focus:outline-none text-xs font-medium cursor-pointer"
          >
            <option value="week">השבוע</option>
            <option value="month">החודש</option>
            <option value="year">השנה</option>
            <option value="all">הכל</option>
          </select>
          <div className="absolute inset-y-0 left-1 flex items-center px-1.5 pointer-events-none text-zinc-400">
            <span className="material-icons-round text-sm">expand_more</span>
          </div>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex justify-center items-center flex-1">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg flex-1 flex items-center justify-center">
          {error}
        </div>
      ) : (
        <div className="flex-1 min-h-0 relative">
          {!showLockedOverlay && dishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-80 pt-10 pb-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-zinc-100 dark:bg-zinc-800/50">
                <span className="material-icons-round text-4xl text-zinc-400 dark:text-zinc-500">
                  {isLikes ? "heart_broken" : "visibility_off"}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                אין עדיין מספיק נתונים להצגה
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center max-w-[200px]">
                ברגע שיהיו נתונים זמינים, הם יופיעו כאן באופן אוטומטי
              </p>
            </div>
          ) : (
          <div className={`h-full pr-1 custom-scrollbar ${showLockedOverlay ? "overflow-hidden" : "overflow-y-auto"}`}>
            <div className="space-y-3 pb-4">
              {displayDishes.map((dish, index) => {
                const rawValue = isLikes ? (dish.likes ?? 0) : (dish.totalViews || 0);
                const percentage = maxValue > 0 ? (rawValue / maxValue) * 100 : 0;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors border border-transparent 
                      ${showLockedOverlay && index === 2 ? 'opacity-30 blur-[1px]' : ''}`}
                  >
                    <div className="relative w-14 h-14 shrink-0">
                      {dish.image ? (
                        <img alt={dish.name} className="w-full h-full object-cover rounded-xl shadow-sm" src={dish.image} />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">
                          <span className="material-icons-round text-xl">fastfood</span>
                        </div>
                      )}
                      <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${getRankBadgeColor(index)}`}>
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-white truncate leading-tight">
                        {dish.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs font-semibold tabular-nums ${isLikes ? "text-red-400" : "text-blue-500"}`}>
                          {showLockedOverlay ? "•••" : rawValue}
                        </span>
                        <div className="h-1 flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${getProgressColor(index)}`}
                            style={{ width: `${showLockedOverlay ? 0 : percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-left">
                      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">₪{dish.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      )}

      {/* Locked State Overlay */}
      {showLockedOverlay && (
        <>
          {/* Gradient Fade */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/80 dark:from-zinc-950 dark:via-zinc-950/90 to-transparent pointer-events-none" />
          
          {/* CTA Content */}
          <div className="absolute bottom-5 inset-x-0 z-20 flex flex-col items-center px-6 text-center">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 font-bold">
              סטטיסטיקת לייקים זמינה ב-Advance
            </p>
            <button
              onClick={() => navigate("/upgrade")}
              className="w-full max-w-[240px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-transform"
            >
              שדרג ל-Advance
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopDishes;