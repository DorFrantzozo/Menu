import React, { useState } from 'react';
import axiosInstance from "../../utils/baseUrl";
import { toast } from "react-toastify";

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  if (!isOpen || !user) return null;

  const [plan, setPlan] = useState(user.plan || "Free");
  const [trialEnds, setTrialEnds] = useState(
    user.trialExpiresAt ? new Date(user.trialExpiresAt).toISOString().split('T')[0] : ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        `/admin/users/${user._id}`,
        { plan, trialEnds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User updated successfully");
      onSave(user._id, { 
        plan: response.data.plan, 
        trialExpiresAt: response.data.trialExpiresAt,
        isPaid: response.data.isPaid,
        subscriptionStatus: response.data.subscriptionStatus
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Edit User Subscription</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
          <select 
            value={plan} 
            onChange={(e) => setPlan(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 outline-none focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="Free">Free</option>
            <option value="Essential">Essential</option>
            <option value="Advance">Advance</option>
            <option value="iMenu PRO">iMenu PRO</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Trial End Date</label>
          <input 
            type="date" 
            value={trialEnds}
            onChange={(e) => setTrialEnds(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 outline-none focus:ring-slate-500 focus:border-slate-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
