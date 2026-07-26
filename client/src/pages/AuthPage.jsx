import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {motion, AnimatePresence} from "framer-motion"; // <-- הוספנו את Framer Motion
import {setUser, setToken} from "../state/user/userSlice";
import {getCategories, getAllDishesAndMapToCategories} from "@/utils/fetchData";
import {setMenuCategories} from "@/state/menu/menuCategoriesSlice";
import axiosInstance from "../utils/baseUrl";
import logo from "../assets/logos/logo white background.jpg";
import Spinner from "@/components/Spinner";
import AuthInput from "../components/Auth/AuthInput";
import AuthToggle from "../components/Auth/AuthToggle";
import AuthVisuals from "../components/Auth/AuthVisuals";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    restaurantName: "",
    displayName: "",
    phone: "",
    agree: false,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!formData.agree) return toast.error("חובה לאשר את התקנון");

        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          if (key === "restaurantName") {
            fd.append(key, val.toLowerCase());
          } else {
            fd.append(key, val);
          }
        });
        if (logoFile) fd.append("logo", logoFile);

        const {data, status} = await axiosInstance.post("/user/signup", fd);
        if (status === 201) {
          dispatch(setUser(data.user));
          dispatch(setToken(data.token));
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        }
      } else {
        // Login Logic
        const {data, status} = await axiosInstance.post("/user/login", {
          email: formData.email,
          password: formData.password,
        });

        if (status === 200) {
          dispatch(setUser(data.user));
          dispatch(setToken(data.token));
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Fetching Menu Data
          const categories = await getCategories(data.user._id);
          const mapped = await getAllDishesAndMapToCategories(
            data.user,
            categories,
            dispatch,
          );
          dispatch(setMenuCategories(mapped));

          navigate("/dashboard");
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (isSignup ? "ההרשמה נכשלה" : "פרטים שגויים");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 md:p-8 font-sans"
      dir="rtl"
    >
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden min-h-[85vh]">
        {/* צד ימין: טפסים */}
        <div className="w-full lg:w-1/2 flex flex-col py-12 px-8 md:px-20 relative overflow-y-auto">
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-sm">
              <Spinner />
            </div>
          )}

          {/* הלוגו */}
          <div className="flex justify-between items-start mb-12">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            />
            <AuthToggle isSignup={isSignup} setIsSignup={setIsSignup} />
          </div>

          <div className="text-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignup ? "signup-header" : "signin-header"}
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -20}}
                transition={{duration: 0.3}}
              >
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  {isSignup ? "הצטרפות למהפכה" : "שלום שוב!"}
                </h1>
                <p className="text-slate-400 text-lg mb-10">
                  {isSignup
                    ? "הפוך את המסעדה שלך לדיגיטלית בתוך דקות."
                    : "היה חסר לנו הניחוח של המטבח שלך..."}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleAuth} className="flex flex-col gap-6">
              <AnimatePresence initial={false} mode="popLayout">
                {isSignup && (
                  <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    className="flex flex-col gap-6"
                  >
                    {/* Logo Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-4">
                      <div className="relative group">
                        <span className="absolute -top-2 -right-2 bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-200 z-10 shadow-sm pointer-events-none">
                          אופציונלי
                        </span>
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:border-[#00C38B] transition-all relative">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-[#00C38B]">
                              <span className="material-icons-round text-3xl">
                                add_a_photo
                              </span>
                              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                                לוגו המסעדה
                              </span>
                            </div>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </div>
                        {logoPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                            }}
                            className="absolute -top-1 -right-1 bg-white shadow-md rounded-full p-1 text-red-500 hover:scale-110 transition-transform z-20"
                          >
                            <span className="material-icons-round text-xs">
                              close
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AuthInput
                        label="שם המסעדה (EN)"
                        name="restaurantName"
                        placeholder="MyResto"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        required
                      />
                      <AuthInput
                        label="שם להצגה (עברית)"
                        name="displayName"
                        placeholder="המסעדה שלי"
                        value={formData.displayName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AuthInput
                label="אימייל"
                type="email"
                name="email"
                placeholder="chef@restaurant.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="flex flex-col gap-1">
                <AuthInput
                  label="סיסמה"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {!isSignup && (
                  <button
                    onClick={() => navigate("/request/resetpassword")}
                    type="button"
                    className="text-xs text-slate-400 hover:text-[#00C38B] self-start transition-colors mr-4 mt-1"
                  >
                    שכחתי סיסמה?
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {isSignup && (
                  <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    exit={{opacity: 0, height: 0}}
                    className="flex flex-col gap-6"
                  >
                    <AuthInput
                      label="טלפון"
                      name="phone"
                      placeholder="050-0000000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <div className="flex items-center gap-3 mr-4">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-slate-300 text-[#00C38B] focus:ring-[#00C38B]"
                      />
                      <span className="text-sm text-slate-500">
                        אני מסכים ל
                        <a
                          href="/termofservice"
                          className="text-[#00C38B] font-bold hover:underline mx-1"
                        >
                          תנאי השימוש
                        </a>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{scale: 1.01}}
                whileTap={{scale: 0.98}}
                type="submit"
                className="w-full bg-[#00C38B] text-white font-bold py-4 rounded-full shadow-[0_10px_20px_-5px_rgba(0,195,139,0.3)] hover:bg-[#00ab7a] transition-all flex justify-center items-center gap-2 mt-4"
              >
                {isSignup ? "התחל ניסיון חינם" : "כניסה למערכת"}
                {isSignup && <span className="text-xl">🚀</span>}
              </motion.button>
            </form>

            {/* Social Login Design Placeholder */}
            {/* <div className="mt-12">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative px-4 bg-white text-slate-300 text-xs font-medium uppercase tracking-wider">או המשך עם</span>
              </div>
              <div className="flex justify-center gap-4">
                {[1, 2, 3].map((i) => (
                  <button key={i} className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 bg-slate-200 rounded-full animate-pulse"></div>
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* צד שמאל: גרפיקה */}
        <AuthVisuals />
      </div>
    </div>
  );
};

export default AuthPage;
