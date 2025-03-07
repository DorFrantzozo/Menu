import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../state/user/userSlice";
import QRCode from "qrcode";
import axiosInstance from "../utils/baseUrl";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [img, setImg] = useState("");
  const navigate = useNavigate();
  const [userFromStorage, setUser] = useState(null);
  const [qrcode, setQrCode] = useState("");
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

  useEffect(() => {
    if (userName) {
      // רק אם userName עודכן
      const generateQrCode = async () => {
        const url = `${userName}.http://localhost:5173/menu`;

        const qrUrl = await QRCode.toDataURL(url);
        setQrCode(qrUrl);
      };

      generateQrCode();
    }
  }, [userName]);

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
    <div className="min-h-[90vh] flex justify-center  mt-10 ">
      <form
        dir="rtl"
        onSubmit={handleSubmit}
        className="bg-white  rounded-lg p-8 w-full max-w-3xl h-full "
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          פרופיל
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          המידע הזה יוצג באופן ציבורי, לכן שים לב מה אתה משתף.
        </p>

        <div className="flex flex-col items-center space-y-4">
          {userFromStorage?.logo ? (
            <img
              className="w-24 h-24 rounded-full"
              src={userFromStorage.logo}
              alt="logo"
            />
          ) : (
            <UserCircleIcon className="w-24 h-24 text-gray-400" />
          )}

          <div className="flex space-x-4">
            <button
              className="border rounded-lg w-36 text-sm h-10 me-6"
              onClick={handleButtonClick}
              type="button"
            >
              העלה תמונה חדשה
            </button>
            <button
              className="bg-red-100 text-red-600 hover:bg-red-400 hover:text-white transition duration-300 rounded-lg w-20 text-sm h-10"
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <h1 className=" text-center mt">קוד ה - QR של המסדעה</h1>
          <div className="flex justify-center">
            <img src={qrcode} className="" alt="" />
          </div>
        </div>

        <hr className="my-6 mt-[10%]" />
        <h1 className="mt-[20%]">* פרטים אלו לא יוצגו באופן ציבורי</h1>
        <div>
          <label className="block text-sm font-medium text-gray-900">
            סיסמה
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="הכנס סיסמה"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="text-sm">
          <p className="mt-2">Id: {userFromStorage?._id}</p>
          <p className="mt-2">
            חבר מאז: {userFromStorage?.createdAt.split("T")[0]}
          </p>
          <p className="mt-2">עיצוב מספר: {userFromStorage?.designNumber}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
          >
            שמירה
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
