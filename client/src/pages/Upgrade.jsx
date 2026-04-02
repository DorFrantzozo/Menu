import React from "react";
import {useSelector} from "react-redux";
import {useNavigate, Navigate} from "react-router-dom";
import PricingCard from "../components/Cards/PricingCard";

const faqs = [
  {
    question: "האם יש התחייבות?",
    answer:
      "לא, השירות ניתן במתכונת של מנוי שנתי ללא התחייבות לחידוש. תוכלו לבטל מתי שתרצו.",
  },
  {
    question: "איך מקבלים מדבקות NFC?",
    answer:
      "לאחר השדרוג במסלולים המתאימים, אנו נפיק ונשלח את הציוד הממותג ישירות לכתובת העסק שהזנתם.",
  },
  {
    question: "מה קורה למידע שלי אם לא אשדרג?",
    answer:
      "המידע נשמר באופן מאובטח, אך הגישה לתפריט דרך סריקת QR תוגבל עד להסדרת המנוי.",
  },
];

const Upgrade = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // if (user?.isPaid) return <Navigate to="/dashboard" replace />;

  const plans = [
    {
      plan: "Essential",
      price: Number(import.meta.env.VITE_PRICE_ESSENTIAL) || 2900,
      features: [
        "תפריט דיגיטלי חכם",
        "QR קוד לסריקה בנייד",
        "עדכונים בזמן אמת",
        "ממשק ניהול עצמאי 24/7",
        "סטטיסטיקות",
        " מבחר עיצובים",
        "תמיכה בוואטסאפ",
      ],
      isBestValue: false,
    },
    {
      plan: "Advance",
      price: Number(import.meta.env.VITE_PRICE_ADVANCE) || 4500,
      features: [
        "כל מה שיש ב-Essential",
        "15   QR סטנדים",
        "  הזנת תפריט עד 30 פריטים",
        "עדיפות בתמיכה",
      ],
      isBestValue: true,
    },
    {
      plan: "iMenu PRO",
      price: Number(import.meta.env.VITE_PRICE_PRO) || 8500,
      features: [
        "כל מה שיש ב-Advance",
        "עיצוב מותאם אישית",
        "ליווי אישי",
        "שיחת אפיון",
        "הזנת תפריט ללא הגבלה",
      ],
      isBestValue: false,
    },
  ];

  const handleSelectPlan = (price, planName) => {
    navigate("/checkout", {state: {amount: price, planName: planName}});
  };

  return (
    <div
      className="relative flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      dir="rtl"
    >
      {/* Siri-style Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-lime-600 text-white mb-8 shadow-2xl shadow-emerald-500/20 transform hover:rotate-12 transition-transform">
            <span className="material-icons-round text-3xl">
              workspace_premium
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6">
            Upgrade to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">
              Premium
            </span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            בחרו את המסלול שיקפיץ את העסק שלכם לדור הבא של עולם המסעדנות.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 px-4">
          {plans.map((p, idx) => (
            <PricingCard
              key={idx}
              {...p}
              onUpgrade={() => handleSelectPlan(p.price, p.plan)}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-20 border-t border-zinc-200 dark:border-zinc-800 relative">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-12 text-center">
            שאלות נפוצות
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] transition-all hover:border-emerald-500/40"
              >
                <dt className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  {faq.question}
                </dt>
                <dd className="mt-4 pr-6 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shine { 100% { left: 100%; } }
      `}</style>
    </div>
  );
};

export default Upgrade;
