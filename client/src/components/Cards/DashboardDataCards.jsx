import React from "react";
import DashboardCard from "./DashboardCard";

const DashboardDataCards = ({ menuCategories, allActiveItems, allItems, totalQrScans = 0 }) => {
  return (
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
      <DashboardCard
        value={totalQrScans}
        name="סריקות QR"
        iconName="qr_code"
        bgIconName="qr_code_scanner"
        iconColorClass="text-purple-600 dark:text-purple-400"
        bgIconColorClass="bg-purple-100 dark:bg-purple-900/30"
        subtext={
          <>
            <span className="material-icons-round text-sm ml-1 text-green-500">trending_up</span>
            <span className="text-green-500">פעיל בזמן אמת</span>
          </>
        }
        badge={
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-red-500 tracking-wide uppercase mr-2">LIVE</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
        }
      />
      
      <DashboardCard
        value={Array.isArray(allItems) ? allItems.length : allItems}
        name="סך הכל פריטים"
        iconName="lunch_dining"
        bgIconName="inventory_2"
        iconColorClass="text-orange-600 dark:text-orange-400"
        bgIconColorClass="bg-orange-100 dark:bg-orange-900/30"
        subtext="כל המנות בתפריט"
      />

      <DashboardCard
        value={Array.isArray(menuCategories) ? menuCategories.length : menuCategories}
        name="קטגוריות פעילות"
        iconName="category"
        bgIconName="category"
        iconColorClass="text-emerald-600 dark:text-emerald-400"
        bgIconColorClass="bg-emerald-100 dark:bg-emerald-900/30"
        subtext="מוצגות כעת"
      />

      <DashboardCard
        value={Array.isArray(allActiveItems) ? allActiveItems.length : allActiveItems}
        name="מנות פעילות"
        iconName="local_offer"
        bgIconName="local_offer"
        iconColorClass="text-blue-600 dark:text-blue-400"
        bgIconColorClass="bg-blue-100 dark:bg-blue-900/30"
        subtext="זמינות להזמנה"
      />
    </div>
  );
};

export default DashboardDataCards;
