import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FreeTrailBanner from "@/components/Cards/FreeTrailBanner";
import QrProfile from "@/components/data/qrCode/QrProfile";

const Profile = () => {
  const navigate = useNavigate();
  const [userFromStorage, setUser] = useState(null);
  const [qrSlug, setQrSlug] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setQrSlug(user.qrSlug);
    }
  }, []);

  return (
    <>
      <FreeTrailBanner user={userFromStorage} />
      <div className="flex  justify-center  px-4">
        <div dir="rtl" className="  w-full max-w-3xl p-8">
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
          </div>

          <div className="flex flex-col bg-black text-white rounded-full p-2 w-[fit] items-center mt-4">
            <button
              className="w-full"
              onClick={() =>
                window.open(
                  `https://${userFromStorage?.restaurantName.toLowerCase()}.menuyou.online/menu`,
                  "_blank"
                )
              }
            >
              אתר המסעדה
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex  justify-between items-center gap-2">
              <label className="  text-gray-900">שם המסעדה</label>
              <span className="">{userFromStorage?.restaurantName}</span>
            </div>
            <hr />

            <div className="flex justify-between   items-center gap-2">
              <label className="  text-gray-900">שם להצגה </label>
              <span className="">{userFromStorage?.displayName}</span>
            </div>
            <hr />
            <div className="flex justify-between  gap-2">
              <label className="  text-gray-900">מייל </label>
              <span className="">{userFromStorage?.email}</span>
            </div>
            <hr />
            <div className="flex justify-between  items-center gap-2">
              <label className="  text-gray-900">טלפון </label>
              <span className="">{userFromStorage?.phone}</span>
            </div>
            <div className="flex  justify-center  gap-4">
              <button
                onClick={() => navigate("/profile/edit")}
                className="bg-black text-white px-4 py-2 rounded-full mb-10"
              >
                {" "}
                עריכת פרופיל{" "}
              </button>
            </div>

            <QrProfile qrSlug={qrSlug} />
          </div>

          <hr className="my-6 border-t border-gray-300" />
          <h1 className="text-center text-sm text-gray-500 mb-4">
            * פרטים אלו לא יוצגו באופן ציבורי
          </h1>

          <div className="text-sm text-center mt-4 ">
            <p>Id:  {userFromStorage?._id}</p>
            <p>סוג מנוי : {userFromStorage?.isPaid ? "Premium" : "Trail"}</p>
            <p className="mt-2">
              חבר מאז: {userFromStorage?.createdAt.split("T")[0]}
            </p>
            <p className="mt-2">עיצוב מספר: {userFromStorage?.designNumber}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
