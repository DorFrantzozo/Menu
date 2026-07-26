import {useEffect, useState, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axiosInstance from "@/utils/baseUrl";
import {motion, AnimatePresence} from "framer-motion";
import logo from "../assets/logos/logo white background.jpg";
import Spinner from "@/components/Spinner";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("מאמת את כתובת המייל שלך...");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("אופס! נראה שחסר טוקן בקישור שקיבלת במייל.");
      return;
    }

    const verify = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;
      try {
        const response = await axiosInstance.post("/auth/verifyEmail", {token});
        setStatus("success");
        setMessage(response.data.message || "כתובת המייל אומתה בהצלחה!");
        setTimeout(() => navigate("/auth"), 4000); // Redirect to login
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "הקישור לאימות פג תוקף או שגוי.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-10 text-center relative overflow-hidden">
        <img src={logo} alt="Logo" className="h-12 w-auto grayscale opacity-50 mx-auto mb-8 cursor-pointer" onClick={() => navigate("/")} />
        
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
              <div className="flex justify-center mb-6 mt-4">
                <Spinner />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-4">רק רגע...</h2>
              <p className="text-slate-400 mb-2">{message}</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div key="success" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}}>
              <div className="w-16 h-16 bg-[#00C38B]/10 text-[#00C38B] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-round text-4xl">check_circle</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-4">אימות הושלם!</h2>
              <p className="text-slate-500 mb-8">{message}<br/>מיד תועבר לעמוד ההתחברות...</p>
              <button onClick={() => navigate("/auth")} className="w-full bg-[#00C38B] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#00ab7a] transition-all">
                המשך להתחברות
              </button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div key="error" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}}>
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-round text-4xl">error_outline</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-4">האימות נכשל</h2>
              <p className="text-slate-500 mb-8">{message}</p>
              <button onClick={() => navigate("/auth")} className="w-full bg-slate-800 text-white font-bold py-4 rounded-full shadow-lg hover:bg-slate-700 transition-all">
                חזרה להתחברות
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifyEmail;
