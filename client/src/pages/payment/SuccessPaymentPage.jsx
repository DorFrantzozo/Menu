import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // כאן אפשר להוסיף קריאה ל-API שלך כדי לרענן את נתוני המשתמש
    // או פשוט להמתין 5 שניות ולהעביר אותו לדאשבורד
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          התשלום עבר בהצלחה!
        </h1>
        <p className="text-gray-600 mb-6">
          איזה כיף, עכשיו אתם חלק ממשפחת **iMenu Premium**. כל האפשרויות פתוחות
          בפניכם.
        </p>

        <div className="animate-pulse text-sm text-blue-500 font-medium">
          מעביר אתכם לדאשבורד בעוד מספר שניות...
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          חזרה לניהול התפריט
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
