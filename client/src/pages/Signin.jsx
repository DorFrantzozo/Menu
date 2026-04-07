import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {setUser, setToken} from "../state/user/userSlice";
import {getCategories, getAllDishesAndMapToCategories} from "@/utils/fetchData";
import {setMenuCategories} from "@/state/menu/menuCategoriesSlice";
import logo from "../assets/img/logoBlack.avif";
import axiosInstance from "../utils/baseUrl";
import Spinner from "@/components/Spinner";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const {user, token, expireTime} = response.data;
        dispatch(setUser(user));
        dispatch(setToken(token));
        localStorage.setItem("token", token);
        localStorage.setItem("expireTime", expireTime);
        localStorage.setItem("user", JSON.stringify(user));

        const categories = await getCategories(user._id);
        const categoriesWithDishes = await getAllDishesAndMapToCategories(
          user,
          categories,
          dispatch,
        );
        dispatch(setMenuCategories(categoriesWithDishes));
        localStorage.setItem(
          "categories",
          JSON.stringify(categoriesWithDishes),
        );

        toast.success("התחברות בהצלחה");
        navigate("/dashboard");
      }
    } catch {
      toast.error("שם המשתמש או הסיסמה אינם תקינים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/70 z-10 rounded-2xl">
            <Spinner />
          </div>
        )}

        <div className="flex justify-center mb-6">
          <img src={logo} alt="iMenu Logo" className="h-20" />
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
          התחברות לחשבון
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
          <div>
            <label className="block text-right text-sm font-medium text-gray-600 mb-1">
              כתובת מייל
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-right text-sm font-medium text-gray-600 mb-1">
              סיסמה
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
            />
            <div className="text-left text-sm mt-2">
              <button
                type="button"
                className="text-orange-500 hover:text-black"
                onClick={() => navigate("/request/resetpassword")}
              >
                שכחתי סיסמה
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            התחבר
          </button>
        </form>

        <div dir="rtl" className="text-center ">
          <p className="text-center text-sm text-gray-500 mt-8">
            אין לך חשבון?
            <button
              onClick={() => navigate("/auth")}
              className="text-orange-500 hover:text-black font-medium ms-2"
            >
              הירשם עכשיו
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
