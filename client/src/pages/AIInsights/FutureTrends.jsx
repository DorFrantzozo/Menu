import React from 'react';

// ---- Day forecast card ----
const ForecastDay = ({ day, icon, busyness, label, barColor }) => (
  <div className="flex flex-col items-center gap-1.5">
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{day}</span>
    <span className="text-xl">{icon}</span>
    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/8 overflow-hidden">
      <div className={`h-full rounded-full ${barColor} opacity-60`} style={{ width: `${busyness}%` }} />
    </div>
    <span className={`text-[9px] font-bold ${barColor.replace('bg-', 'text-')}`}>{label}</span>
  </div>
);

const FORECAST_DATA = [
  { day: 'א׳', icon: '☀️', busyness: 35, label: 'שקט',      barColor: 'bg-emerald-500' },
  { day: 'ב׳', icon: '⛅', busyness: 55, label: 'בינוני',   barColor: 'bg-cyan-500' },
  { day: 'ג׳', icon: '🌧️', busyness: 28, label: 'שקט',      barColor: 'bg-emerald-500' },
  { day: 'ד׳', icon: '☀️', busyness: 70, label: 'עמוס',     barColor: 'bg-amber-500' },
  { day: 'ה׳', icon: '⛅', busyness: 85, label: 'עמוס מאוד',barColor: 'bg-orange-500' },
  { day: 'ו׳', icon: '☀️', busyness: 95, label: 'שיא',      barColor: 'bg-red-500' },
  { day: 'ש׳', icon: '🌤️', busyness: 90, label: 'שיא',      barColor: 'bg-red-500' },
];

// ---- Trend metric row ----
const TrendPill = ({ icon, label, value, delta }) => (
  <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-white/5 px-4 py-3">
    <div className="flex items-center gap-3">
      <span className="material-icons-round text-indigo-500 dark:text-indigo-400 text-base">{icon}</span>
      <span className="text-xs text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-bold text-zinc-400 dark:text-white/40">{value}</span>
      <span className={`text-[10px] font-bold ${delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
        {delta > 0 ? '↑' : '↓'}{Math.abs(delta)}%
      </span>
    </div>
  </div>
);

// ---- Main ----
const FutureTrends = () => (
  <section>
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center">
          <span className="material-icons-round text-cyan-600 dark:text-cyan-400 text-base">insights</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">תחזית עסקית</h2>
            <span className="text-[10px] font-bold uppercase tracking-wide bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/25 px-2 py-0.5 rounded-full">
              בקרוב
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">ניבוי תנועת לקוחות לפי היסטוריה, מזג אוויר וזמן</p>
        </div>
      </div>
    </div>

    <div className="relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-cyan-50/80 via-white to-indigo-50/40 dark:from-zinc-900/80 dark:via-cyan-950/20 dark:to-zinc-900/80 backdrop-blur-xl p-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-cyan-300/20 dark:bg-cyan-500/15 rounded-full blur-3xl" />

      {/* Blurred content underneath lock */}
      <div className="relative z-10 opacity-60 pointer-events-none select-none">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-white">תחזית פעילות – השבוע הקרוב</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">מבוסס על דאטה היסטורי + מזג האוויר</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/25 px-3 py-1.5">
            <span className="material-icons-round text-cyan-600 dark:text-cyan-400 text-sm">wb_sunny</span>
            <span className="text-xs text-cyan-700 dark:text-cyan-300 font-semibold">שבוע חם</span>
          </div>
        </div>

        {/* Weekly bars */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {FORECAST_DATA.map(d => <ForecastDay key={d.day} {...d} />)}
        </div>

        {/* Metric rows */}
        <div className="space-y-2">
          <TrendPill icon="restaurant" label="סריקות QR החגיגיות" value="~340" delta={22} />
          <TrendPill icon="trending_up" label="מנות מומלצות יגדלו ב-" value="18%" delta={18} />
          <TrendPill icon="schedule" label="שעת שיא צפויה" value="19:30" delta={5} />
        </div>

        {/* Feature teaser */}
        <div className="mt-5 rounded-xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/10 p-4 flex items-center gap-3">
          <span className="material-icons-round text-cyan-600 dark:text-cyan-400 text-xl">science</span>
          <div>
            <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">תחזית מלאכותית חכמה</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">קיבלנו 14 חודשים של נתונים עליך וכבר מאמנים את המודל.</p>
          </div>
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/50 backdrop-blur-[2px] z-20">
        <span className="material-icons-round text-zinc-400 dark:text-zinc-500 text-4xl mb-2">lock</span>
        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">תחזית חכמה</p>
        <p className="text-xs text-zinc-500 mt-1">זמינה בגרסה הבאה של iMenu PRO</p>
      </div>
    </div>
  </section>
);

export default FutureTrends;
