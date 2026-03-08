import React, { useEffect, useState } from 'react';
import { getTopDishes } from '@/utils/fetchData';
import Spinner from '@/components/Spinner';

const TopDishes = ({ userId }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const data = await getTopDishes(userId, period);
        setDishes(data);
        setError(null);
      } catch (err) {
        setError('שגיאה בטעינת המנות הפופולריות');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, period]);

  const getRankBadgeColor = (index) => {
    switch(index) {
      case 0: return "bg-yellow-400 text-white"; // 1st
      case 1: return "bg-zinc-400 text-white"; // 2nd
      case 2: return "bg-orange-700/50 text-white"; // 3rd
      default: return "bg-zinc-300 text-zinc-600"; // others
    }
  };

  const getProgressColor = (index) => {
    switch(index) {
      case 0: return "bg-green-500";
      case 1: return "bg-blue-500";
      case 2: return "bg-orange-500";
      default: return "bg-purple-500";
    }
  };

  // Calculate generic percentage for the bar based on the largest item
  const maxViews = dishes.length > 0 ? Math.max(...dishes.map(d => d.totalViews || 0)) : 1;

  if (!userId) return null;

  return (
    <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-full w-full flex-1">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white">מנות פופולריות</h2>
        <div className="relative">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', background: 'none' }}
            className="appearance-none bg-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-1.5 pr-3 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
          >
            <option value="week">השבוע</option>
            <option value="month">החודש</option>
            <option value="year">השנה</option>
            <option value="all">הכל</option>
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none text-zinc-400">
            <span className="material-icons-round text-sm">expand_more</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1 min-h-[100px]">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg flex-1 min-h-[100px] flex items-center justify-center">
          {error}
        </div>
      ) : dishes.length === 0 ? (
        <div className="text-zinc-400 dark:text-zinc-500 text-center flex-1 flex flex-col items-center justify-center min-h-[100px]">
          <span className="material-icons-round text-5xl mb-2 opacity-50">restaurant_menu</span>
          <p>אין נתונים להצגה בתקופה זו</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pl-2 min-h-0 max-h-[370px] lg:max-h-none custom-scrollbar relative">
          {dishes.map((dish, index) => {
            const views = dish.totalViews || 0;
            const percentage = maxViews > 0 ? (views / maxViews) * 100 : 0;
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700/50"
              >
                <div className="relative w-12 h-12 shrink-0">
                  {dish.image ? (
                    <img 
                      alt={dish.name} 
                      className="w-full h-full object-cover rounded-lg" 
                      src={dish.image} 
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">
                      <span className="material-icons-round">fastfood</span>
                    </div>
                  )}
                  <div className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${getRankBadgeColor(index)}`}>
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-white truncate">
                    {dish.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {views} צפיות
                    </span>
                    <div className="h-1 w-16 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(index)}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  ₪{dish.price}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopDishes;
