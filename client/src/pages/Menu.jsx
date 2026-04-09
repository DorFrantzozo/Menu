import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/baseUrl";
import Spinner from "@/components/Spinner";
import useTrackMenuView from "@/hooks/useTrackMenuView";
import { useLanguage } from "../context/LanguageContext";

// Import Designs
import Design1 from "../designs/Design1/Design1";
import Design2 from "../designs/Design2/Design2";
import Design3 from "../designs/Design3/Design3";
import Design4 from "../designs/Design4/Design4";
import Design5 from "../designs/Design5/Design5";
import Design6 from "@/designs/Design6/Design6";

const Menu = () => {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Extract slug from subdomain (e.g. "aB3x_9Qz" from "aB3x_9Qz.imenu-il.online")
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  // Only treat as a subdomain slug if there are 3+ parts (slug.domain.tld)
  const slug = parts.length >= 3 ? parts[0] : null;

  // Track view if we have a menu and it has an ID
  useTrackMenuView(menu?._id);

  const fetchData = async (slugParam) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/user/slug/${slugParam}`);

      if (response.data) {
        setMenu(response.data);
      } else {
        setError("התפריט לא נמצא");
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      if (err.response?.status === 404) {
        setError("התפריט לא נמצא");
      } else {
        setError("אירעה שגיאה בטעינת התפריט");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData(slug);
    } else {
      // No valid subdomain slug — not a menu page
      setError("התפריט לא נמצא");
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4" dir="rtl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">😕</h1>
        <p className="text-lg text-gray-600">{error}</p>
      </div>
    );
  }

  // Check for trial/payment status
  if (
    !menu.isPaid &&
    menu.trialExpiresAt &&
    new Date(menu.trialExpiresAt) <= new Date()
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-zinc-50" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons-round text-3xl text-zinc-400">restaurant</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-800 mb-2">תפריט בעריכה</h1>
          <p className="text-zinc-600">
            התפריט מתעדכן ברגעים אלו.
            <br />
            אנא פנו למלצר לקבלת תפריט מודפס בינתיים. עמכם הסליחה.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" dir={language === "en" ? "ltr" : "rtl"}>
      {menu.designNumber === 1 && <Design1 menu={menu} />}
      {menu.designNumber === 2 && <Design2 menu={menu} />}
      {menu.designNumber === 3 && <Design3 menu={menu} />}
      {menu.designNumber === 4 && <Design4 menu={menu} />}
      {menu.designNumber === 5 && <Design5 menu={menu} />}
      {menu.designNumber === 6 && <Design6 menu={menu} />}
    </div>
  );
};

export default Menu;

