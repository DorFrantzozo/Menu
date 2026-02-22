import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActionsCards = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "הוסף מנה",
      icon: "restaurant_menu",
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-100 dark:bg-blue-900/30",
      action: () => navigate("/manage-dishes")
    },
    {
      title: "ניהול קטגוריות",
      icon: "category",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
      action: () => navigate("/manage-categories")
    },
    {
      title: "עיצוב התפריט",
      icon: "palette",
      colorClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-100 dark:bg-purple-900/30",
      action: () => navigate("/designs")
    },
    {
      title: "הגדרות מסעדה",
      icon: "settings",
      colorClass: "text-orange-600 dark:text-orange-400",
      bgClass: "bg-orange-100 dark:bg-orange-900/30",
      action: () => navigate("/profile")
    }
  ];

  return (
    <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white flex items-center gap-2">
          פעולות מהירות
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {actions.map((item, index) => (
          <button 
            key={index}
            onClick={item.action}
            className="bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group hover:shadow-md"
          >
            <div className={`w-12 h-12 rounded-full ${item.bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <span className={`material-icons-round ${item.colorClass}`}>{item.icon}</span>
            </div>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-center">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCards;
