import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useTheme} from "@/context/ThemeContext";
import {motion, AnimatePresence} from "framer-motion";
import PremiumGuard from "@/components/Guards/PremiumGuard";
import {
  fetchActiveInsights,
  dismissInsight,
  finishedInsight,
} from "@/services/insightsApi";

import InsightsHeader from "./InsightsHeader";
import ActionableInsights from "./ActionableInsights";
import MenuStrategyMatrix from "./MenuStrategyMatrix";
import MarketingLab from "./MarketingLab";
import FutureTrends from "./FutureTrends";
import MarketingLabView from "@/components/MarketingLab/MarketingLabView";

// ---- הגדרות אנימציה (Variants) ----
const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // יצירת אפקט "מפל" בין האלמנטים
    },
  },
};

const itemVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, ease: "easeOut"},
  },
};

// ---- Page-level skeleton ----
const PageSkeleton = () => (
  <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    className="space-y-6"
    dir="rtl"
  >
    <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
    <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700/50 rounded-full animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-44 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5 animate-pulse"
        />
      ))}
    </div>
  </motion.div>
);

// ---- Inner content ----
const AIInsightsContent = ({user}) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadInsights = async () => {
      try {
        const data = await fetchActiveInsights();
        if (!cancelled) setInsights(data);
      } catch (err) {
        console.error("Failed to load AI insights:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDismiss = async (id) => {
    setInsights((prev) => prev.filter((i) => i._id !== id));
    try {
      await dismissInsight(id);
    } catch (err) {
      console.error("Failed to dismiss insight:", err);
    }
  };

  const handleFinishedInsight = async (id) => {
    setInsights((prev) => prev.filter((i) => i._id !== id));
    try {
      await finishedInsight(id);
    } catch (err) {
      console.error("Failed to finish insight:", err);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <InsightsHeader insights={insights} loading={loading} />

      <AnimatePresence mode="wait">
        {loading ? (
          <PageSkeleton key="skeleton" />
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <ActionableInsights
                insights={insights}
                loading={loading}
                onDismiss={handleDismiss}
                onFinished={handleFinishedInsight}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <MenuStrategyMatrix />
              <MarketingLabView />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FutureTrends />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---- Main Page ----
const AIInsightsPage = () => {
  const user = useSelector((state) => state.user.user);
  const {isDarkMode, toggleDarkMode} = useTheme();

  return (
    <div
      className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500"
      dir="rtl"
    >
      {/* Sticky header */}
      <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-200 dark:border-white/8 shrink-0">
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{rotate: [0, 15, -15, 0]}}
              transition={{repeat: Infinity, duration: 4, ease: "linear"}}
              className="material-icons-round text-purple-500 dark:text-purple-400 text-2xl"
            >
              auto_awesome
            </motion.span>
            <h1 className="text-xl font-black text-zinc-900 dark:text-white">
              מרכז תובנות AI
            </h1>
            <motion.span
              whileHover={{scale: 1.05}}
              className="text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm"
            >
              PRO
            </motion.span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-100 mt-0.5 mr-8">
            ניתוח ביצועי התפריט • המלצות עסקיות • תחזיות מבוססות AI
          </p>
        </div>

        {/* Mobile Header Title */}
        <div className="flex lg:hidden items-center gap-2">
          <span className="material-icons-round text-purple-500 dark:text-purple-400">
            auto_awesome
          </span>
          <h1 className="text-base font-black text-zinc-900 dark:text-white">
            תובנות AI
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.9}}
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/8 transition-colors"
          >
            <span className="material-icons-round text-xl">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </motion.button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              AI מחובר
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative min-h-full">
          {/* Ambient background blobs - הוספנו תנועה עדינה לרקע */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{duration: 8, repeat: Infinity}}
            className="pointer-events-none fixed top-20 right-1/4 w-96 h-96 bg-purple-400/5 dark:bg-purple-700/8 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{duration: 10, repeat: Infinity}}
            className="pointer-events-none fixed bottom-20 left-1/4 w-80 h-80 bg-indigo-400/5 dark:bg-indigo-700/8 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
            <PremiumGuard requiredPlan="iMenu PRO" currentPlan={user?.plan}>
              <AIInsightsContent user={user} />
            </PremiumGuard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIInsightsPage;
