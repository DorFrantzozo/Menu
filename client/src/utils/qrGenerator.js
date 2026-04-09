import QRCode from "qrcode";

export const generateQRCode = async (qrSlug, qrColor) => {
  // Use VITE_BASE_URL but remove the /api suffix to point to the root backend URL, then append /go/<slug>
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/api$/, "");
  const url = `${baseUrl}/go/${qrSlug}`;

  try {
    const qrOptions = {
      color: {
        dark:
          qrColor === "לבן עם רקע שקוף" || qrColor === "לבן עם רקע כהה"
            ? "#FFFFFF"
            : "#000000", // QR לבן רק אם נבחר לבן
        light:
          qrColor === "שחור עם רקע שקוף" || qrColor === "לבן עם רקע שקוף"
            ? "#00000000" // רקע שקוף
            : qrColor === "לבן עם רקע כהה"
              ? "#333333" // רקע כהה (אפור כהה)
              : "#FFFFFF", // רקע לבן (ברירת מחדל)
      },
      errorCorrectionLevel: "H", // רמת תיקון השגיאות
    };

    const qrUrl = await QRCode.toDataURL(url, qrOptions);

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
