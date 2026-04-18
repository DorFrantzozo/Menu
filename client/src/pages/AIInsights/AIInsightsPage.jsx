import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@/context/ThemeContext';
import PremiumGuard from '@/components/Guards/PremiumGuard';
import { fetchActiveInsights, dismissInsight } from '@/services/insightsApi';

import InsightsHeader from './components/InsightsHeader';
import ActionableInsights from './components/ActionableInsights';
import MenuStrategyMatrix from './components/MenuStrategyMatrix';
import MarketingLab from './components/MarketingLab';
import FutureTrends from './components/FutureTrends';

// ---- Page-level skeleton ----
const PageSkeleton = () => (
  <div className="space-y-6 animate-pulse" dir="rtl">
    <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60" />
    <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700/50 rounded-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5" />
      <div className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5" />
    </div>
  </div>
);

// ---- Inner content ----
const AIInsightsContent = ({ user }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadInsights = async () => {
      try {
        const data = await fetchActiveInsights();
        if (!cancelled) setInsights(data);
      } catch (err) {
        console.error('Failed to load AI insights:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadInsights();
    return () => { cancelled = true; };
  }, []);

  const handleDismiss = async (id) => {
    setInsights(prev => prev.filter(i => i._id !== id));
    try {
      await dismissInsight(id);
    } catch (err) {
      console.error('Failed to dismiss insight:', err);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <InsightsHeader insights={insights} loading={loading} />

      {loading ? <PageSkeleton /> : (
        <>
          <ActionableInsights insights={insights} loading={loading} onDismiss={handleDismiss} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MenuStrategyMatrix />
            <MarketingLab />
          </div>

          <FutureTrends />
        </>
      )}
    </div>
  );
};

// ---- Main Page ----
const AIInsightsPage = () => {
  const user = useSelector(state => state.user.user);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div
      className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200"
      dir="rtl"
    >
      {/* Sticky header */}
      <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-200 dark:border-white/8 shrink-0">
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-purple-500 dark:text-purple-400 text-2xl">auto_awesome</span>
            <h1 className="text-xl font-black text-zinc-900 dark:text-white">מרכז תובנות AI</h1>
            <span className="text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              Premium
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 mr-8">
            ניתוח ביצועי התפריט • המלצות עסקיות • תחזיות מבוססות AI
          </p>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <span className="material-icons-round text-purple-500 dark:text-purple-400">auto_awesome</span>
          <h1 className="text-base font-black text-zinc-900 dark:text-white">תובנות AI</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/8 hover:text-zinc-800 dark:hover:text-white transition-colors"
            title="החלפת ערכת צבעים"
          >
            <span className="material-icons-round text-xl">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">AI מחובר</span>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative min-h-full">
          {/* Ambient background blobs */}
          <div className="pointer-events-none fixed top-20 right-1/4 w-96 h-96 bg-purple-400/5 dark:bg-purple-700/8 rounded-full blur-3xl" />
          <div className="pointer-events-none fixed bottom-20 left-1/4 w-80 h-80 bg-indigo-400/5 dark:bg-indigo-700/8 rounded-full blur-3xl" />

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
