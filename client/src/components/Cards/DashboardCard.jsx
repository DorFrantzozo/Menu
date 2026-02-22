import React from 'react';

const DashboardCard = ({ 
  value, 
  name, 
  iconName, 
  iconColorClass, 
  bgIconColorClass, 
  bgIconName,
  badge,
  subtext
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col justify-between h-32 relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-md group">
      <div className="flex justify-between items-start z-10 relative">
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {value}
            </h3>
            {badge && badge}
          </div>
        </div>
        
        {/* Top left small icon container (RTL flipped) */}
        <div className={`${bgIconColorClass} p-2 rounded-lg ${iconColorClass}`}>
          <span className="material-icons-round">{iconName}</span>
        </div>
      </div>

      {subtext && (
        <div className="flex items-center text-xs text-zinc-400 font-medium z-10 relative text-right">
          {subtext}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
