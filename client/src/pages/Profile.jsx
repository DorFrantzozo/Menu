import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../state/user/userSlice";
import axiosInstance from "../utils/baseUrl";
import FreeTrailBanner from "@/components/Cards/FreeTrailBanner";
import QrProfile from "@/components/data/qrCode/QrProfile";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [img, setImg] = useState("");
  const navigate = useNavigate();
  const [userFromStorage, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setUserName(user.restaurantName);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email || userFromStorage?.email);
    formData.append(
      "restaurantName",
      restaurantName || userFromStorage?.restaurantName
    );
    formData.append("password", password);
    formData.append("logo", img);

    try {
      const response = await axiosInstance.put(
        `/user/updateUser/${userFromStorage?._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        dispatch(updateUser(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleButtonClick = () => fileInputRef.current.click();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setImg(file);
  };

  return (
    <>
      <FreeTrailBanner user={userFromStorage} />
      <div className="flex justify-center mt-10 px-4">
        <form
          dir="rtl"
          onSubmit={handleSubmit}
          className="bg-white  w-full max-w-3xl p-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-4">
            פרופיל
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            המידע הזה יוצג באופן ציבורי, לכן שים לב מה אתה משתף.
          </p>

          <div className="flex flex-col items-center space-y-6 b">
            {userFromStorage?.logo ? (
              <img
                className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-200"
                src={userFromStorage.logo}
                alt="logo"
              />
            ) : (
              <UserCircleIcon className="w-32 h-32 text-gray-400" />
            )}

            <div className="flex gap-4">
              <button
                className="border rounded-lg px-6 py-2 text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={handleButtonClick}
                type="button"
              >
                העלה תמונה חדשה
              </button>
              <button
                className="bg-red-100 text-red-600 hover:bg-red-400 hover:text-white rounded-lg px-6 py-2 text-sm font-medium"
                onClick={() => setImg(null)}
                type="button"
              >
                הסר תמונה
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                שם המסעדה
              </label>
              <input
                onChange={(e) => setRestaurantName(e.target.value)}
                type="text"
                placeholder={userFromStorage?.restaurantName || ""}
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                מייל
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={userFromStorage?.email || ""}
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <QrProfile userName={userName} />
          </div>

          <hr className="my-6 border-t border-gray-300" />
          <h1 className="text-center text-sm text-gray-500 mb-4">
            * פרטים אלו לא יוצגו באופן ציבורי
          </h1>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              סיסמה
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="הכנס סיסמה"
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="text-sm text-center mt-4">
            <p>Id: {userFromStorage?._id}</p>
            <p>סוג מנוי : {userFromStorage?.isPaid ? "פרימיום" : "ניסיון"}</p>
            <p className="mt-2">
              חבר מאז: {userFromStorage?.createdAt.split("T")[0]}
            </p>
            <p className="mt-2">עיצוב מספר: {userFromStorage?.designNumber}</p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-green-500 transition"
            >
              שמירה
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
