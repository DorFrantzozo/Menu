import {
  downloadQRCode,
  generateQRCode,
  shareQRCode,
} from "@/utils/qrGenerator";
import DefaultDropDown from "../DefaultDropDown";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import PropTypes from "prop-types";

const QrProfile = ({ qrSlug }) => {
  const [qrcode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [qrColor, setQrColor] = useState("שחור עם רקע שקוף");

  useEffect(() => {
    const generateQR = async () => {
      if (qrSlug) {
        setIsLoading(true);
        const qrUrl = await generateQRCode(qrSlug, qrColor);
        setQrCode(qrUrl);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    generateQR();
  }, [qrSlug, qrColor]);

  const handleDownloadQr = (e) => {
    e.preventDefault();
    downloadQRCode(qrcode);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    shareQRCode({ qrcode });
  };

  const handleColorChange = (color) => {
    setQrColor(color);
  };

  if (!qrSlug) {
    return (
      <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <span className="material-icons-round text-5xl text-zinc-400 mb-4 opacity-50">qr_code_scanner</span>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-[200px]">
          לא נמצא קוד מזהה, נא לרענן או לפנות לתמיכה.
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col items-center justify-center text-center h-full w-full relative">
      <div className="w-full flex justify-center mb-6 z-10">
        <DefaultDropDown
          dropDownTitle="עיצוב ה-QR"
          dropDownItems={[
            "שחור עם רקע שקוף",
            "שחור עם רקע לבן",
            "לבן עם רקע שקוף",
            "לבן עם רקע כהה",
          ]}
          handelSelectedProp={handleColorChange}
        />
      </div>

      <div className="w-40 h-40 bg-zinc-50 dark:bg-white rounded-2xl p-3 shadow-inner border border-zinc-200 dark:border-zinc-300 mb-6 relative group flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : (
          <img alt="QR Code" className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" src={qrcode} />
        )}
      </div>
      
      <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">קוד ה-QR שלך</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-[220px]">
        הורד או שתף את קוד ה-QR כדי שלקוחות יוכלו לסרוק את התפריט.
      </p>
      
      <div className="flex gap-3 w-full max-w-[260px]">
        <button 
          onClick={handleShareClick}
          className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons-round text-lg">ios_share</span> שיתוף
        </button>
        <button 
          onClick={handleDownloadQr}
          className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-icons-round text-lg">download</span> הורדה
        </button>
      </div>
    </div>
  );
};

export default QrProfile;

QrProfile.propTypes = {
  qrSlug: PropTypes.string,
};
