// components/Profile/SubscriptionCard.jsx
import {
  CalendarIcon,
  CreditCardIcon,
  XCircleIcon,
  CheckBadgeIcon, // <-- הוספנו את הייבוא הזה
} from "@heroicons/react/24/outline";

// שים לב: אם בתוך הקובץ InfoRow השתמשת ב-export default, הסר את הסוגריים המסולסלים
import {InfoRow} from "./InfoRow";

const SubscriptionCard = ({user}) => {
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 overflow-hidden relative">
      {/* כותרת וסטטוס */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">
          ניהול מנוי
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            user.isPaid
              ? "bg-emerald-100 text-emerald-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {user.isPaid ? "Premium Active" : "Free Plan"}
        </span>
      </div>

      {/* רשימת מידע */}
      <div className="space-y-3">
        <InfoRow
          icon={CalendarIcon}
          label="חיוב הבא"
          value={
            user.nextPaymentDate
              ? new Date(user.nextPaymentDate).toLocaleDateString("he-IL")
              : "אין חיוב קרוב"
          }
        />
        <InfoRow
          icon={CheckBadgeIcon}
          label="סוג מנוי"
          value={user.isPaid ? "מנוי שנתי" : "ללא עלות"}
        />
        {/* {user.isPaid && (
          <InfoRow
            icon={CreditCardIcon}
            label="אמצעי תשלום"
            value="Visa •••• 4242"
          />
        )} */}
      </div>

      {/* כפתור ביטול */}
      {user.isPaid && (
        <button
          onClick={() => {
            /* לוגיקת ביטול */
          }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100"
        >
          <XCircleIcon className="w-4 h-4" />
          ביטול מנוי
        </button>
      )}
    </div>
  );
};

export default SubscriptionCard;
