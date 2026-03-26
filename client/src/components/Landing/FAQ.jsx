import React, {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

const faqs = [
  {
    question: "איך מתחילים לעבוד עם iMenu?",
    answer:
      "נרשמים למערכת ובאופן אוטומטי נוצר עבורכם תפריט דיגיטלי ב-QR. אנחנו מספקים לכם את הברקודים הפיזיים ואת תגי ה-NFC המעוצבים שלנו, כך שכל מה שנותר לכם זה להניח אותם על השולחנות ולהתחיל לעבוד.",
  },
  {
    question: "האם הלקוחות צריכים להוריד אפליקציה כדי לצפות בתפריט?",
    answer:
      "ממש לא. התפריט הדיגיטלי של iMenu נפתח מיד בדפדפן המובייל בסריקה פשוטה או בנגיעת NFC. זה מבטיח חוויית שימוש מהירה ללא הרשמה וללא הורדות מיותרות.",
  },
  {
    question: "כמה עולה להצטרף ל-iMenu?",
    answer:
      "אנחנו מציעים 14 ימי התנסות מלאה ללא תשלום, כדי שתוכלו לראות איך המערכת מגדילה לכם את המכירות. לאחר מכן, תוכלו לבחור במסלול שמתאים לצרכים של המסעדה שלכם.",
  },
  {
    question: "מה היתרון של תגי ה-NFC שאתם מספקים?",
    answer:
      "תגי ה-NFC של iMenu מאפשרים ללקוח פשוט לקרב את הטלפון לשולחן והתפריט נפתח מיד. זה מהיר יותר, יוקרתי יותר ומשדרג משמעותית את חוויית הסועד בהשוואה לברקוד רגיל.",
  },
  {
    question: "האם אני יכול לעדכן מחירים ומנות בעצמי?",
    answer:
      "בוודאי. היתרון הגדול של iMenu הוא השליטה המלאה. בכל רגע נתון תוכלו להיכנס לדאשבורד מהנייד, לשנות מחירים, להוסיף מנות או להסתיר פריטים שנגמרו במלאי - והכל מתעדכן אצל הלקוח בזמן אמת.",
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
