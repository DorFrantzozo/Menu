import React, { useState, useEffect } from "react";
import AiGlowIcon from "./AiGlowIcon";

const messages = [
  "מפענח תפריט",
  "סורק מנות",
  "סורק מחירים",
  "מזהה קטגוריות",
  "מנתח תיאורים",
  "מארגן נתונים"
];

const ScanLoading = ({ retryAttempt }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Slowed down to 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6" dir="rtl">
      {/* Advanced Organic AI Glow Animation */}
      <div className="mb-10">
        <AiGlowIcon />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        ה-AI שלנו בעבודה
      </h3>
      {retryAttempt && retryAttempt > 1 ? (
        <p className="text-amber-600 dark:text-amber-500 font-semibold text-center max-w-sm mb-12 animate-pulse">
          השרת עמוס, מנסה שוב... (ניסיון {retryAttempt} מתוך 3)
        </p>
      ) : (
        <p className="text-gray-500 dark:text-zinc-400 text-center max-w-sm mb-12">
          אנחנו מנתחים את התמונה שלך כדי לבנות תפריט דיגיטלי מושלם תוך שניות.
        </p>
      )}

      {/* Animated Text Sequence */}
      <div className="flex flex-col items-center justify-center min-h-[4rem]">
        <div className="flex items-center gap-3">
          <span 
            key={currentMessageIndex}
            className="text-xl font-medium text-blue-600 dark:text-blue-400 animate-in fade-in slide-in-from-bottom-2 duration-700"
          >
            {messages[currentMessageIndex]}
          </span>

          {/* Dynamic Dots moved to the left side of text (right side in RTL context) */}
          <div className="flex items-center gap-1.5 h-full pt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        <div className="w-56 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-progress-indeterminate shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
        </div>
      </div>
    </div>
  );
};

export default ScanLoading;
