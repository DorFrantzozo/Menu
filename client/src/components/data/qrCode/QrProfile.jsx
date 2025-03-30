import {
  downloadQRCode,
  generateQRCode,
  shareQRCode,
} from "@/utils/qrGenerator";
import ArrowUpOnSquareIcon from "../../icons/ArrowUpOnSquareIcon";
import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { ShareIcon, UploadIcon } from "lucide-react";
import DownloadIcon from "@/components/icons/DownloadIcon";

const QrProfile = ({ userName }) => {
  const [qrcode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      if (userName) {
        const qrUrl = await generateQRCode(userName);
        setQrCode(qrUrl);
        setIsLoading(false);
      }
    };
    generateQR();
  }, [userName]);

  const handleDownloadQr = (e) => {
    e.preventDefault();
    downloadQRCode(qrcode); // מעביר את ה-qrcode כפרמטר לפונקציה
  };

  const handleShareClick = (e) => {
    e.preventDefault(); // מונע מהכפתור לבצע פעולה ברירת מחדל (כמו ניווט מחדש)
    console.log(qrcode);
    shareQRCode({ qrcode: qrcode }); // מבצע את השיתוף
  };

  if (isLoading) {
    return <div className="text-center">טוען קוד QR...</div>;
  }

  return (
    <>
      <h1 className="text-center mt-6">קוד ה - QR של המסעדה</h1>
      <div className="flex justify-center ">
        <img src={qrcode} alt="qrcode" />
      </div>
      <div className="flex justify-center gap-2">
        <button
          className="bg-black p-2  flex text-white rounded-lg w-[120px] hover:bg-zinc-800 transition"
          onClick={handleDownloadQr}
        >
          הורד QR{" "}
          <span className="ms-4">
            <DownloadIcon />
          </span>
        </button>
        <button
          className="bg-green-500 p-2 rounded-lg hover:bg-green-700  w-[120px] transition flex text-white"
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
