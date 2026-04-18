import React from 'react';

// ---- Circular Progress Bar ----
const CircularScore = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return ['#22d3ee', '#6366f1'];
    if (s >= 60) return ['#a855f7', '#6366f1'];
    if (s >= 40) return ['#f59e0b', '#f97316'];
    return ['#ef4444', '#f97316'];
  };
  const [colorA, colorB] = getColor(score);

  const getLabelColor = (s) => {
    if (s >= 80) return 'text-cyan-500 dark:text-cyan-400';
    if (s >= 60) return 'text-purple-500 dark:text-purple-400';
    if (s >= 40) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'מעולה';
    if (s >= 60) return 'טוב';
    if (s >= 40) return 'בינוני';
    return 'דורש שיפור';
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-200 dark:text-white/10" />
        {/* Arc */}
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black tabular-nums ${getLabelColor(score)}`}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mt-0.5">
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
};

// ---- Stat pill ----
const StatPill = ({ icon, label, value, colorClass }) => (
  <div className="flex items-center gap-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/8 rounded-xl px-4 py-3">
    <span className={`material-icons-round text-lg ${colorClass}`}>{icon}</span>
    <div>
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-sm font-bold text-zinc-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// ---- Main ----
const InsightsHeader = ({ insights = [], loading }) => {
  const criticalCount = insights.filter(i => i.severity === 'critical' || i.priority === 'high').length;
  const totalInsights = insights.length;
  const rawScore = Math.max(10, 100 - criticalCount * 18 - (totalInsights - criticalCount) * 6);
  const score = loading ? 0 : Math.min(100, Math.round(rawScore));

  const lastUpdated = new Date().toLocaleDateString('he-IL', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-white via-indigo-50/60 to-purple-50/40 dark:from-zinc-900/90 dark:via-indigo-950/60 dark:to-zinc-900/90 backdrop-blur-xl p-6 lg:p-8">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-indigo-400/15 dark:bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/10 dark:bg-purple-700/15 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
        {/* Title section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-gradient-to-br dark:from-purple-500/30 dark:to-indigo-500/30 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center">
              <span className="material-icons-round text-purple-500 dark:text-purple-400 text-xl">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">מרכז תובנות AI</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-500 text-black px-2 py-0.5 rounded-full">PRO</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">היועץ העסקי האישי שלך מבוסס בינה מלאכותית</p>
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
            המערכת מנתחת את הביצועים של התפריט שלך בכל לילה ומייצרת המלצות ממוקדות להגדלת הכנסות.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <StatPill icon="lightbulb" label="תובנות פעילות" value={loading ? '—' : `${totalInsights} המלצות`} colorClass="text-amber-500 dark:text-amber-400" />
            <StatPill icon="schedule" label="עודכן לאחרונה" value={lastUpdated} colorClass="text-cyan-500 dark:text-cyan-400" />
            <StatPill icon="trending_up" label="מצב ניטור" value="פעיל" colorClass="text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>

        {/* Health score ring */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">ציון בריאות התפריט</p>
          {loading ? (
            <div className="w-[140px] h-[140px] rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 animate-pulse" />
          ) : (
            <CircularScore score={score} />
          )}
          <p className="text-[10px] text-zinc-500 text-center mt-1">מבוסס על {totalInsights} ממצאי AI</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsHeader;
