import React, {useState, useEffect} from "react";
import {Sparkles, Image as ImageIcon, Video as VideoIcon} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

// ייבוא הקומפוננטות שלנו
import PlatformSelector from "./PlatformSelector";
import PromptInput from "./PromptInput";
import LoadingSkeleton from "./LoadingSkeleton";
import ResultCard from "./ResultCard";
import GenerateButton from "./GenerateButton";

// ייבוא פונקציית התקשורת מהקובץ api שהגדרנו קודם
import {generateMarketingPost} from "../../utils/marketingApi";

export default function MarketingLabView() {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [format, setFormat] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [selectedDishContext, setSelectedDishContext] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // TikTok Constraint: Force video format for TikTok
  useEffect(() => {
    if (activePlatform === "tiktok") {
      setFormat("video");
    }
  }, [activePlatform]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setResult(null);

    try {
      // הקריאה האמיתית לשרת עם הטקסט והקונטקסט (במידה ויש)
      const payloadText = selectedDishContext
        ? `המנה: ${prompt}\n\nתיאור/רכיבים: ${selectedDishContext.description || "ללא תיאור"}\nמחיר: ${selectedDishContext.price ? "₪" + selectedDishContext.price : "לא צוין"}`
        : prompt;

      const response = await generateMarketingPost(
        activePlatform,
        format,
        payloadText,
      );
      setResult(response.data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // פונקציית עזר להוצאת שם הפלטפורמה עבור הטקסט בכפתור
  const getPlatformName = () => {
    const map = {
      instagram: "אינסטגרם",
      facebook: "פייסבוק",
      tiktok: "טיקטוק",
    };
    return map[activePlatform];
  };

  return (
    <div
      className="w-full max-w-4xl flex flex-col justify-center items-start text-white mx-auto"
      dir="rtl"
    >
      <div className="w-full bg-gradient-to-br from-[#231b2c] to-[#151218] rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-3">
              מעבדת שיווק AI
              <span className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full font-medium tracking-wider uppercase">
                BETA
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              יצירת תוכן שיווקי לרשתות החברתיות בקליק אחד
            </p>
          </div>
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-pink-500/20 items-center justify-center border border-pink-500/30">
            <Sparkles className="text-pink-400" />
          </div>
        </div>

        {/* Controls Row: Format Toggle & Platform Selector */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 w-full">
          {/* Format Toggle */}
          <div className="flex w-full lg:w-auto bg-[#1a1721] border border-white/10 rounded-xl p-1.5 shrink-0">
            <button
              onClick={() => setFormat("image")}
              disabled={activePlatform === "tiktok"}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                format === "image"
                  ? "bg-white/10 text-white shadow-sm border border-white/5"
                  : "text-gray-400 hover:text-gray-200 border border-transparent"
              } ${activePlatform === "tiktok" ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <ImageIcon className="w-4 h-4" />
              פוסט תמונה
            </button>
            <button
              onClick={() => setFormat("video")}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                format === "video"
                  ? "bg-white/10 text-white shadow-sm border border-white/5"
                  : "text-gray-400 hover:text-gray-200 border border-transparent"
              }`}
            >
              <VideoIcon className="w-4 h-4" />
              סרטון / Reel
            </button>
          </div>

          <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
            <PlatformSelector
              activePlatform={activePlatform}
              setActivePlatform={setActivePlatform}
            />
          </div>
        </div>

        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          disabled={isGenerating}
          selectedDishContext={selectedDishContext}
          setSelectedDishContext={setSelectedDishContext}
        />

        {/* Dynamic Area: Empty state / Skeleton / Result */}
        <div className="mb-6 min-h-[200px]">
          <AnimatePresence mode="wait">
            {!isGenerating && !result && (
              <motion.div
                key="empty"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="w-full h-full border border-white/5 bg-[#17141d] rounded-xl p-8 flex flex-col items-center justify-center opacity-50"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 mb-4 opacity-50"></div>
                <div className="h-4 w-1/3 bg-white/5 rounded-full mb-3"></div>
                <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
              </motion.div>
            )}

            {isGenerating && <LoadingSkeleton />}

            {result && !isGenerating && (
              <motion.div
                key="result"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                className="w-full border border-pink-500/20 bg-gradient-to-b from-[#1e1b24] to-[#17141d] rounded-xl p-6 shadow-[0_0_30px_rgba(255,0,102,0.05)]"
              >
                <ResultCard data={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {errorMsg && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        <GenerateButton
          onClick={handleGenerate}
          isGenerating={isGenerating}
          disabled={!prompt.trim()}
          activePlatformName={getPlatformName()}
        />
      </div>
    </div>
  );
}
