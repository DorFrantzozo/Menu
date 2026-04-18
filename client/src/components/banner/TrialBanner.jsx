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
    <div className="w-full bg-zinc-950/90 border-b border-emerald-500/20 text-white py-2.5 px-4 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.2)] z-50 shrink-0 relative overflow-hidden backdrop-blur-md">
      {/* Subtle Animated Glow in background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-emerald-500/5 animate-pulse" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <span className="material-icons-round text-emerald-400 text-lg">watch_later</span>
        </div>
        <span className="font-semibold text-sm sm:text-base text-center tracking-tight text-emerald-50">
          נותרו לך {trialInfo.daysLeft} ימים לתקופת הניסיון
        </span>
      </div>
      
      <button 
        onClick={() => navigate("/upgrade")}
        className="relative z-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-6 rounded-full text-sm transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] active:scale-95 border border-emerald-400/30"
      >
        שדרג עכשיו
      </button>
    </div>
  );
};

export default TrialBanner;
