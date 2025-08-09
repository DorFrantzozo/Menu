import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddDataToStart from "../components/Cards/AddDataToStart";

import FreeTrailBanner from "@/components/Cards/FreeTrailBanner";
import { countActiveItems, countItems } from "@/utils/localFunctions";

import DashboardTitle from "@/components/Dashboard/DashboardTitle";
import DashboardDataCards from "@/components/Cards/DashboardDataCards";
import QuickActiionsCards from "@/components/Cards/QuickActiionsCards";
import QrProfile from "@/components/data/qrCode/QrProfile";

const Dashboard = () => {
  const navigate = useNavigate();
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
        <div className="mt-10">
          <DashboardTitle user={user} />

          {menuCategories?.length > 0 ? (
            <>
              <DashboardDataCards
                menuCategories={menuCategories}
                allItems={allItems}
                allActiveItems={allActiveItems}
              />

              <div
                dir="rtl"
                className="flex flex-col lg:flex-row items-start justify-between w-full gap-6 px-4 mt-10"
              >
                {/* פעולות מהירות */}
                <div className="w-full lg:w-1/2">
                  <QuickActiionsCards />
                </div>

                {/* QR Code */}
                <div className="w-full lg:w-1/2">
                  <QrProfile userName={user} />
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
