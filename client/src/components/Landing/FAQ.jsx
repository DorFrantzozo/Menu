import React, {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

const faqs = [
  {
    question: "איך יוצרים תפריט דיגיטלי למסעדות?", // ביטוי חיפוש קלאסי
    answer:
      "נרשמים למערכת ונהנים מ-14 ימי התנסות מלאה ללא עלות, במהלכם נוצר עבורכם תפריט QR מעוצב באופן אוטומטי. בסיום תקופת הניסיון, תוכלו לבחור את מסלול המנוי המתאים לכם. בהתאם לחבילה שנבחרה, ניתן לקבל מאיתנו תגי NFC פיזיים ומדבקות ברקוד מעוצבות להצבה על השולחנות בעסק.",
  },
  {
    question: "מה היתרון של תפריט QR על פני תפריט נייר רגיל?", // שאלה שמשווה (גוגל אוהב)
    answer:
      "תפריט QR (או תפריט דיגיטלי) חוסך בעלויות הדפסה, מאפשר עדכון מנות ומחירים בזמן אמת, ומציע חוויה ויזואלית עם תמונות שמגרות את התיאבון. בנוסף, הוא מאפשר ניתוח נתונים על המנות הכי נמכרות בעסק שלכם.",
  },
  {
    question: "האם תפריט למסעדות של iMenu מחייב הורדת אפליקציה?", // מילת מפתח "תפריט למסעדות"
    answer:
      "ממש לא. אחד היתרונות של iMenu הוא הנגישות. הלקוח סורק את הקוד והתפריט נפתח מיד בדפדפן. בלי הורדות, בלי הרשמה ובלי סרבול – פשוט סורקים וצופים בתפריט הדיגיטלי.",
  },
  {
    question: "איך טכנולוגיית NFC משדרגת את התפריט הדיגיטלי?",
    answer:
      "תגי ה-NFC שלנו הם הדור הבא של תפריטים למסעדות. במקום לפתוח מצלמה, הלקוח פשוט מניח את הטלפון על השולחן. זה מהיר, טכנולוגי ומונע בעיות של תאורה חלשה המקשות על סריקת QR סטנדרטית.",
  },
  {
    question: "האם המערכת כוללת ניהול מלאי ועדכון מחירים?",
    answer:
      "בוודאי. כל תפריט דיגיטלי למסעדות ב-iMenu מגיע עם דאשבורד ניהול ידידותי. ניתן להסתיר מנה שנגמרה במטבח בלחיצת כפתור או לעדכן מחיר של מנת ספיישל תוך שניות, ללא צורך בהדפסה מחדש.",
  },
];

export default function FAQ() {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <div className="py-24 bg-zinc-50" id="faq" dir="rtl">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tighter">
            שאלות ותשובות על iMenu
          </h2>
          <p className="text-zinc-500 text-lg font-medium">
            כל מה שצריך לדעת על המעבר לתפריט דיגיטלי חכם ב-QR ו-NFC.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                className="w-full p-6 text-right flex justify-between items-center group"
              >
                <span className="font-black text-lg md:text-xl text-zinc-800 group-hover:text-emerald-600 transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`text-emerald-500 transition-transform duration-300 ${activeIdx === i ? "rotate-180" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              <AnimatePresence>
                {activeIdx === i && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.3, ease: "easeInOut"}}
                  >
                    <div className="px-6 pb-8 text-zinc-600 text-lg leading-relaxed border-t border-zinc-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
