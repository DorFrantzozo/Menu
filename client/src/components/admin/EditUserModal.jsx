import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../utils/baseUrl";
import { toast } from "react-toastify";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

/** Whole days from now until `value`; negative once it is in the past. */
const daysUntil = (value) => {
  if (!value) return null;
  return Math.ceil((new Date(value) - Date.now()) / (1000 * 60 * 60 * 24));
};

const describeRemaining = (value) => {
  const days = daysUntil(value);
  if (days === null) return "Never set";
  if (days > 1) return `${days} days left`;
  if (days === 1) return "1 day left";
  if (days === 0) return "Ends today";
  return `Expired ${Math.abs(days)} days ago`;
};

/**
 * Preview of the renewed billing date. Mirrors addMonths() in admin-controller
 * so the admin can see the outcome before committing. The server stays
 * authoritative — its response is what updates the row.
 */
const renewalBase = (currentDate) => {
  const now = new Date();
  return currentDate && new Date(currentDate) > now
    ? new Date(currentDate)
    : now;
};

const previewRenewal = (currentDate, months) => {
  const result = renewalBase(currentDate);

  const dayOfMonth = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const daysInTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(dayOfMonth, daysInTargetMonth));

  return result;
};

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [plan, setPlan] = useState(user?.plan || "Free");
  const [trialEnds, setTrialEnds] = useState("");
  const [renewalMonths, setRenewalMonths] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  // The modal stays mounted between openings, so the fields have to be pulled
  // back off the user prop each time it opens. Without this, reopening shows
  // whatever was left behind last time instead of the current values.
  useEffect(() => {
    if (!isOpen || !user) return;
    setPlan(user.plan || "Free");
    setTrialEnds(
      user.trialExpiresAt
        ? new Date(user.trialExpiresAt).toISOString().split("T")[0]
        : "",
    );
    setRenewalMonths(1);
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await axiosInstance.put(`/admin/users/${user._id}`, {
        plan,
        trialEnds,
      });
      toast.success("User updated successfully");
      onSave(user._id, {
        plan: response.data.plan,
        trialExpiresAt: response.data.trialExpiresAt,
        isPaid: response.data.isPaid,
        subscriptionStatus: response.data.subscriptionStatus,
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenew = async () => {
    const newDate = formatDate(
      previewRenewal(user.nextPaymentDate, renewalMonths),
    );
    const label = renewalMonths === 1 ? "1 month" : `${renewalMonths} months`;
    const confirmed = window.confirm(
      `Renew ${user.restaurantName} by ${label}?\n\n` +
        `Next payment moves to ${newDate}.\n` +
        `The plan and the trial date are not affected.`,
    );
    if (!confirmed) return;

    try {
      setIsRenewing(true);
      const response = await axiosInstance.patch(
        `/admin/users/${user._id}/renew-subscription`,
        { months: renewalMonths },
      );
      toast.success(
        `Renewed — next payment ${formatDate(response.data.nextPaymentDate)}`,
      );
      onSave(user._id, {
        nextPaymentDate: response.data.nextPaymentDate,
        lastBilledDate: response.data.lastBilledDate,
        isPaid: response.data.isPaid,
        subscriptionStatus: response.data.subscriptionStatus,
      });
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to renew subscription",
      );
    } finally {
      setIsRenewing(false);
    }
  };

  const isFree = plan === "Free";
  const busy = isSaving || isRenewing;

  // Rendered through a portal because the trigger lives inside a table cell.
  // That cell carries `text-right`, which the modal would otherwise inherit,
  // and a fixed-position overlay nested in a <td> is at the mercy of whatever
  // stacking context the table sets up. `dir="ltr"` pins the layout, since
  // every string in here is English while the surrounding app is Hebrew.
  return createPortal(
    <div
      dir="ltr"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6 overflow-y-auto text-left"
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative my-auto max-h-[calc(100vh-3rem)] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Edit User Subscription
        </h2>
        <p className="text-sm text-slate-500 mb-5 break-words">
          {user.restaurantName}
        </p>

        {/* Current subscription window — read-only here on purpose. It moves
            only through the renewal panel below, never by typing a date. */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Subscription ends
            </span>
            <span className="text-sm font-bold text-slate-900">
              {formatDate(user.nextPaymentDate)}
            </span>
          </div>
          <div className="mt-1 text-right">
            <span
              className={`text-xs font-medium ${
                daysUntil(user.nextPaymentDate) === null
                  ? "text-slate-400"
                  : daysUntil(user.nextPaymentDate) < 0
                    ? "text-red-600"
                    : daysUntil(user.nextPaymentDate) <= 7
                      ? "text-amber-600"
                      : "text-slate-500"
              }`}
            >
              {describeRemaining(user.nextPaymentDate)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Plan
          </label>
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Trial End Date
          </label>
          <input
            type="date"
            value={trialEnds}
            onChange={(e) => setTrialEnds(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 outline-none focus:ring-slate-500 focus:border-slate-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            Free-trial window only. Does not extend a paid subscription.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pb-5">
          <button
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={busy}
            className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Renewal writes a different field than anything above it, so it gets
            its own panel and its own button. Save does not touch it. */}
        <div className="border-t border-slate-200 pt-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <h3 className="text-sm font-bold text-emerald-900">
              Renew Paid Subscription
            </h3>
            <p className="text-xs text-emerald-700/80 mt-0.5 mb-3">
              Payment is collected outside the system. This records another
              period as paid.
            </p>

            {/* The base is today once the previous period has lapsed, so show
                it rather than the stale end date — otherwise the new date
                below looks like it was calculated wrong. */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-slate-500">Extending from</span>
              <span className="font-bold text-slate-700">
                {formatDate(renewalBase(user.nextPaymentDate))}
                {daysUntil(user.nextPaymentDate) < 0 && (
                  <span className="ml-1 font-medium text-slate-400">
                    (today)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={renewalMonths}
                onChange={(e) => setRenewalMonths(Number(e.target.value))}
                disabled={isFree}
                className="flex-1 bg-white border border-emerald-200 text-slate-900 text-sm rounded-lg p-2 outline-none focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
              >
                <option value={1}>+ 1 month</option>
                <option value={3}>+ 3 months</option>
                <option value={6}>+ 6 months</option>
                <option value={12}>+ 12 months</option>
              </select>
              <button
                onClick={handleRenew}
                disabled={busy || isFree}
                className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRenewing ? "Renewing..." : "Renew"}
              </button>
            </div>

            {isFree ? (
              <p className="mt-3 text-xs text-slate-500">
                Free users have no subscription to renew.
              </p>
            ) : (
              <p className="mt-3 text-xs text-emerald-800">
                New date:{" "}
                <span className="font-bold">
                  {formatDate(
                    previewRenewal(user.nextPaymentDate, renewalMonths),
                  )}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
