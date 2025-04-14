import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ToggleButton from "../buttons/ToggleButton";
import { toast } from "react-toastify";

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
      toast.error("יש להזין גם שם רשת וגם סיסמה לפני שניתן להציג את ה-WiFi", {
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
    <div className="flex gap-24">
      {/* תצוגת מידע */}
      <div className="block rounded border w-fit p-4 h-22 border-black">
        <p>Wifi : {ssid || "דוגמה"}</p>
        <p>Password : {password || "********"}</p>
      </div>

      {/* טופס עריכה */}
      <div>
        <div>
          <input
            type="text"
            className="w-[40%] required h-10 rounded"
            value={ssid}
            onChange={(e) => handleInputChange("wifiSsid", e.target.value)}
          />
          <label dir="rtl" className="me-6">
            שם ה-Wifi
          </label>
        </div>

        <div className="mt-6">
          <input
            type="password"
            className="w-[40%] required h-10 rounded"
            value={password}
            onChange={(e) => handleInputChange("wifiPassword", e.target.value)}
          />
          <label dir="rtl" className="me-6">
            סיסמה
          </label>
        </div>
      </div>

      {/* סוויץ׳ */}
      <div dir="rtl" className="flex items-center">
        <h1 className="me-4 text-xl">הצג Wifi</h1>
        <ToggleButton checked={showWifi} onChange={handleSelectWifi} />
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
