import React from 'react';
import { motion } from 'framer-motion';

const DashboardMockup = () => {
  return (
    <div dir="rtl" className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-zinc-100 p-6 w-full max-w-4xl mx-auto flex flex-col font-sans relative overflow-hidden">
      {/* Decorative gradient background blobbie */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full"></div>
      
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shadow-sm">👋</div>
          <div>
            <h2 className="text-zinc-900 font-extrabold text-lg tracking-tight leading-tight">ברוך שובך, Dor!</h2>
            <p className="text-zinc-400 text-xs font-medium">נהל את התפריט שלך, עקוב אחר סריקות ובצע אופטימיזציה לסועדים.</p>
          </div>
        </div>
        <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-zinc-200">
           <span className="text-emerald-400">⚡</span> צפייה בתפריט החי
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative z-10">
        {/* Stats Cards */}
        <div className="bg-white border border-zinc-100 p-4 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">📊</div>
            <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              <span className="text-[9px] font-black text-red-500 tracking-tighter">LIVE</span>
              <div className="w-1 h-1 rounded-full bg-red-500 animate-ping"></div>
            </div>
          </div>
          <p className="text-zinc-400 text-[9px] font-bold mb-0.5 uppercase tracking-wider">סריקות QR</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900">472</span>
            <span className="text-emerald-500 text-[9px] font-black">✓ פועל כעת</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 p-4 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-2">🍱</div>
          <p className="text-zinc-400 text-[9px] font-bold mb-0.5 uppercase tracking-wider">סה"כ פריטים</p>
          <span className="text-2xl font-black text-zinc-900">11</span>
        </div>

        <div className="bg-white border border-zinc-100 p-4 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-2">📁</div>
          <p className="text-zinc-400 text-[9px] font-bold mb-0.5 uppercase tracking-wider">קטגוריות</p>
          <span className="text-2xl font-black text-zinc-900">5</span>
        </div>

        <div className="bg-white border border-zinc-100 p-4 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center mb-2">💎</div>
          <p className="text-zinc-400 text-[9px] font-bold mb-0.5 uppercase tracking-wider">מנות פרימיום</p>
          <span className="text-2xl font-black text-zinc-900">11</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10 mb-6">
        {/* Chart Section */}
        <div className="md:col-span-3 bg-white border border-zinc-100 rounded-[2rem] p-5 shadow-sm">
          <h3 className="text-zinc-900 font-extrabold text-sm mb-6 flex justify-between items-center">
            סה"כ כניסות לתפריט
            <span className="text-[9px] text-emerald-500 font-black px-2 py-0.5 bg-emerald-50 rounded-lg">+12% השבוע</span>
          </h3>
          <div className="h-32 relative">
            <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" style={{ transform: 'scaleX(-1)' }}>
               <motion.path
                d="M0,85 L40,84 L80,88 L120,70 L160,78 L200,45 L240,58 L280,25 L320,38 L360,12 L400,18"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
              />
              <path d="M0,85 L40,84 L80,88 L120,70 L160,78 L200,45 L240,58 L280,25 L320,38 L360,12 L400,18 V100 H0 Z" fill="url(#mainGradient)" />
              <defs>
                <linearGradient id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="400" cy="18" r="5" fill="#10b981" className="animate-pulse" />
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-[9px] text-zinc-300 font-black px-1 mt-2">
              <span>24.01</span><span>30.01</span><span>05.02</span><span>11.02</span><span>17.02</span><span>23.02</span>
            </div>
          </div>
        </div>

        {/* Popular Dishes & Actions */}
        <div className="md:col-span-2 flex flex-col">
          <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 shadow-sm flex-1">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-zinc-900 font-extrabold text-sm">מנות פופולריות</h3>
               <button className="text-[9px] font-black text-emerald-600 hover:underline">נהל הכל</button>
             </div>
             <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-zinc-50 overflow-hidden border border-zinc-100">
                    <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                      <p className="text-[11px] font-bold text-zinc-900">רול דגים</p>
                      <span className="text-[9px] font-black text-zinc-400">288</span>
                   </div>
                   <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5 }} className="bg-emerald-500 h-full rounded-full" />
                   </div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-zinc-50 overflow-hidden border border-zinc-100">
                    <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=100&h=100&fit=crop" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[11px] font-bold text-zinc-900">סלט קיץ</p>
                      <span className="text-[9px] font-black text-zinc-400">142</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5, delay: 0.2 }} className="bg-zinc-900 h-full rounded-full" />
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Row: Actions & QR */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
         <div className="md:col-span-3 flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-[2rem]">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-xl border border-zinc-100 flex items-center justify-center shadow-sm">
                  <span className="text-xl">📱</span>
               </div>
               <div>
                  <p className="text-[11px] font-black text-zinc-900">קוד ה-QR שלך</p>
                  <p className="text-[9px] text-zinc-400">הורד או שתף את קוד ה-QR.</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-[10px] font-bold hover:bg-zinc-50">שיתוף</button>
               <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold hover:bg-zinc-800">הורדה</button>
            </div>
         </div>
         <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <button className="bg-zinc-50 hover:bg-zinc-100 p-3 rounded-2xl border border-zinc-100 flex flex-col items-center gap-2 transition-all">
               <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">🥗</div>
               <span className="text-[9px] font-black text-zinc-600 uppercase">הוסף מנה</span>
            </button>
            <button className="bg-zinc-50 hover:bg-zinc-100 p-3 rounded-2xl border border-zinc-100 flex flex-col items-center gap-2 transition-all">
               <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">🎨</div>
               <span className="text-[9px] font-black text-zinc-600 uppercase">עיצוב</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
