import {useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setToken, setUser} from "../state/user/userSlice";
import {PhotoIcon} from "@heroicons/react/24/solid";
import logo from "../assets/img/logoBlack.avif";
import axiosInstance from "../utils/baseUrl";
import Spinner from "@/components/Spinner";

const Signup = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [img, setImg] = useState("");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agree) {
      toast.error("חובה לאשר את התקנון כדי ליצור חשבון");
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("restaurantName", restaurantName);
    formData.append("password", password);
    formData.append("logo", img);
    formData.append("phone", phone);
    formData.append("displayName", displayName);

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/signup", formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      if (response.status === 201) {
        const {user, token} = response.data;
        dispatch(setUser(user));
        dispatch(setToken(token));
        localStorage.setItem("token", token);
        toast.success("משתמש נוצר בהצלחה");
        setLoading(false);
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response?.data || error.message,
      );
      toast.error("יצירת המשתמש נכשלה");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      {loading ? (
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="mt-4 text-gray-600">יוצר חשבון, אנא המתן...</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="iMenu Logo" className="h-20" />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
            יצירת חשבון
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                שם המסעדה (באנגלית בלבד)
              </label>
              <input
                pattern="[A-Za-z]+"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                שם להצגה (בעברית)
              </label>
              <input
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                כתובת מייל
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                סיסמה
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                טלפון
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-black focus:ring-2 outline-none"
              />
            </div>

            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-amber-400 px-6 py-8 bg-white">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-10 w-10 text-gray-300" />
                {img && (
                  <p className="mt-2 text-sm text-amber-500">
                    Selected file: {img.name}
                  </p>
                )}
                <div
                  dir="rtl"
                  className="mt-4 flex text-sm text-gray-600 justify-center"
                >
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-black text-white px-3 py-1 rounded-md font-semibold hover:text-amber-400"
                  >
                    העלה תמונה
                    <input
                      id="file-upload"
                      name="logo"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setImg(e.target.files[0])}
                    />
                  </label>
                  <span className="mx-2">או גרור לחלונית</span>
                </div>
                <p className="text-xs text-black mt-1">PNG, JPG, GIF עד 10MB</p>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm p-2 text-gray-600">
                  קראתי את תנאי השימוש ואני מסכים לתקנון
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition"
            >
              הירשם
            </button>
          </form>

          <p dir="rtl" className="text-center text-sm text-gray-500 mt-8">
            כבר רשום?
            <button
              onClick={() => navigate("/auth")}
              className="text-orange-500 hover:text-black font-medium ms-2"
            >
              התחבר
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Signup;
