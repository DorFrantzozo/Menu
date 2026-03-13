import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "סורקים או נוגעים",
    text: "הלקוח סורק את ה-QR שעל השולחן או פשוט נוגע בשבב ה-NFC. הגישה מיידית וברורה על סמך סמל אוניברסלי מוכר.",
    icon: "📱"
  },
  {
    num: "02",
    title: "צופים בתפריט",
    text: "התפריט נפתח מיד בדפדפן המובייל, מעוצב ומגרה – בלי שום צורך בהורדת אפליקציה או הרשמות מסורבלות.",
    icon: "👀"
  },
  {
    num: "03",
    title: "מזמינים מהמלצר",
    text: "הלקוחות בוחרים את המנות בנחת דרך הנייד עד שהמלצר ניגש לקחת הזמנה, תוך שמירה על יחס אישי וחוויה אנושית.",
    icon: "👨‍🍳"
  }
];

export default function HowItWorks() {
  return (
    <div className="py-24 bg-zinc-50 border-y border-zinc-100" id="howitworks">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" dir="rtl">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-zinc-900 mb-4 tracking-tighter">
            איך זה עובד?
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-medium">
            שלושה צעדים פשוטים לחוויית סועד חלקה שתגדיל לכם מכירות.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-zinc-100 relative overflow-hidden group hover:border-emerald-200 transition-colors"
            >
              <div className="text-8xl absolute -top-4 -right-4 opacity-[0.03] font-black text-zinc-900 pointer-events-none group-hover:text-emerald-500 group-hover:opacity-10 transition-all">
                {step.num}
              </div>
              <div className="text-4xl mb-6">{step.icon}</div>
              <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">{step.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
