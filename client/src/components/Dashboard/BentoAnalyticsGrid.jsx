import React from 'react';
import MenuViewsChart from '../Cards/MenuViewsChart';
import TopDishes from '../Cards/TopDishes';
import PeakActivityWidget from './PeakActivityWidget';
import AiInsightsWidget from '../Ai/AI Insights/AiInsightsWidget';

const BentoAnalyticsGrid = ({ user }) => {
  const userPlan = user?.plan || 'Essential';
  const isAdvance = userPlan === 'Advance' || userPlan === 'iMenu PRO';

  return (
    <div dir="rtl" className="w-full flex flex-col space-y-6">

      {/* ─── Row 1: Menu Views (8) + Popular Dishes by Views (4) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[500px]">

        {/* Views Chart — unlocked for all */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[420px]">
          <MenuViewsChart />
        </div>

        {/* Popular Dishes (by Views) — unlocked for all */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-[420px]">
          <TopDishes
            userId={user?._id}
            sortBy="views"
            title="מנות פופולריות"
            isTeaserMode={false}
          />
        </div>
      </div>

      {/* ─── Row 2: Most Loved Dishes (6) + Peak Activity (6) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[420px]">

        {/* Most Loved (by Likes) — teaser for Essential, full for Advance+ */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-[300px]">
          <TopDishes
            userId={user?._id}
            sortBy="likes"
            title="הכי אהובות"
            isTeaserMode={!isAdvance}
          />
        </div>

        {/* Peak Activity — unlocked for all */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-[300px]">
          <PeakActivityWidget />
        </div>
      </div>

      {/* ─── Row 3: AI Insights — iMenu PRO only ─── */}
    <div className="col-span-full lg:col-span-6 flex rounde">
  <AiInsightsWidget userPlan={userPlan} />
</div>

    </div>
  );
};

export default BentoAnalyticsGrid;
