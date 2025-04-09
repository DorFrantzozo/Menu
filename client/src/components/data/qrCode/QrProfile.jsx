import {
  downloadQRCode,
  generateQRCode,
  shareQRCode,
} from "@/utils/qrGenerator";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { ShareIcon } from "lucide-react";
import DefaultDropDown from "../DefaultDropDown";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import PropTypes from "prop-types";

const QrProfile = ({ userName }) => {
  const [qrcode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [qrColor, setQrColor] = useState("שחור עם רקע שקוף");

  useEffect(() => {
    const generateQR = async () => {
      if (userName) {
        setIsLoading(true);
        console.log("צבע נבחר:", qrColor); // בדיקה האם הצבע מתעדכן
        const qrUrl = await generateQRCode(userName, qrColor);
        setQrCode(qrUrl);
        setIsLoading(false);
      }
    };
    generateQR();
  }, [userName, qrColor]); // תלות בשם המשתמש ובצבע שנבחר

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
          dropDownTitle="QR סוג"
          dropDownItems={[
            "שחור עם רקע שקוף",
            "שחור עם רקע לבן",
            "לבן עם רקע שקוף",
            "לבן עם רקע כהה",
          ]}
          handelSelectedProp={handleColorChange}
        />
      </div>

      <div className="flex justify-center">
        <img src={qrcode} alt="QR Code" />
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
          onClick={handleShareClick}
        >
          שתף QR{" "}
          <span className="ms-4">
            <ShareIcon />
          </span>
        </button>
      </div>
    </>
  );
};

export default QrProfile;

QrProfile.propTypes = {
  userName: PropTypes.string,
};
