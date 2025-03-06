import QrIcon from "./icons/QrIcon";
import PencilIcon from "./icons/PencilIcon";
import UploadIcon from "./icons/UploadIcon";
import ClockIcon from "./icons/ClockIcon";
import DefaultCard from "./Cards/DefaultCard";
import ThumbUpIcon from "./icons/ThumbUpIcon";
import SensitivityIcon from "./icons/SensitivityIcon";
import systemDemo from "../assets/img/system-demo-landing.png";
import TiltedCard from "./TextAnimations/TiltedCard";
const LandingPros = () => {
  return (
    <>
      <div className="flex justify-center " dir="rtl">
        <DefaultCard
          icon={PencilIcon}
          text="  או עיצוב מותאם אישית"
          title="בחירה ממגון עיצובים"
        />
        <DefaultCard
          icon={ThumbUpIcon}
          text="   תפעול עצמאי פשוט וקל  "
          title=" קל לשימוש  "
        />
        <DefaultCard
          icon={UploadIcon}
          text=" המגדילות את המכירות "
          title="העלאת תמונות"
        />
      </div>
      <div className="flex justify-center mb-20 " dir="rtl">
        <DefaultCard
          icon={ClockIcon}
          text="   עדכון התפריט באותו הרגע"
          title=" עדכונים בזמן אמת  "
        />
        <DefaultCard
          icon={QrIcon}
          text="המוביל לאתר שלך בו יוצג התפריט"
          title="קבלת קוד QR אוטומטי"
        />
        <DefaultCard
          icon={SensitivityIcon}
          text="   אופציה לסימון מנה עם סימון מתאים  "
          title=" אייקונים לרגישויות  "
        />
      </div>
      <div className="p-10 mb-60">
        <h1 className="text-3xl text-center ">
          נסו עכשיו 14 ימי התנסות ללא עלות
        </h1>
        <div className="flex justify-center">
          <TiltedCard
            className=""
            imageSrc={systemDemo}
            imageWidth="800px"
            imageHeight="auto"
          />
        </div>
      </div>
    </>
  );
};

export default LandingPros;
