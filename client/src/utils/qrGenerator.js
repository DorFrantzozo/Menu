import QRCode from "qrcode";

export const generateQRCode = async (userName) => {
  const url = `${userName}.menuyou.online/menu`;

  try {
    // הגדרת קוד ה-QR עם רקע שקוף
    const qrUrl = await QRCode.toDataURL(url, {
      // color: {
      //   dark: "#000000", // צבע ה-QR עצמו (שחור)
      //   light: "#00000000", // רקע שקוף
      // },

      errorCorrectionLevel: "H", // רמת תיקון השגיאות
    });

    console.log(qrUrl);
    return qrUrl;
  } catch (error) {
    console.error("שגיאה בהפקת קוד ה-QR:", error);
  }
};
export const downloadQRCode = (qrcode) => {
  const link = document.createElement("a");
  link.href = qrcode; // כתובת ה-QR
  link.download = "restaurant_qr.png"; // שם הקובץ שיורד
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// פונקציה לשיתוף ה-QR
export const shareQRCode = async ({ qrcode }) => {
  if (navigator.share) {
    try {
      // המר את ה-Base64 ל-Blob
      const byteCharacters = atob(qrcode.split(",")[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: "image/png" });

      // צור את הקובץ
      const file = new File([blob], "qrcode.png", { type: "image/png" });

      // שלח את הקובץ דרך שיתוף
      await navigator.share({
        title: "QR Code למסעדה",
        text: "סרוק את קוד ה-QR כדי לגשת לתפריט המסעדה",
        files: [file], // שלח את הקובץ
      });
    } catch (error) {
      console.error("שגיאה בשיתוף:", error);
    }
  } else {
    alert("השיתוף לא נתמך במכשיר שלך");
  }
};
