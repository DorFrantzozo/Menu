import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TrialBanner = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const trialInfo = useMemo(() => {
    if (!user || user.isPaid) return null;
    if (!user.trialExpiresAt) return null;

    const expiresAt = new Date(user.trialExpiresAt);
    const now = new Date();
    const timeDiff = expiresAt.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft <= 0) return { expired: true };
    return { expired: false, daysLeft };
  }, [user]);

  if (!trialInfo || trialInfo.expired) return null;

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2.5 px-4 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-md z-50 shrink-0">
      <div className="flex items-center gap-2">
        <span className="material-icons-round text-lg animate-pulse">watch_later</span>
        <span className="font-medium text-sm sm:text-base text-center">
          נותרו לך {trialInfo.daysLeft} ימים לתקופת הניסיון!
        </span>
      </div>
      <button 
        onClick={() => navigate("/upgrade")}
        className="bg-white/10 hover:bg-white/20 border border-white/40 backdrop-blur-sm text-white font-bold py-1 px-4 rounded-full text-sm transition-all shadow-sm active:scale-95"
      >
        שדרג עכשיו
      </button>
    </div>
  );
};

export default TrialBanner;
