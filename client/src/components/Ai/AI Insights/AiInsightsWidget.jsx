import React, { useState, useEffect } from 'react';
import PremiumGuard from "../../Guards/PremiumGuard"
import { fetchActiveInsights, dismissInsight } from '../../../services/insightsApi';
import InsightCard from '../../Cards/InsightCard';
import InsightsSkeleton from './InsightsSkeleton';

const AiInsightsWidget = ({ userPlan }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await fetchActiveInsights();
        setInsights(data);
      } catch (error) {
        console.error("Failed to load insights", error);
      } finally {
        setLoading(false);
      }
    };

    if (userPlan === "iMenu PRO") {
      loadInsights();
    } else {
      setLoading(false);
    }
  }, [userPlan]);

  const handleDismiss = async (id) => {
    setInsights((prev) => prev.filter((insight) => insight._id !== id));
    try {
      await dismissInsight(id);
    } catch (error) {
      console.error("Failed to dismiss insight", error);
    }
  };

  const displayInsights = insights.slice(0, 3);

  return (
    <div className="animated-glow-border-purple relative h-full w-full rounded-2xl flex flex-col overflow-visible">
      <div className="frosted-glass-card relative flex-1 flex flex-col h-full w-full rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/90 z-10" style={{ isolation: 'isolate' }}>
        
        <PremiumGuard requiredPlan="iMenu PRO" currentPlan={userPlan}>
          <div className="p-8 h-full flex flex-col w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/20 shadow-inner">
                  <span className="material-icons-round text-purple-600 dark:text-purple-400 text-lg">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">המלצות בינה מלאכותית</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">מבוסס על ניתוח התפריט היומי שלך</p>
                </div>
              </div>
              
              {insights.length > 3 && (
                <button className="text-sm font-semibold text-zinc-500 hover:text-purple-500 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors flex items-center gap-1">
                  צפה בהכל ({insights.length}) <span className="material-icons-round text-[16px]">arrow_back</span>
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {loading ? (
                <InsightsSkeleton />
              ) : insights.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 pt-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <span className="material-icons-round text-3xl text-emerald-500">task_alt</span>
                  </div>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">התפריט שלך עבר אופטימיזציה מושלמת!</p>
                  <p className="text-xs mt-1">המערכת תמשיך לנטר את הביצועים ברקע.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
                  {displayInsights.map((insight) => (
                    <InsightCard 
                      key={insight._id} 
                      insight={insight} 
                      onDismiss={handleDismiss} 
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </PremiumGuard>
      </div>
    </div>
  );
};

export default AiInsightsWidget;