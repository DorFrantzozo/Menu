import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axiosInstance from "@/utils/baseUrl";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import AuthInput from "../components/Auth/AuthInput";
import AuthVisuals from "../components/Auth/AuthVisuals";
import logo from "../assets/logos/logo white background.jpg";
import Spinner from "@/components/Spinner";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/resetPassword", {
        data: {
          token,
          newPassword: password,
        },
      });

      toast.success("הסיסמה אופסה בהצלחה! מועבר לעמוד התחברות...");
      setTimeout(() => navigate("/auth"), 3000); // Redirect to AuthPage
    } catch (err) {
      const message = err.response?.data?.message || "שגיאה בלתי צפויה";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 md:p-8 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-10 text-center">
             <img src={logo} alt="Logo" className="h-12 w-auto grayscale opacity-50 mx-auto mb-8" />
          <h2 className="text-2xl font-black text-slate-800 mb-4">אופס! הקישור לא תקין</h2>
          <p className="text-slate-400 mb-8">נראה שחסר טוקן בקישור שקיבלת במייל, או שהטוקן שגוי.</p>
          <button 
            onClick={() => navigate("/auth")}
            className="w-full bg-[#00C38B] text-white font-bold py-4 rounded-full shadow-lg"
          >
            חזרה להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 md:p-8 font-sans"
      dir="rtl"
    >
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden min-h-[85vh]">
        {/* צד ימין: טופס */}
        <div className="w-full lg:w-1/2 flex flex-col py-12 px-8 md:px-20 relative overflow-y-auto">
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-sm">
              <Spinner />
            </div>
          )}

          {/* הלוגו */}
          <div className="flex justify-between items-start mb-12">
            <img src={logo} alt="Logo" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
            <button 
                onClick={() => navigate("/auth")}
                className="text-xs font-bold text-slate-400 hover:text-[#00C38B] transition-colors flex items-center gap-1"
            >
                <span className="material-icons-round text-sm">arrow_forward</span>
                חזרה להתחברות
            </button>
          </div>

          <div className="text-right">
            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.3}}
            >
              <h1 className="text-4xl font-black text-slate-900 mb-2">
                איפוס סיסמה
              </h1>
              <p className="text-slate-400 text-lg mb-10">
                בחר סיסמה חדשה וחזקה כדי להמשיך לנהל את המסעדה שלך.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <AuthInput
                label="סיסמה חדשה"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <AuthInput
                label="אימות סיסמה"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <motion.button
                whileHover={{scale: 1.01}}
                whileTap={{scale: 0.98}}
                type="submit"
                className="w-full bg-[#00C38B] text-white font-bold py-4 rounded-full shadow-[0_10px_20px_-5px_rgba(0,195,139,0.3)] hover:bg-[#00ab7a] transition-all flex justify-center items-center gap-2 mt-4"
              >
                אפס סיסמה וצא לדרך
                <span className="text-xl">✨</span>
              </motion.button>
            </form>
          </div>
        </div>

        {/* צד שמאל: גרפיקה */}
        <AuthVisuals />
      </div>
    </div>
  );
};

export default ResetPassword;
