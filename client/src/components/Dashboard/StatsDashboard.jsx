import React from 'react';
import TopDishes from '@/components/Cards/TopDishes';
import MenuViewsChart from '@/components/Cards/MenuViewsChart';

const StatsDashboard = ({ userId }) => {
  return (
    <div dir="rtl" className="w-full flex-1 flex flex-col h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 h-full">
        {/* Right Column (Chart) - spans 2 columns on large screens */}
        <div className="lg:col-span-2 h-full flex flex-col min-h-[300px]">
          <MenuViewsChart />
        </div>

        {/* Left Column (Leaderboard) - 1 column */}
        <div className="h-full flex flex-col min-h-[300px]">
          <TopDishes userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
