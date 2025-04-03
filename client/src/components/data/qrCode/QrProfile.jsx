import {
  downloadQRCode,
  generateQRCode,
  shareQRCode,
} from "@/utils/qrGenerator";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { ShareIcon } from "lucide-react";
import DefaultDropDown from "../DefaultDropDown";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

const QrProfile = ({ userName }) => {
  const [qrcode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [qrColor, setQrColor] = useState("black");

  useEffect(() => {
    const generateQR = async () => {
      if (userName) {
        const qrUrl = await generateQRCode(userName, qrColor); // להעביר את הצבע לפונקציה
        setQrCode(qrUrl);
        setIsLoading(false);
      }
    };
    generateQR();
  }, [userName, qrColor]); // התלות בצבע וגם בשם המשתמש

  const handleDownloadQr = (e) => {
    e.preventDefault();
    downloadQRCode(qrcode); // מעביר את ה-qrcode כפרמטר לפונקציה
  };

  const handleShareClick = (e) => {
    e.preventDefault(); // מונע מהכפתור לבצע פעולה ברירת מחדל (כמו ניווט מחדש)
    shareQRCode({ qrcode: qrcode }); // מבצע את השיתוף
  };

  const handleColorChange = (color) => {
    setQrColor(color); // משנה את הצבע
    console.log(color);
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center mt-6">קוד ה - QR של המסעדה</h1>
      <div className="flex justify-center gap-0">
        <h1 className="p-1">בחר סוג QR</h1>
        <DefaultDropDown
          dropDownTitle=" QR סוג "
          dropDownItems={[
            "שחור עם רקע שקוף",
            "שחור עם רקע לבן",
            "לבן עם רקע שקוף",
          ]}
          handelSelectedProp={handleColorChange} // מעדכן את הצבע
        />
      </div>

      <div className="flex justify-center ">
        <img src={qrcode} alt="qrcode" />
      </div>
      <div className="flex justify-center gap-2">
        <button
          className="bg-black p-2 flex text-white rounded-lg w-[120px] hover:bg-zinc-800 transition"
          onClick={handleDownloadQr}
        >
          הורד QR{" "}
          <span className="ms-4">
            <DownloadIcon />
          </span>
        </button>
        <button
          className="bg-green-500 p-2 rounded-lg hover:bg-green-700 w-[120px] transition flex text-white"
          onClick={handleShareClick} // כעת הקריאה לפונקציה מתבצעת דרך פונקציה מקומית
        >
          שתף QR{" "}
          <span className="ms-4">
            {" "}
            <ShareIcon />
          </span>
        </button>
      </div>
    </>
  );
};

export default QrProfile;
