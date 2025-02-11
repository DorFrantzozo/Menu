import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [img, setImg] = useState("");
  const navigate = useNavigate();
  const [userFromStorage, setUser] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string into an object
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email || userFromStorage?.email); // Use email from state or localStorage
    formData.append(
      "restaurantName",
      restaurantName || userFromStorage?.restaurantName
    ); // Use restaurant name from state or localStorage
    formData.append("password", password);
    formData.append("logo", img);

    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/updateUser/${userFromStorage?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("ok!");
        navigate("/profile");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to handle button click to trigger file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden input
  };

  // Function to handle the file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setImg(file); // Store the selected file for uploading
    }
  };

  return (
    <form dir="rtl" onSubmit={handleSubmit}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="space-y-12 flex w-full mt-28 ms-20 ">
        <div className="border-b border-gray-900/10 pb-12 w-full ">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            פרופיל
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            המידע הזה יוצג באופן ציבורי, לכן שים לב מה אתה משתף.
          </p>

          <hr className="w-full border-gray-300 my-4" />
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center">
              {userFromStorage?.logo ? (
                <img
                  className="w-40 h-30 rounded-full"
                  src={userFromStorage.logo}
                  alt="logo"
                />
              ) : (
                <UserCircleIcon className="w-20 h-20 rounded-full ml-4" />
              )}
              <p className="ml-4 text-bold">תמונת פרופיל</p>
            </div>

            <div className="flex space-x-4 me-28">
              <button
                className="border rounded-lg w-36 text-sm h-10 me-4"
                onClick={handleButtonClick}
                type="button"
              >
                העלה תמונה חדשה
              </button>
              <button
                className="bg-slate-50 shadow-md rounded-lg w-20 text-sm h-10"
                onClick={() => setImg(null)} // Handle removing the image
                type="button"
              >
                הסר
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-7">
            <div className="sm:col-span-8 w-60">
              <label
                htmlFor="restaurant-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                שם המסעדה
              </label>
              <p className="text-sm"> שנה את שם המסעדה </p>
              <div className="mt-2">
                <input
                  onChange={(e) => setRestaurantName(e.target.value)}
                  id="restaurant-name"
                  name="restaurant-name"
                  type="text"
                  placeholder={userFromStorage?.restaurantName || ""}
                  autoComplete="restaurant-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-8 w-60">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                מייל
              </label>
              <p className="text-sm"> שנה את מייל המסדעה </p>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={userFromStorage?.email || ""}
                  className="block w-full text-left rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-6 w-60 mt-10 ">
              <hr className="mb-10 w-[1010px]" />
              <h1>* פרטים אלו לא יוצגו באופן ציבורי</h1>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                סיסמה
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="הכנס סיסמה"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div id="userFromStrotage" className="">
                <h1 className="mt-5">Id: {userFromStorage?._id}</h1>
                <h1 className="mt-5">
                  Member Since: {userFromStorage?.createdAt.split("T")[0]}
                </h1>
                <h1 className="mt-5">
                  Design : {userFromStorage?.designNumber}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end ml-10 gap-x-6">
        <button
          type="submit"
          className="rounded-md mb-3 bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:text-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          שמירה
        </button>
      </div>
    </form>
  );
};

export default Profile;
