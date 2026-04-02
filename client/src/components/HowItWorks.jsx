import React from "react";
import {motion} from "framer-motion";

const steps = [
  {
    num: "01",
    title: "סריקת QR או נגיעה ב-NFC",
    text: "הלקוח מבצע סריקת ברקוד מהשולחן או פשוט מקרב את הטלפון לשבב ה-NFC. הגישה לתפריט מיידית ללא צורך בהקלדה או חיפוש.",
    icon: "📱",
  },
  {
    num: "02",
    title: "צפייה בתפריט דיגיטלי נגיש",
    text: "התפריט נפתח מיד בדפדפן המובייל – מעוצב, מהיר ומותאם אישית. בלי הורדת אפליקציות ובלי סרבול, חוויית משתמש חלקה ב-100%.",
    icon: "👀",
  },
  {
    num: "03",
    title: "הזמנה חכמה ושירות אישי",
    text: "הלקוחות בוחרים מנות בנחת דרך התפריט הדיגיטלי. המלצר ניגש לקחת הזמנה כשהלקוח כבר מוכן, מה שמקצר את זמן ההמתנה ומגדיל את סבב השולחנות.",
    icon: "👨‍🍳",
  },
];

export default function HowItWorks() {
  return (
    <div className="py-24 bg-zinc-50 border-y border-zinc-100" id="howitworks">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" dir="rtl">
          {/* שימוש ב-H2 עם מילת מפתח מרכזית */}
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-zinc-900 mb-4 tracking-tighter">
            איך עובד תפריט דיגיטלי למסעדות?
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-medium">
            שלושה צעדים פשוטים לשדרוג חוויית הסועד והגדלת המכירות בעסק שלכם.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: index * 0.2}}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-zinc-100 relative overflow-hidden group hover:border-emerald-200 transition-colors"
            >
              <div className="text-8xl absolute -top-4 -right-4 opacity-[0.03] font-black text-zinc-900 pointer-events-none group-hover:text-emerald-500 group-hover:opacity-10 transition-all">
                {step.num}
              </div>
              <div className="text-4xl mb-6">{step.icon}</div>
              {/* שימוש ב-H3 עבור היררכיית SEO נכונה */}
              <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
