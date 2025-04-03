import QRCode from "qrcode";

// אפשרויות צבעים
const qrColorOptions = {
  blackOnWhite: { dark: "#000000", light: "#FFFFFF" }, // שחור על לבן
  blackOnTransparent: { dark: "#000000", light: "#00000000" }, // שחור על שקוף
  whiteOnBlack: { dark: "#FFFFFF", light: "#000000" }, // לבן על שחור
  whiteOnTransparent: { dark: "#FFFFFF", light: "#00000000" }, // לבן על שקוף
};

// יצירת QR Code
import QRCode from "qrcode";

export const generateQRCode = async (userName, qrColor) => {
  const url = `${userName}.menuyou.online/menu`;

  try {
    // הגדרת קוד ה-QR עם הצבע שנבחר
    const qrUrl = await QRCode.toDataURL(url, {
      color: {
        dark:
          qrColor === "שחור עם רקע שקוף"
            ? "#000000"
            : qrColor === "שחור עם רקע לבן"
              ? "#000000"
              : "#FFFFFF", // צבע QR
        light: qrColor === "שחור עם רקע שקוף" ? "#00000000" : "#FFFFFF", // צבע הרקע
      },
      errorCorrectionLevel: "H", // רמת תיקון השגיאות
    });

    console.log(qrUrl);
    return qrUrl;
  } catch (error) {
    console.error("שגיאה בהפקת קוד ה-QR:", error);
  }
};

// פונקציה להורדת ה-QR
export const downloadQRCode = (qrcode, colorType) => {
  const link = document.createElement("a");
  link.href = qrcode;
  link.download = `restaurant_qr_${colorType}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// פונקציה לשיתוף ה-QR
export const shareQRCode = async ({ qrcode, colorType = "blackOnWhite" }) => {
  if (navigator.share) {
    try {
      const response = await fetch(qrcode);
      const blob = await response.blob();
      const file = new File([blob], `qrcode_${colorType}.png`, {
        type: blob.type,
      });

      await navigator.share({
        title: "QR Code למסעדה",
        text: "סרוק את קוד ה-QR כדי לגשת לתפריט המסעדה",
        files: [file],
      });
    } catch (error) {
      console.error("שגיאה בשיתוף:", error);
    }
  } else {
    alert("השיתוף לא נתמך במכשיר שלך");
  }
};
