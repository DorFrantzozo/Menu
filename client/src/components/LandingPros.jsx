import QrIcon from "./icons/QrIcon";
import PencilIcon from "./icons/PencilIcon";
import UploadIcon from "./icons/UploadIcon";

const LandingPros = () => {
  return (
    <>
      <h1 dir="rtl" className="text-center mt-20 text-3xl">
        איך זה עובד ?
      </h1>
      <div className=" flex justify-around mt-20 mb-20 w-full ">
        <div className="flex items-center flex-col">
          <QrIcon className="w-16 h-20 ml-4 hover:scale-110 transition duration-500" />
          <h1 dir="rtl">מקבלים קוד QR שמוביל לאתר</h1>
        </div>
        <div className="flex items-center flex-col">
          <UploadIcon className="w-16 h-20 ml-4 hover:scale-110 transition duration-500" />
          <h1 dir="rtl">מעלים את המנות לאתר ובוחרים עיצוב</h1>
        </div>
        <div className="flex items-center flex-col">
          <PencilIcon className="w-16 h-20 ml-4 hover:scale-110 transition duration-500" />
          <h1 dir="rtl"> נרשמים עם פרטי המסעדה</h1>
        </div>
      </div>
    </>
  );
};

export default LandingPros;
