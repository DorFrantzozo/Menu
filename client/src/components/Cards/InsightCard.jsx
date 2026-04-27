import React from 'react';
import { useNavigate } from 'react-router-dom';
const InsightCard = ({ insight, onDismiss }) => {
  const navigate = useNavigate();
  return (
    <div className="relative group flex flex-col h-full bg-white/5 dark:bg-zinc-800/40 backdrop-blur-sm border border-zinc-200/50 dark:border-white/5 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 overflow-hidden">
      
      {/* אפקט תאורה פנימית שמופיע רק במעבר עכבר */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* כפתור סגירה אלגנטי */}
  <button 
  onClick={() => onDismiss(insight._id)}
  // העלינו את ה-z-index ל-50 כדי ששום טקסט לא יחסום את הלחיצה
  className="group/close absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-500/10 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 z-50 cursor-pointer"
>
  <span className="material-icons-round text-sm">close</span>
  
  {/* Tooltip מיושר לשמאל כדי שלא יחרוג מהכרטיסייה */}
  <span className="absolute top-full mt-2 left-0 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg opacity-0 scale-95 group-hover/close:opacity-100 group-hover/close:scale-100 transition-all duration-200 whitespace-nowrap pointer-events-none origin-top-left">
    הסתר המלצה
  </span>
</button>

      <div className="relative z-10 flex flex-col h-full">
        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2 pl-6">
          {insight.title}
        </h4>
        
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-4 flex-grow">
          {insight.message}
        </p>
        
        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-3">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
             פעולה נדרשת
          </span>
          <button onClick={() => navigate("/ai-insights")} className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-1">
            טפל עכשיו   <span className="material-icons-round text-[14px] text-indigo-600">arrow_back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;