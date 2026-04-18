import React from 'react';

const InsightsSkeleton = () => {
  return (
    <div className="space-y-5 opacity-50 pointer-events-none animate-pulse">
      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700/50 rounded-full w-full" />
      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700/50 rounded-full w-4/6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-white/5" />
        ))}
      </div>
    </div>
  );
};

// השורה הזו חסרה אצלך כרגע וגורמת לשגיאה:
export default InsightsSkeleton;