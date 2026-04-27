import React, {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Sparkles} from "lucide-react";

const loadingPhrases = [
  "מנתח טרנדים קולינריים...",
  "מזקק קופירייטינג ממיר...",
  "מרכיב הוראות צילום...",
  "מלטש את התוצאה הסופית...",
];

export default function GenerateButton({
  onClick,
  isGenerating,
  disabled,
  activePlatformName,
}) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2000);
    } else {
      setTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className="w-full relative overflow-hidden bg-gradient-to-r from-[#ff0066] to-[#cc00ff] text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(255,0,102,0.15)] hover:shadow-[0_0_30px_rgba(255,0,102,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
    >
      {isGenerating ? (
        <AnimatePresence mode="wait">
          <motion.span
            key={textIndex}
            initial={{opacity: 0, y: 5}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -5}}
            className="font-medium"
          >
            {loadingPhrases[textIndex]}
          </motion.span>
        </AnimatePresence>
      ) : (
        <>
          צור פוסט
          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </>
      )}
    </button>
  );
}
