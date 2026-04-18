import { PlusCircleIcon } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuScannerModal from "../Ai/AI-Scanner/MenuScannerModal";

const AddDataToStart = () => {
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4" dir="rtl">
        נראה שעדיין לא שיתפת מידע...
      </h1>
      <p className="text-gray-500 dark:text-zinc-400 mb-10 text-center" dir="rtl">
        בחר איך תרצה להתחיל לבנות את התפריט שלך
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-4xl px-4" dir="rtl">
        
        {/* Card A: Manual Setup */}
        <div className="flex-1 bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gray-50 dark:bg-zinc-700/50 rounded-full flex items-center justify-center mb-6">
            <PlusCircleIcon className="h-8 w-8 text-gray-400 dark:text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">הקמה ידנית</h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mb-8 flex-grow">
            הוסף קטגוריות ומנות אחד אחד בצורה מסורתית. מתאים לתפריטים קטנים או עדכונים נקודתיים.
          </p>
          <button
            onClick={() => navigate("/manage-categories")}
            className="w-full py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
          >
            הוסף קטגוריה
          </button>
        </div>

        {/* Card B: AI Smart Scan */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 shadow-sm border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl"></div>
          
          <div className="relative h-16 w-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-50 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
            <SparklesIcon className="h-8 w-8 text-blue-500" />
          </div>
          
          <h2 className="relative text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            סריקה חכמה <span className="text-blue-500 animate-pulse">✨</span>
          </h2>
          <p className="relative text-gray-500 dark:text-zinc-400 text-sm mb-8 flex-grow">
            העלה תמונה של התפריט שלך והבינה המלאכותית שלנו תייצר עבורך באופן אוטומטי את הקטגוריות והמנות!
          </p>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="relative w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            התחל סריקה
          </button>
        </div>

      </div>

      <MenuScannerModal open={isScannerOpen} setOpen={setIsScannerOpen} />
    </div>
  );
};

export default AddDataToStart;
