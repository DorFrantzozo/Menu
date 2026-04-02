import React, {useState, useEffect} from "react";
import Joyride, {STATUS} from "react-joyride";
import Lottie from "lottie-react";
import axiosInstance from "../../utils/baseUrl";

// Animations
import helloAnim from "../../assets/animations/Hello.json";
import typingAnim from "../../assets/animations/Typing Animation.json";
import paintAnim from "../../assets/animations/Paint Brush.json";
import qrAnim from "../../assets/animations/QR Code Scanner.json";

const OnboardingTour = ({user, onStatusChange}) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (user && !user.hasCompletedTour) {
      setRun(true);
    }
  }, [user]);

  const steps = [
    {
      target: "body",
      placement: "center",
      disableBeacon: true,
      title: (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">ברוכים הבאים ל-MenuYou! 👋</span>
        </div>
      ),
      content: (
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 max-h-[160px]">
            <Lottie
              animationData={helloAnim}
              loop={true}
              style={{height: "100%"}}
            />
          </div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">
            מערכת בגרסת ניסיון ל-14 יום מלאים. בוא נקים את התפריט הדיגיטלי שלך
            בתוך 5 דקות בלבד.
          </p>
        </div>
      ),
    },
    {
      target: '[data-tour="categories"]',
      disableBeacon: true,
      disableScrolling: true,
      title: <span className="text-lg font-bold">הכל מתחיל בקטגוריה 📂</span>,
      content: (
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 max-h-[140px]">
            <Lottie
              animationData={typingAnim}
              loop={true}
              style={{height: "100%"}}
            />
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            כאן יוצרים את הסדר של התפריט. חלק את המנות שלך לקבוצות כמו
            "עיקריות", "קינוחים" או "שתייה".
          </p>
        </div>
      ),
    },
    {
      target: '[data-tour="dishes"]',
      disableBeacon: true,
      disableScrolling: true,
      title: <span className="text-lg font-bold">עכשיו מוסיפים מנות! 🍕</span>,
      content: (
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 max-h-[140px]">
            <Lottie
              animationData={typingAnim}
              loop={true}
              style={{height: "100%"}}
            />
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            לחץ כאן כדי להכניס את המנות המנצחות שלך. לכל מנה תוכל להוסיף תמונה,
            תיאור ומחיר.
          </p>
        </div>
      ),
    },
    {
      target: '[data-tour="design"]',
      disableBeacon: true,
      disableScrolling: true,
      title: (
        <span className="text-lg font-bold">
          התפריט שלך צריך להיראות מדהים ✨
        </span>
      ),
      content: (
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 max-h-[140px]">
            <Lottie
              animationData={paintAnim}
              loop={true}
              style={{height: "100%"}}
            />
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            בחר את העיצוב (Layout) שתפור על המסעדה שלך. תוכל לשנות אותו בכל רגע.
          </p>
        </div>
      ),
    },
    {
      target: '[data-tour="stats"]',
      disableBeacon: false,
      disableScrolling: true, // קריטי למניעת מתיחת העמוד
      title: <span className="text-lg font-bold">זהו, אתה באוויר! 🚀</span>,
      content: (
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 max-h-[140px]">
            <Lottie
              animationData={qrAnim}
              loop={true}
              style={{height: "100%"}}
            />
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            כאן מורידים את קוד ה-QR להדפסה לשולחנות ועוקבים אחרי כמות הסריקות
            בזמן אמת.
          </p>
        </div>
      ),
    },
  ];

  const handleJoyrideCallback = async (data) => {
    const {status} = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.patch(
          "/user/complete-tour",
          {userId: user._id},
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        if (onStatusChange) {
          onStatusChange({...user, hasCompletedTour: true});
        }
      } catch (error) {
        console.error("Failed to complete tour:", error);
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      disableScrolling={true} // מונע גלילה מיותרת בכל הצעדים
      disableScrollParentFix={true} // התיקון העיקרי לעיוות הקומפוננטות בשלב האחרון
      callback={handleJoyrideCallback}
      floaterProps={{
        disableAnimation: true, // יציבות מקסימלית לבועה
      }}
      locale={{
        back: "אחורה",
        close: "סגור",
        last: "סיום",
        next: "הבא",
        skip: "דילוג",
      }}
      styles={{
        options: {
          primaryColor: "#059669",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "1.5rem",
          padding: "20px",
          maxWidth: "350px", // מונע מהבועה להימרח לרוחב
        },
        tooltipContainer: {
          textAlign: "right",
          direction: "rtl",
        },
        buttonNext: {
          borderRadius: "0.75rem",
          padding: "10px 20px",
          fontWeight: "bold",
        },
        buttonBack: {
          marginRight: "10px",
          color: "#6b7280",
        },
        buttonSkip: {
          color: "#9ca3af",
        },
        spotlight: {
          borderRadius: "1rem", // הופך את אזור המיקוד למעוגל ונעים
        },
      }}
    />
  );
};

export default OnboardingTour;
