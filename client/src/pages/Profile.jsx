import { useEffect, useState } from "react";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import BusinessInfoCard from "@/components/Profile/BusinessInfoCard";
import SubscriptionStatusCard from "@/components/Profile/SubscriptionStatusCard";
import QRCodeManager from "@/components/Profile/QRCodeManager";

import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DataTableGeneric from "@/components/data/DataTableGeneric";
import { fetchPaymentHistory } from "@/utils/paymentData";
import { paymentColumns } from "@/components/Profile/PaymentTableConfig";
const Profile = () => {
  const navigate = useNavigate();
  const [userFromStorage, setUser] = useState(null);
  const [qrSlug, setQrSlug] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      // הגדרת פונקציה אסינכרונית פנימית
      // 1. טיפול במידע המשתמש
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
        setQrSlug(user.qrSlug);
      }

      // 2. טיפול בהיסטוריית תשלומים
      const data = localStorage.getItem("user_payment_history");

      // בדיקה אם יש נתונים תקינים (לא null ולא מערך ריק)
      if (data && data !== "[]") {
        setPaymentHistory(JSON.parse(data));
      } else {
        const token = localStorage.getItem("token");
        if (!token) return console.error("אין טוקן בלוקאל סטורג'!");

        try {
          // חייב await כאן! זה מחכה שהשרת יחזיר תשובה
          const historyFromServer = await fetchPaymentHistory(token);

          // עדכון הלוקאל סטורג' והסטייט
          localStorage.setItem(
            "user_payment_history",
            JSON.stringify(historyFromServer),
          );
          setPaymentHistory(historyFromServer);
        } catch (error) {
          console.error("שגיאה במשיכת נתונים מהשרת:", error);
        }
      }
    };

    loadInitialData(); // הפעלת הפונקציה
  }, []);

  return (
    <div
      className="min-h-screen bg-zinc-50/50 dark:bg-background-dark pb-16 transition-colors duration-200"
      dir="rtl"
    >
      {/* Profile Header section */}
      <ProfileHeader user={userFromStorage} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Column (Right Side - 8 Columns) */}
          <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
            <BusinessInfoCard user={userFromStorage} />
            {/* Quick Actions / Redesigned Quick Links */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-5 transition-colors duration-200">
              <h3 className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">
                קישורים מהירים
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    window.open(
                      `https://${userFromStorage?.restaurantName?.toLowerCase()}.imenu-il.online/menu`,
                      "_blank",
                    )
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all text-center  shadow-emerald-100 active:scale-[0.98]"
                >
                  צפייה בתפריט החי
                </button>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex-1 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold py-3.5 px-6 rounded-2xl transition-all text-center border-2 border-zinc-200 dark:border-zinc-700 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  עריכת פרופיל
                </button>
              </div>
            </div>
          </div>

          {/* Side Column (Left Side - 4 Columns) - Strictly QRCodeManager */}
          <div className="md:col-span-12 lg:col-span-4">
            <QRCodeManager qrSlug={qrSlug} />
          </div>
        </div>
        <div className="w-full mt-8 flex flex-col gap-6">
            <SubscriptionStatusCard currentPlan={userFromStorage?.plan || 'Essential'} />
          <DataTableGeneric columns={paymentColumns} data={paymentHistory} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
