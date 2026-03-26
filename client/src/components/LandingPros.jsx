import React from "react";
import {motion} from "framer-motion";

const features = [
  {
    title: "תפריט דיגיטלי מבוסס ענן",
    text: "מיני-סייט מהיר שעובד ישירות בדפדפן המובייל. חוויית משתמש חלקה – בלי הורדת אפליקציות ובלי תהליכי הרשמה מסורבלים.",
    icon: <span className="text-3xl">🚀</span>,
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "סריקה ב-QR או בנגיעה (NFC)",
    text: "כניסה מיידית לתפריט באמצעות סריקת ברקוד חכמה, או נגיעה בשבב NFC עם סמל אוניברסלי מוכר לפעולה מהירה וברורה.",
    icon: <span className="text-3xl">📲</span>,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "עיצוב תפריט בהתאמה אישית",
    text: "בחירה מתוך מגוון תבניות מוקפדות או יצירת עיצוב Custom שמתכתב במדויק עם השפה הוויזואלית והאווירה של המסעדה.",
    icon: <span className="text-3xl">🎨</span>,
    bg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "ניהול תפריט מהנייד בזמן אמת",
    text: "שליטה מלאה בשינוי מחירים, הוספת מנות או עדכון טקסטים - הכל מתעדכן באותו רגע. סוף להדפסות חוזרות ולהמתנה לגרפיקאים.",
    icon: <span className="text-3xl">⚡</span>,
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    title: "דאשבורד נתונים וסטטיסטיקות",
    text: "כלי אנליטיקה למסעדות. מעקב מדויק אחרי כמות הכניסות לתפריט, היקף הסריקות, וזיהוי ברור של המנות הפופולריות ביותר.",
    icon: <span className="text-3xl">📊</span>,
    bg: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    title: "ניהול מלאי ותזמון מנות",
    text: "נגמרה מנה במטבח? הסתירו אותה בלחיצת כפתור בתפריט ה-QR. ניתן לתזמן הופעת קטגוריות (כמו עסקיות או Happy Hour) לפי שעות.",
    icon: <span className="text-3xl">🕰️</span>,
    bg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    title: "תמונות מנות שמגדילות מכירה",
    text: "היררכיה ויזואלית שמגרה את הסועדים. הגדילו את ממוצע ההזמנה באמצעות שליטה חכמה בסדר המנות לקידום פריטים רווחיים.",
    icon: <span className="text-3xl">📸</span>,
    bg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    title: "סימון אלרגנים וערכים תזונתיים",
    text: "תצוגה שקופה של מידע תזונתי ואלרגנים על כל מנה. חוסך זמן לצוות המלצרים ומעניק ביטחון אישי ושקט לסועדים.",
    icon: <span className="text-3xl">🛡️</span>,
    bg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    title: "תפריט דיגיטלי נגיש כחוק",
    text: "המערכת עומדת בתקני הנגישות לבעלי מוגבלויות, מה שמבטיח חוויית שימוש נוחה ושוויונית לכל המבקרים שלכם ועמידה ברגולציה.",
    icon: <span className="text-3xl">♿</span>,
    bg: "bg-cyan-50",
    iconColor: "text-cyan-500",
  },
];

const LandingPros = () => {
  return (
    <div className="py-32 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24" dir="rtl">
          {/* H2 עם מילות מפתח חזקות */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-6 tracking-tighter">
            פתרון תפריט QR מלא למסעדה חכמה
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            כל הכלים שצריך כדי לחסוך זמן תפעולי, למנוע טעויות בהזמנה ולהגדיל את
            הרווחים בעסק שלכם.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10" dir="rtl">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: i * 0.1}}
              className="relative p-10 rounded-[3rem] bg-zinc-50 border border-zinc-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group cursor-default"
            >
              <div
                className={`w-20 h-20 ${feature.bg} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm`}
              >
                {feature.icon}
              </div>
              {/* כותרות H3 לכל פיצ'ר מקדמות ביטויים ספציפיים */}
              <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                {feature.text}
              </p>

              <div
                className={`absolute bottom-8 right-10 w-8 h-1 bg-zinc-200 rounded-full transition-all group-hover:w-16 group-hover:bg-emerald-500`}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPros;
