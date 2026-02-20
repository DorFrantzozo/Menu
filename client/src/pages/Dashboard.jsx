import { useSelector } from "react-redux";

import AddDataToStart from "../components/Cards/AddDataToStart";

import FreeTrailBanner from "@/components/Cards/FreeTrailBanner";
import { countActiveItems, countItems } from "@/utils/localFunctions";

import DashboardTitle from "@/components/Dashboard/DashboardTitle";
import DashboardDataCards from "@/components/Cards/DashboardDataCards";
import QuickActionsCards from "@/components/Cards/QuickActiionsCards";
import QrProfile from "@/components/data/qrCode/QrProfile";
import StatsDashboard from "@/components/Dashboard/StatsDashboard";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories
  );

  const allItems = countItems(menuCategories);
  const allActiveItems = countActiveItems(menuCategories);

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1">
        <FreeTrailBanner user={user} />
        <div className="mt-10 px-4 flex flex-col gap-6">
          <DashboardTitle user={user} />

          {menuCategories?.length > 0 ? (
            <>
              <DashboardDataCards
                menuCategories={menuCategories}
                allItems={allItems}
                allActiveItems={allActiveItems}
              />

              <div className="w-full">
                <StatsDashboard userId={user._id} />
              </div>

              {/* Bottom Section: Quick Actions & QR Code */}
              <div
                dir="rtl"
                className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch w-full"
              >
                {/* Quick Actions */}
                <div className="w-full h-full">
                  <QuickActionsCards />
                </div>

                {/* QR Code */}
                <div className="w-full h-full">
                  <QrProfile userName={user.restaurantName} />
                </div>
              </div>
            </>
          ) : (
            <AddDataToStart />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
