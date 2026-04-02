import {useSelector} from "react-redux";
import {useState} from "react";
import AddDataToStart from "../components/Cards/AddDataToStart";
import {countActiveItems, countItems} from "@/utils/localFunctions";
import DashboardDataCards from "@/components/Cards/DashboardDataCards";
import QrProfile from "@/components/data/qrCode/QrProfile";
import PeakActivityWidget from "@/components/Dashboard/PeakActivityWidget";
import StatsDashboard from "@/components/Dashboard/StatsDashboard";
import useQrScanPolling from "@/hooks/useQrScanPolling";
import {useTheme} from "../context/ThemeContext";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories,
  );

  const allItems = countItems(menuCategories);
  const allActiveItems = countActiveItems(menuCategories);

  const {isDarkMode, toggleDarkMode} = useTheme();
  const liveQrScans = useQrScanPolling(user?._id, user?.totalQrScans || 0);

  return (
    <div
      dir="rtl"
      className="flex-1 flex flex-col h-screen overflow-hidden relative bg-background-light dark:bg-background-dark transition-colors duration-200"
    >
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-4 lg:px-6 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-700/50">
        <div className="w-12 flex shrink-0 lg:hidden">
          {/* Spacer for mobile sidebar toggle */}
        </div>
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
            ברוך שובך, {user?.restaurantName || "מסעדה"}{" "}
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            נהל את התפריט שלך, עקוב אחר סריקות ובצע אופטימיזציה למכירות.
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-4 rounded-full  text-zinc-500 hover:bg-zinc-100  dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            <span className="material-icons-round">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button
            onClick={() =>
              window.open(
                `https://${user?.restaurantName?.toLowerCase()}.imenu-il.online/menu`,
                "_blank",
              )
            }
            className="bg-primary hover:bg-primary-dark text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0"
          >
            <span className="material-icons-round text-base">launch</span>
            <span className="hidden md:inline">צפייה בתפריט החי</span>
          </button>
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-6">
        {menuCategories?.length > 0 ? (
          <>
            {/* Top Stat Cards Grid */}
            <div className="shrink-0">
              <DashboardDataCards
                menuCategories={menuCategories}
                allItems={allItems}
                allActiveItems={allActiveItems}
                totalQrScans={liveQrScans}
              />
            </div>

            {/* Middle Section: Chart & Dishes */}
            <div className="lg:flex-1 lg:min-h-[300px] flex flex-col">
              <StatsDashboard userId={user?._id} />
            </div>

            {/* Bottom Section: QR & Actions */}
            <div
              data-tour="stats"
              className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch w-full shrink-0"
            >
              <QrProfile qrSlug={user?.qrSlug} />
              <PeakActivityWidget />
            </div>
          </>
        ) : (
          <div className="mt-10">
            <AddDataToStart />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
