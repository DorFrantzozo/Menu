import React from 'react';
import TopDishes from '@/components/Cards/TopDishes';
import MenuViewsChart from '@/components/Cards/MenuViewsChart';

const StatsDashboard = ({ userId }) => {
  return (
    <div className="w-full space-y-6">
   

      {/* Main Content Area: Chart + Leaderboard */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left Column (Chart) - 40% */}
        <div className="w-full h-full">
          <MenuViewsChart />
        </div>

        {/* Right Column (Leaderboard) - 60% */}
        <div className="w-full h-full">
          <TopDishes userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
