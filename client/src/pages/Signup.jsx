import { useState } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../state/user/userSlice";
import { PhotoIcon } from "@heroicons/react/24/solid";
import logo from "../assets/img/logoBlack.png";
import axiosInstance from "../utils/baseUrl";
const Signup = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [img, setImg] = useState("");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("restaurantName", restaurantName);
    formData.append("password", password);
    formData.append("logo", img);
    formData.append("phone", phone);
    formData.append("displayName", displayName);

    try {
      const response = await axiosInstance.post("/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const { user, token } = response.data;
        dispatch(setUser(user));
        dispatch(setToken(token));
        localStorage.setItem("token", token);
        toast.success("משתמש נוצר בהצלחה");
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response?.data || error.message
      );
      toast.error("Failed to create user");
    }
  };
  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={logo}
            className="h-[180px] w-[290px]  mx-auto"
          />
          <h2 className="text-center text-black text-2xl  leading-9 tracking-tight ">
            יצירת חשבון
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg mb-2 text-end font-medium leading-6 text-black"
              >
                שם המסעדה
              </label>
              <p className="text-xs font-bold text-end"> באנגלית בלבד *</p>
              <div className="mt-2">
                <input
                  onChange={(e) => setRestaurantName(e.target.value)}
                  id="name"
                  name="name"
                  pattern="[A-Za-z]+"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-lg mb-2 text-end font-medium leading-6 text-black"
              >
                שם להצגה
              </label>
              <p className="text-xs font-bold text-end"> ניתן בעברית *</p>
              <div className="mt-2">
                <input
                  onChange={(e) => setDisplayName(e.target.value)}
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm text-end font-medium leading-6 text-black"
              >
                כתובת מייל
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-end  leading-6  text-black"
              >
                סיסמה
              </label>

              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-end mb-2  leading-6  text-black">
                טלפון
              </label>
              <input
              onChange={(e) => setPhone(e.target.value)}
                type="tel"
                name="phone"
                id="phone"
                required
                autoComplete="tel"
                className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-green-400 px-6 py-10 bg-white">
              <div className="text-center">
                <PhotoIcon
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-300"
                />
                {img && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected file: {img.name} {/* Display file name */}
                  </p>
                )}
                <div
                  dir="rtl"
                  className="mt-4 flex text-sm leading-6 text-gray-600"
                >
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer me-2 rounded-md bg-black w-[100px] font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-offset-2 hover:text-green-400"
                  >
                    <span>העלה תמונה</span>
                    <input
                      id="file-upload"
                      name="logo"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setImg(e.target.files[0])} // Assuming you're handling image file upload here
                    />
                  </label>
                  <p className="pl-1 text-black">או גרור לחלונית</p>
                </div>

                <p className="text-xs leading-5 text-black">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm   hover:text-black    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                הירשם
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            <button
              onClick={() => navigate("/signin")}
              className="font-semibold leading-6 me-2 text-green-400 hover:text-black"
            >
              התחבר
            </button>
            ? כבר רשום אלינו{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
