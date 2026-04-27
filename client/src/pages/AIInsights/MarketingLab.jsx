import React from 'react';

// ---- Platform badge ----
const PlatformBadge = ({ icon, label, colorClass, bgClass }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${colorClass} ${bgClass}`}>
    <span className="material-icons-round text-sm">{icon}</span>
    <span className="text-[10px] font-bold">{label}</span>
  </div>
);

// ---- Mock post skeleton ----
const MockPostPreview = () => (
  <div className="rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-zinc-900/60 p-4 space-y-2 opacity-50 select-none">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex-shrink-0" />
      <div className="space-y-1">
        <div className="h-2 w-24 bg-zinc-300 dark:bg-zinc-700/60 rounded-full" />
        <div className="h-1.5 w-16 bg-zinc-200 dark:bg-zinc-800/60 rounded-full" />
      </div>
    </div>
    <div className="space-y-1.5">
      <div className="h-2 w-full bg-zinc-300 dark:bg-zinc-700/40 rounded-full" />
      <div className="h-2 w-4/5 bg-zinc-300 dark:bg-zinc-700/40 rounded-full" />
      <div className="h-2 w-3/5 bg-zinc-300 dark:bg-zinc-700/40 rounded-full" />
    </div>
    <div className="flex gap-2 pt-1">
      {['#מסעדה', '#אוכל', '#תפריט'].map(tag => (
        <div key={tag} className="h-4 w-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-full" />
      ))}
    </div>
  </div>
);

// ---- Main ----
const MarketingLab = () => (
  <section>
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-200 dark:border-pink-500/30 flex items-center justify-center">
          <span className="material-icons-round text-pink-500 dark:text-pink-400 text-base">campaign</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">מעבדת שיווק AI</h2>
            <span className="text-[10px] font-bold uppercase tracking-wide bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-500/25 px-2 py-0.5 rounded-full">
              בקרוב
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">יצירת תוכן שיווקי לרשתות חברתיות בקליק אחד</p>
        </div>
      </div>
    </div>

    <div className="relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/40 dark:from-zinc-900/80 dark:via-pink-950/20 dark:to-zinc-900/80 backdrop-blur-xl p-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 bg-pink-300/20 dark:bg-pink-600/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300/15 dark:bg-purple-600/15 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Platform pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <PlatformBadge
            icon="camera_alt" label="Instagram"
            colorClass="border-pink-300 dark:border-pink-500/30 text-pink-600 dark:text-pink-400"
            bgClass="bg-pink-50 dark:bg-transparent"
          />
          <PlatformBadge
            icon="share" label="Facebook"
            colorClass="border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-50 dark:bg-transparent"
          />
          <PlatformBadge
            icon="textsms" label="WhatsApp"
            colorClass="border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-50 dark:bg-transparent"
          />
        </div>

        {/* Disabled input */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-100 dark:bg-zinc-800/40 p-3 mb-4 flex items-center gap-3 opacity-60 cursor-not-allowed">
          <span className="material-icons-round text-zinc-400 dark:text-zinc-500 text-base">edit</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-500 flex-1">בחר מנה ולחץ על יצירת פוסט...</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-600 font-semibold border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-0.5">Ctrl+G</span>
        </div>

        {/* Mock post */}
        <MockPostPreview />

        {/* Disabled button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-100 dark:bg-gradient-to-r dark:from-pink-600/40 dark:to-purple-600/40 border border-pink-200 dark:border-pink-500/20 text-zinc-400 dark:text-zinc-500 text-sm font-bold cursor-not-allowed transition-all"
          >
            <span className="material-icons-round text-base">auto_awesome</span>
            צור פוסט לאינסטגרם
            <span className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-700/60 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full mr-auto">Coming Soon</span>
          </button>
        </div>

        {/* Feature list */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { icon: 'auto_fix_high', text: 'כתיבת כיתוב בינה מלאכותית' },
            { icon: 'tag', text: 'הצעת האשטגים רלוונטיים' },
            { icon: 'schedule', text: 'תזמון אוטומטי לפרסום' },
            { icon: 'language', text: 'תרגום לאנגלית ועברית' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-2 opacity-40">
              <span className="material-icons-round text-pink-500 dark:text-pink-400 text-sm">{f.icon}</span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default MarketingLab;
