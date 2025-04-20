import axiosInstance from "@/utils/baseUrl";
import { SendLinkToEmail } from "@/utils/updateData";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResetForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await SendLinkToEmail(email);
  };
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white text-black flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full md:border rounded border-zinc-800 p-20">
        <div className="border rounded-full border-black w-fit p-2 ms-auto me-auto mb-10">
          <LockClosedIcon width={70} />
        </div>
        <h1 className="text-3xl font-semibold text-center mb-6 tracking-tight">
          איפוס סיסמה
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          הזן את כתובת המייל שלך וישלח אליך קישור לאיפוס הסיסמה.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="המייל שלך"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:opacity-90 transition"
          >
            שלח קישור לאיפוס
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetForm;
