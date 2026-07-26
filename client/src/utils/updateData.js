import { toast } from "react-toastify";
import axiosInstance from "./baseUrl";

const updatePaidStatus = async (userId, isPaid) => {
  const response = await axiosInstance.put(
    `/user/updateUser/${userId}`,
    { isPaid },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    }
  );
  return response.data;
};

const updateMenuSettings = async ({
  userId,
  wifiSsid,
  wifiPassword,
  displayWifi,
}) => {
  try {
    const response = await axiosInstance.put(
      `/user/updateUserMenuSettings`, 
      {
        userId,
        wifiSsid,
        wifiPassword,
        displayWifi,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating menu settings:", error);
    return error?.response?.data?.message || "Unknown error";
  }
};

const SendLinkToEmail = async (email) => { 
  try {
   
    const { data } = await axiosInstance.post(`/auth/sendResetPasswordLink/`, {
      to: email,
      subject: "איפוס סיסמה",
      userName: "לקוח יקר",
    });

    if (data?.success) {
      toast.success("נשלח קישור לאיפוס הסיסמה למייל שלך.");
    } else {
      toast.error("שליחת האימייל נכשלה: " + (data?.message || "שגיאה לא ידועה"));
      console.error("שגיאה מהשרת:", data);
    }
  } catch (err) {
    const message = err.response?.data?.message || err.message || "שגיאה לא ידועה";
    toast.error("אירעה שגיאה בשליחת הקישור: " + err.response.body);
    console.error("שגיאה מהבקשה:", err);
  }
};



export { SendLinkToEmail, updatePaidStatus, updateMenuSettings };
