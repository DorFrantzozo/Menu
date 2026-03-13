import React, { useState } from "react";
import { useImpersonation } from "../../hooks/useImpersonation";
import DropDown from "../data/DefaultDropDown";
import { updatePaidStatus } from "../../utils/updateData";
import { toast } from "react-toastify";

export default function AdminUserRow({ user, onStatusUpdate }) {
  const { impersonateUser, isImpersonating } = useImpersonation();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Handle Formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat('en-GB', { 
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
  };
  
  const createdDate = formatDate(user.createdAt);
  const trialEndDate = formatDate(user.trialExpiresAt);
  
  const handleStatusChange = async (newText) => {
    try {
      setIsUpdatingStatus(true);
      const isPaidBool = newText === "Paid";
      await updatePaidStatus(user._id, isPaidBool);
      onStatusUpdate(user._id, isPaidBool);
      toast.success(`User ${user.restaurantName} status updated to ${newText}`);
    } catch (error) {
       toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Menu Link
  const menuLink = user.qrSlug ? `${window.location.origin}/go/${user.qrSlug}` : "#";

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      {/* Restaurant Info */}
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          {user.logo ? (
            <img src={user.logo} alt="logo" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex flex-col justify-center items-center text-slate-500 font-bold border border-slate-300">
              {user.restaurantName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{user.restaurantName}</span>
            <span className="text-xs text-slate-400">{user.email}</span>
          </div>
        </div>
      </td>

      {/* User ID */}
      <td className="p-4 align-middle text-xs text-slate-500 font-mono">
        {user._id}
      </td>

      {/* Status (isPaid) */}
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
            <div
              className={`px-2 py-1 rounded-md text-white text-center text-xs font-bold whitespace-nowrap ${
                user.isPaid ? "bg-emerald-500" : "bg-rose-400"
              }`}
            >
              {user.isPaid ? "Paid ✅" : "Unpaid ❌"}
            </div>
            
            <div className={`transition-opacity ${isUpdatingStatus ? 'opacity-50 pointer-events-none' : ''}`}>
              <DropDown
                dropDownTitle="Change"
                dropDownItems={["Paid", "Not Paid"]}
                bgColor="bg-slate-900"
                textColor="text-white"
                hoverColor="hover:bg-slate-700"
                handelSelectedProp={handleStatusChange}
              />
            </div>
        </div>
      </td>

      {/* Menu Link */}
      <td className="p-4 align-middle">
        {user.qrSlug ? (
          <a
            href={menuLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 transition-colors whitespace-nowrap"
          >
            Live Menu
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        ) : (
          <span className="text-xs text-slate-400">Not configured</span>
        )}
      </td>

      {/* Scans */}
      <td className="p-4 align-middle text-center">
        <div className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg min-w-[3rem]">
          {user.totalQrScans}
        </div>
      </td>

      {/* Created */}
      <td className="p-4 align-middle text-sm text-slate-600">
        {createdDate}
      </td>
      
      {/* Trial Ends */}
      <td className="p-4 align-middle text-sm text-slate-600">
        {trialEndDate}
      </td>

      {/* Menu Size */}
      <td className="p-4 align-middle text-center">
        <div className="inline-flex items-center justify-center bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-lg min-w-[3rem]">
          {user.menuSize}
        </div>
      </td>

      {/* Actions */}
      <td className="p-4 align-middle text-right">
        <button
          onClick={() => impersonateUser(user._id)}
          disabled={isImpersonating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          Login As
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </button>
      </td>
    </tr>
  );
}
