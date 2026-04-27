import React, {useState} from "react";

const priorityConfig = {
  high: {
    label: "עדיפות גבוהה",
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/15",
    border: "border-red-200 dark:border-red-500/30",
    icon: "priority_high",
  },
  medium: {
    label: "עדיפות בינונית",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
    border: "border-amber-200 dark:border-amber-500/30",
    icon: "warning",
  },
  low: {
    label: "עדיפות נמוכה",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    border: "border-emerald-200 dark:border-emerald-500/30",
    icon: "info",
  },
};

const getPriority = (insight) => {
  if (insight.severity === "critical" || insight.priority === "high")
    return "high";
  if (insight.severity === "warning" || insight.priority === "medium")
    return "medium";
  return "low";
};

// ---- Single card ----
const InsightItem = ({insight, onDismiss, onFinished}) => {
  const priority = getPriority(insight);
  const cfg = priorityConfig[priority] || priorityConfig.low;

  return (
    <div
      className={`group relative flex flex-col h-full rounded-2xl border ${cfg.border} ${cfg.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-400/10 dark:hover:shadow-purple-500/10 overflow-hidden`}
    >
      {/* Hover glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-400/10 dark:from-purple-500/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(insight._id)}
        className="group/x absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 z-10"
        title="הסתר המלצה"
      >
        <span className="material-icons-round text-sm">close</span>
      </button>

      {/* Priority badge */}
      <div
        className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 mb-3 ${cfg.bg} border ${cfg.border}`}
      >
        <span className={`material-icons-round text-xs ${cfg.color}`}>
          {cfg.icon}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 leading-snug">
          {insight.title}
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4 flex-1">
          {insight.message}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-white/8 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
          נדרשת פעולה
        </span>
        <button
          onClick={() => onFinished(insight._id)}
          className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent hover:opacity-75 transition-opacity"
        >
          בוצע!
          <span className="material-icons-round text-[14px] text-indigo-500 dark:text-indigo-400">
            arrow_back
          </span>
        </button>
      </div>
    </div>
  );
};

// ---- Skeleton card ----
const SkeletonCard = () => (
  <div className="rounded-2xl border border-zinc-200 dark:border-white/8 bg-zinc-100 dark:bg-white/5 p-5 animate-pulse">
    <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700/50 rounded-full mb-4" />
    <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700/50 rounded-full mb-2" />
    <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full mb-1.5" />
    <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800/50 rounded-full mb-1.5" />
    <div className="h-3 w-4/6 bg-zinc-100 dark:bg-zinc-800/50 rounded-full" />
  </div>
);

// ---- Main component ----
const ActionableInsights = ({insights, loading, onDismiss, onFinished}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleInsights = showAll ? insights : insights.slice(0, 6);

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center">
            <span className="material-icons-round text-purple-500 dark:text-purple-400 text-base">
              tips_and_updates
            </span>
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              המלצות לפעולה מיידית
            </h2>
            <p className="text-[11px] text-zinc-500">
              ממצאים שמחכים לטיפול שלך
            </p>
          </div>
        </div>
        {!loading && insights.length > 6 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-semibold text-purple-500 dark:text-purple-400 hover:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            {showAll ? "הצג פחות" : `צפה בהכל (${insights.length})`}
            <span className="material-icons-round text-sm">
              {showAll ? "expand_less" : "expand_more"}
            </span>
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-white/5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25 flex items-center justify-center mb-4">
            <span className="material-icons-round text-3xl text-emerald-500 dark:text-emerald-400">
              task_alt
            </span>
          </div>
          <p className="font-bold text-zinc-700 dark:text-zinc-300 text-base">
            התפריט שלך עבר אופטימיזציה מלאה!
          </p>
          <p className="text-xs text-zinc-500 mt-1.5 text-center max-w-xs">
            לא נמצאו ממצאים פתוחים. המערכת ממשיכה לנטר את ביצועי התפריט ברקע.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleInsights.map((insight) => (
            <InsightItem
              key={insight._id}
              insight={insight}
              onDismiss={onDismiss}
              onFinished={onFinished}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ActionableInsights;
