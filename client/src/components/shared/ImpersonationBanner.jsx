import React from "react";
import { useImpersonation } from "../../hooks/useImpersonation";

export default function ImpersonationBanner() {
  const { returnToAdmin, isCurrentlyImpersonating } = useImpersonation();

  // If we are not impersonating, this component renders nothing.
  if (!isCurrentlyImpersonating) return null;

  let impersonatedUserName = "User";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    impersonatedUserName = user.restaurantName || user.email || "User";
  } catch (e) {}

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white z-[9999] shadow-md flex items-center justify-center py-2 px-4 gap-4 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <span className="animate-pulse">⚠️</span>
        <span className="text-sm font-bold tracking-wide">
          ADMIN MODE: You are currently viewing the system as <span className="underline decoration-wavy underline-offset-2">{impersonatedUserName}</span>
        </span>
      </div>
      
      <button
        onClick={returnToAdmin}
        className="ml-4 px-4 py-1.5 bg-white text-red-700 font-extrabold text-xs rounded-full hover:bg-red-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        Return to Admin
      </button>
    </div>
  );
}
