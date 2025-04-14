import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ToggleButton from "../buttons/ToggleButton";
import { toast } from "react-toastify";
import { WifiIcon } from "@heroicons/react/24/outline";
const ShowWifi = ({ wifiSettings = {}, updateSettings }) => {
  const [showWifi, setShowWifi] = useState(wifiSettings.displayWifi ?? false);
  const [ssid, setSsid] = useState(wifiSettings.wifiSsid || "");
  const [password, setPassword] = useState(wifiSettings.wifiPassword || "");

  useEffect(() => {
    setShowWifi(wifiSettings.displayWifi ?? false);
    setSsid(wifiSettings.wifiSsid || "");
    setPassword(wifiSettings.wifiPassword || "");
  }, [wifiSettings]);

  const handleSelectWifi = () => {
    // בדיקה שהשדות מלאים
    if (!ssid || !password) {
      toast.error("יש להזיו את שם וסיסמת הרשת כדי להציגה", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const newSettings = {
      ...wifiSettings,
      wifiSsid: ssid,
      wifiPassword: password,
      displayWifi: !showWifi,
    };

    setShowWifi(!showWifi);
    updateSettings(newSettings);
  };

  const handleInputChange = (field, value) => {
    const newSettings = {
      ...wifiSettings,
      [field]: value,
    };
    updateSettings(newSettings);

    if (field === "wifiSsid") setSsid(value);
    if (field === "wifiPassword") setPassword(value);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 px-4 py-6">
      {/* הצג Wifi */}
      <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
        <ToggleButton checked={showWifi} onChange={handleSelectWifi} />
        <span dir="rtl" className="text-gray-700 text-base flex gap-4">
          <WifiIcon width={22} />
          הצג Wifi
        </span>
      </div>
      {/* תצוגת Wifi */}
      <div dir="rtl" className="bg-white shadow rounded-xl p-4">
        <h2 className="text-gray-700 text-sm mb-2">רשת Wifi</h2>
        <div className="text-gray-900 text-base">
          <p>SSID: {ssid || "דוגמה"}</p>
          <p>Password: {password || "********"}</p>
        </div>
      </div>

      {/* טופס עריכה */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 dir="rtl" className="text-gray-700 text-sm mb-4">
          עריכת Wifi
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1" dir="rtl">
              שם ה-Wifi
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => handleInputChange("wifiSsid", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1" dir="rtl">
              סיסמה
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) =>
                handleInputChange("wifiPassword", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ShowWifi.propTypes = {
  wifiSettings: PropTypes.shape({
    wifiSsid: PropTypes.string,
    wifiPassword: PropTypes.string,
    address: PropTypes.string,
    userId: PropTypes.string,
    displayWifi: PropTypes.bool,
    displayAddress: PropTypes.bool,
  }),
  updateSettings: PropTypes.func.isRequired,
};

export default ShowWifi;
