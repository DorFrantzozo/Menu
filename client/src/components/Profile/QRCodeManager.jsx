import { useState, useEffect } from "react";
import { 
  QrCodeIcon, 
  ArrowDownTrayIcon, 
  ShareIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { 
  downloadQRCode, 
  generateQRCode, 
  shareQRCode 
} from "@/utils/qrGenerator";
import Spinner from "@/components/Spinner";
import DefaultDropDown from "../data/DefaultDropDown";

const QRCodeManager = ({ qrSlug }) => {
  const [qrcode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [qrColor, setQrColor] = useState("שחור עם רקע שקוף");
  const [isZoomed, setIsZoomed] = useState(false);

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

  if (!qrSlug) return null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-gray-400" />
            קוד ה-QR שלך
          </h3>
          <DefaultDropDown
            dropDownTitle="עיצוב"
            dropDownItems={[
              "שחור עם רקע שקוף",
              "שחור עם רקע לבן",
              "לבן עם רקע שקוף",
              "לבן עם רקע כהה",
            ]}
            handelSelectedProp={(color) => setQrColor(color)}
          />
        </div>

        <div 
          onClick={() => setIsZoomed(true)}
          className="relative group cursor-zoom-in mb-4 p-3 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 transition-all hover:border-emerald-200 hover:bg-emerald-50/10"
        >
          {isLoading ? (
            <div className="w-32 h-32 flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <img 
              src={qrcode} 
              alt="QR Code" 
              className="w-32 h-32 transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md">
              <MagnifyingGlassPlusIcon className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center mb-4 max-w-[180px]">
          לקוחות יכולים לסרוק את הקוד כדי לצפות בתפריט הדיגיטלי שלך
        </p>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleDownloadQr}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-emerald-100"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            הורדת קוד QR
          </button>
          <button
            onClick={handleShareClick}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold border border-gray-100"
          >
            <ShareIcon className="w-4 h-4" />
            שיתוף עם לקוחות
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
            <img 
              src={qrcode} 
              alt="QR Code Zoom" 
              className="w-64 h-64 mb-6 shadow-sm"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-2">סרוק אותי!</h4>
            <p className="text-sm text-gray-500 text-center">הצג את הקוד ללקוחות שלך ישירות מהמסך</p>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeManager;
