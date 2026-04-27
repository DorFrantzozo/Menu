import React, { useState } from 'react';

const QUADRANTS = [
  {
    key: 'stars',
    title: '⭐ כוכבים',
    subtitle: 'Stars',
    desc: 'מנות עם רווחיות גבוהה ופופולריות גבוהה',
    tooltip: 'אלו הגיבורים של התפריט שלך. הן נמכרות הרבה וגם מרוויחות הרבה. שמור עליהן, קדם אותן, ואל תשנה את המחיר.',
    cardBg:   'bg-amber-50 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-yellow-500/10',
    border:   'border-amber-200 dark:border-amber-500/30',
    iconColor:'text-amber-500 dark:text-amber-400',
    tagBg:    'bg-amber-100 dark:bg-amber-500/20',
    tagText:  'text-amber-700 dark:text-amber-300',
    examples: ['מנת השבוע', 'מנה פופולרית', 'חתימה'],
  },
  {
    key: 'puzzles',
    title: '🧩 חידות',
    subtitle: 'Puzzles',
    desc: 'רווחיות גבוהה, פופולריות נמוכה',
    tooltip: 'מנות רווחיות שאנשים לא מגלים. נסה לקדם אותן — שנה את הצגתן בתפריט, הוסף תמונות אטרקטיביות או הצע אותן כהמלצת השף.',
    cardBg:   'bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-purple-500/10',
    border:   'border-indigo-200 dark:border-indigo-500/30',
    iconColor:'text-indigo-500 dark:text-indigo-400',
    tagBg:    'bg-indigo-100 dark:bg-indigo-500/20',
    tagText:  'text-indigo-700 dark:text-indigo-300',
    examples: ['פוטנציאל רב', 'חבוי בתפריט', 'צריך מיצוב'],
  },
  {
    key: 'workhorses',
    title: '🐴 סוס עבודה',
    subtitle: 'Workhorses',
    desc: 'פופולריות גבוהה, רווחיות נמוכה',
    tooltip: 'מנות שהלקוחות אוהבים אבל לא מרוויחות מספיק. שקול להעלות מחיר בעדינות, להוריד עלויות חומרי גלם, או לצמצם את גודל המנה.',
    cardBg:   'bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-teal-500/10',
    border:   'border-cyan-200 dark:border-cyan-500/30',
    iconColor:'text-cyan-500 dark:text-cyan-400',
    tagBg:    'bg-cyan-100 dark:bg-cyan-500/20',
    tagText:  'text-cyan-700 dark:text-cyan-300',
    examples: ['אהובה על הלקוחות', 'שולי רווח נמוכים', 'מחזור גבוה'],
  },
  {
    key: 'dogs',
    title: '🐕 כלבים',
    subtitle: 'Dogs',
    desc: 'רווחיות נמוכה ופופולריות נמוכה',
    tooltip: 'שוקל להסיר מנות אלה מהתפריט? הן לא מוכרות ולא מרוויחות. זה מפשט את המטבח ומשפר את קריאת התפריט.',
    cardBg:   'bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-600/20 dark:to-zinc-500/10',
    border:   'border-zinc-200 dark:border-zinc-600/30',
    iconColor:'text-zinc-500 dark:text-zinc-500',
    tagBg:    'bg-zinc-200 dark:bg-zinc-600/20',
    tagText:  'text-zinc-600 dark:text-zinc-400',
    examples: ['לא מוכרת', 'לא רווחית', 'שקול הסרה'],
  },
];

// ---- Tooltip ----
const Tooltip = ({ text, visible }) => (
  <div
    className={`absolute bottom-full right-0 mb-2 z-50 w-60 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-2xl text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed transition-all duration-200 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
    }`}
    dir="rtl"
  >
    <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white dark:bg-zinc-800 border-b border-r border-zinc-200 dark:border-zinc-700 rotate-45" />
    {text}
  </div>
);

// ---- Quadrant card ----
const QuadrantCard = ({ q }) => {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div className={`relative group flex flex-col justify-between rounded-xl border ${q.border} ${q.cardBg} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`} dir="rtl">
      {/* Coming soon overlay */}
      <div className="absolute inset-0 rounded-xl bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 gap-2">
        <span className="material-icons-round text-zinc-400 dark:text-zinc-500 text-3xl">lock</span>
        <p className="text-xs text-zinc-500 font-semibold">ינותח בקרוב</p>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-base font-black text-zinc-900 dark:text-white">{q.title}</p>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{q.subtitle}</p>
        </div>
        <div className="relative">
          <button
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/8 border border-zinc-200 dark:border-white/10 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-white/15 transition-colors"
          >
            <span className={`material-icons-round text-sm ${q.iconColor}`}>info_outline</span>
          </button>
          <Tooltip text={q.tooltip} visible={tooltip} />
        </div>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{q.desc}</p>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {q.examples.map((tag) => (
          <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${q.tagBg} ${q.tagText}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 animate-pulse opacity-40">
        <div className="h-2 bg-zinc-300 dark:bg-white/10 rounded-full w-full" />
        <div className="h-2 bg-zinc-300 dark:bg-white/10 rounded-full w-4/5" />
      </div>
    </div>
  );
};

// ---- Main ----
const MenuStrategyMatrix = () => (
  <section>
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
          <span className="material-icons-round text-indigo-500 dark:text-indigo-400 text-base">grid_view</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">מטריצת אסטרטגיית תפריט</h2>
            <span className="text-[10px] font-bold uppercase tracking-wide bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-2 py-0.5 rounded-full">
              בקרוב
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">מנגינה עסקית – מיפוי מנות לפי רווחיות ופופולריות</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {QUADRANTS.map((q) => <QuadrantCard key={q.key} q={q} />)}
    </div>

    <div className="mt-4 flex items-center justify-between px-1">
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
        <span className="material-icons-round text-xs">arrow_upward</span>
        <span>רווחיות גבוהה</span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
        <span>פופולריות גבוהה</span>
        <span className="material-icons-round text-xs">arrow_forward</span>
      </div>
    </div>
  </section>
);

export default MenuStrategyMatrix;
