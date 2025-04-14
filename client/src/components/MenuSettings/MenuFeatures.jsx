import { useEffect, useState } from "react";
import ShowWifi from "./ShowWifi";
import { updateMenuSettings } from "@/utils/updateData";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/state/user/userSlice";

const MenuFeatures = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const storedUser = localStorage.getItem("user");
  const userFromLocalStorage = storedUser ? JSON.parse(storedUser) : null;

  const [wifiSettings, setWifiSettings] = useState({
    userId: userFromLocalStorage?._id || user?._id || null,
    wifiSsid: user?.wifiSettings?.ssid || "",
    wifiPassword: user?.wifiSettings?.wifiPassword || "",
    displayWifi: user?.wifiSettings?.isEnabled ?? false,
  });

  useEffect(() => {}, []);
  const handleUpdateSettings = async () => {
    console.log(wifiSettings);

    try {
      const response = await updateMenuSettings(wifiSettings);
      dispatch(updateUser(response.user));
    } catch (error) {
      console.error("Error updating menu settings:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10 ">
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
