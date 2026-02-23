import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "עדכון מלאי מיידי",
    text: "נגמרה מנה? הסתר אותה מהתפריט בלחיצת כפתור אחת. עדכן מחירים ותיאורים בזמן אמת מכל מכשיר.",
    icon: <span className="text-3xl">⚡</span>,
    bg: "bg-orange-50",
    iconColor: "text-orange-500"
  },
  {
    title: "אנליטיקס ודאטה",
    text: "קבל תובנות עמוקות על העדפות הסועדים. אילו מנות הכי נצפות? מתי שעות השיא? קבל החלטות מבוססות נתונים.",
    icon: <span className="text-3xl">📊</span>,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500"
  },
  {
    title: "עיצוב גמיש ומותאם",
    text: "התאם את התפריט למותג שלך בקלות. בחר צבעים, פונטים ותמונות שמשקפים את האופי הייחודי של המסעדה שלך.",
    icon: <span className="text-3xl">🎨</span>,
    bg: "bg-purple-50",
    iconColor: "text-purple-500"
  },
];

const LandingPros = () => {
  return (
    <div className="py-32 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24" dir="rtl">
          <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tighter">
            כל מה שצריך כדי לניהל תפריט מנצח
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            מערכת MenuYou נבנתה במיוחד עבור מסעדנים שרוצים שליטה מלאה, עיצוב מרהיב וחווית משתמש ללא פשרות.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10" dir="rtl">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-10 rounded-[3rem] bg-zinc-50 border border-zinc-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group cursor-default"
            >
              <div className={`w-20 h-20 ${feature.bg} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                {feature.text}
              </p>
              
              {/* Subtle hover indicator */}
              <div className={`absolute bottom-8 right-10 w-8 h-1 bg-zinc-200 rounded-full transition-all group-hover:w-16 group-hover:bg-emerald-500`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPros;
