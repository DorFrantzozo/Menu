import { useState } from "react";
import ShowWifi from "./ShowWifi";
import { updateMenuSettings } from "@/utils/updateData";
import { useSelector } from "react-redux";

const MenuFeatures = () => {
  const user = useSelector((state) => state.user.user);
  const [wifiSettings, setWifiSettings] = useState({
    userId: user._id || null,
    wifiSsid: user.wifiSettings.ssid || "",
    wifiPassword: user.wifiSettings.wifiPassword || "",
    displayWifi: user.wifiSettings.isEnabled || false,
  });

  const handleUpdateSettings = async () => {
    console.log(wifiSettings);

    try {
      console.log(
        wifiSettings.wifiSsid,
        wifiSettings.wifiPassword,
        user._id,
        wifiSettings.displayWifi
      );
      await updateMenuSettings(wifiSettings);
    } catch (error) {
      console.error("Error updating menu settings:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-20">
      <ShowWifi wifiSettings={wifiSettings} updateSettings={setWifiSettings} />
      <button
        onClick={handleUpdateSettings}
        className="bg-blue-500 text-black p-2 rounded"
      >
        עדכן הגדרות
      </button>
    </div>
  );
};

export default MenuFeatures;
