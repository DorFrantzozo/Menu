import { toast } from "react-toastify";
import axiosInstance from "./baseUrl";

const updatePaidStatus = async (userId, isPaid) => {
  const response = await axiosInstance.put(
    `/user/updateUser/${userId}`,
    { isPaid },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data);
  return response.data;
};

const updateMenuSettings = async ({
  userId,
  wifiSsid,
  wifiPassword,
  displayWifi,
}) => {
  try {
    const response = await axiosInstance.put(`/user/updateUserMenuSettings`, {
      userId,
      wifiSsid,
      wifiPassword,
      displayWifi,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating menu settings:", error);
    return error?.response?.data?.message || "Unknown error";
  }
};

const SendLinkToEmail = async (email) => {
  try {
    const res = await axiosInstance.post("/sendResetPassword", {
      to: email,
      subject: "איפוס סיסמה",
      resetLink: `https://menuyou.online/account/resetpassword?email=${email}`,
      userName: "לקוח יקר", // אפשר להחליף לפי הצורך
    });

    if (res.data.success) {
      toast.success("נשלח קישור לאיפוס הסיסמה למייל שלך.");
    } else {
      toast.error("שליחת האימייל נכשלה.");
    }
  } catch (err) {
    toast.error("אירעה שגיאה בשליחת הקישור.");
    console.error(err);
  }
};

export { SendLinkToEmail, updatePaidStatus, updateMenuSettings };
