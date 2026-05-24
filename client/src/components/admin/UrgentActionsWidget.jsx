import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/baseUrl";

export default function UrgentActionsWidget() {
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUrgentActions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get('/admin/urgent-actions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActions(response.data);
      } catch (err) {
        console.error("Failed to fetch urgent actions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrgentActions();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[250px] bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-white z-10">
        <h2 className="text-lg font-black text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Action Required
          </div>
          {actions.length > 0 && (
            <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {actions.length}
            </span>
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50" style={{ maxHeight: "300px" }}>
        {actions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <span className="text-3xl mb-2">🎉</span>
            <p className="text-sm font-medium text-slate-500">All up to date!</p>
            <p className="text-xs text-slate-400 mt-1">No urgent renewals needed.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {actions.map((item, idx) => (
              <div key={`${item._id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-900 text-sm truncate" title={item.restaurantName}>
                    {item.restaurantName}
                  </span>
                  <span className="text-xs text-slate-400 truncate" title={item.email}>
                    {item.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  {item.type === "trial" ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                      Trial
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                      Paid
                    </span>
                  )}
                  <span className={`text-xs font-bold w-14 text-right ${item.daysLeft <= 3 ? 'text-rose-500' : 'text-slate-600'}`}>
                    {item.daysLeft === 0 ? "Today!" : `${item.daysLeft} days`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
