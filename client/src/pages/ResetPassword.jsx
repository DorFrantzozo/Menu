import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/baseUrl";
import { toast } from "react-toastify";
import NavBarLanding from "@/components/nav/NavBarLanding";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { to } from "@react-spring/web";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 



  const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    toast.error("הסיסמאות אינן תואמות");
    return;
  }

  try {
    await axiosInstance.post("/user/resetPassword", {
      data: {
        token,
        newPassword: password,
      },
    });

    toast.success("הסיסמה אופסה בהצלחה! מועבר לעמוד התחברות...");
    setTimeout(() => navigate("/signin"), 3000);
  } catch (err) {
    const message = err.response?.data?.message;
   
    if (message === "הטוקן פג תוקף") {
      toast.error("הקישור לאיפוס הסיסמה פג תוקף. נסה שוב.");
      setTimeout(() => navigate("/signin"), 3000);
    } else {
      toast.error(message || "שגיאה בלתי צפויה");
    }

    setError(message);
  }
};
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        הטוקן חסר או לא תקין.
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <NavBarLanding />
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-xl rounded-xl">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            איפוס סיסמה
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              {/* סיסמה חדשה */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  סיסמה חדשה
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"
                  >
                    {showPassword ? < EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* אימות סיסמה */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  אימות סיסמה
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? < EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                אפס סיסמה
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
