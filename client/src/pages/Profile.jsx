import { useEffect, useState } from "react";
import FreeTrailBanner from "@/components/Cards/FreeTrailBanner";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import BusinessInfoCard from "@/components/Profile/BusinessInfoCard";
import SubscriptionCard from "@/components/Profile/SubscriptionCard";
import QRCodeManager from "@/components/Profile/QRCodeManager";

import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const navigate = useNavigate();
  const [userFromStorage, setUser] = useState(null);
  const [qrSlug, setQrSlug] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setQrSlug(user.qrSlug);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16" dir="rtl">
      <FreeTrailBanner user={userFromStorage} />
      
      {/* Profile Header section */}
      <ProfileHeader user={userFromStorage} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Main Column (Right Side - 8 Columns) */}
          <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
            <BusinessInfoCard user={userFromStorage} />
            <SubscriptionCard user={userFromStorage} />
            
            {/* Quick Actions / Redesigned Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
               <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">קישורים מהירים</h3>
               <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      window.open(
                        `https://${userFromStorage?.restaurantName?.toLowerCase()}.imenu-il.online/menu`,
                        "_blank"
                      )
                    }
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all text-center shadow-lg shadow-emerald-100 active:scale-[0.98]"
                  >
                    צפייה בתפריט החי
                  </button>
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="flex-1 bg-white hover:bg-zinc-50 text-zinc-900 font-bold py-3.5 px-6 rounded-2xl transition-all text-center border-2 border-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

export default Profile;
