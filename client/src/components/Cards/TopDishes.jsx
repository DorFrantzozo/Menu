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
        setError('Failed to load top dishes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, period]);

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 1: return "bg-gray-100 text-gray-700 border-gray-200";
      case 2: return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-white text-gray-500 border-transparent";
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return index + 1;
    }
  };

  if (!userId) return null;

  return (
    <div dir="rtl" className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">מנות פופולריות</h2>
        <div className="relative">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            style={{ 
      WebkitAppearance: 'none', 
      MozAppearance: 'none', 
      appearance: 'none',
      backgroundImage: 'none' // למקרה שזה מגיע כתמונת רקע בדפדפן
    }}
            className="appearance-none  bg-gray-50 border border-gray-200 text-gray-700 py-2 pr-4 pl-[35px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-right"
          >
            <option value="week">השבוע</option>
            <option value="month">החודש</option>
            <option value="year">השנה</option>
            <option value="all">הכל</option>
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center p-12 flex-grow">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg flex-grow">{error}</div>
      ) : dishes.length === 0 ? (
        <div className="text-gray-400 text-center p-12 flex flex-col items-center flex-grow">
          <div className="text-4xl mb-3">🍽️</div>
          <p>אין נתונים להצגה בתקופה זו</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sticky List Header */}
          <div className="grid grid-cols-12 gap-4 text-gray-400 text-xs font-medium pb-2 border-b border-gray-100 mb-2 px-3 sticky top-0 bg-white z-10 flex-shrink-0">
            <div className="col-span-8 md:col-span-7">מנה</div>
            <div className="col-span-2 text-right">מחיר</div>
            <div className="col-span-2 md:col-span-3 text-center">צפיות</div>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto overflow-x-hidden custom-scrollbar flex-1 pr-1 space-y-2">
            {dishes.map((dish, index) => (
              <div 
                key={index} 
                className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-100 group"
              >
                {/* Rank & Info */}
                <div className="col-span-8 md:col-span-7 flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm border ${getRankStyle(index)}`}>
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="relative flex-shrink-0">
                    {dish.image ? (
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 ring-2 ring-white">
                        🍳
                      </div>
                    )}
                  </div>

                  <span className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                    {dish.name}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right text-gray-500 text-sm font-medium">
                  ₪{dish.price}
                </div>

                {/* Views */}
                <div className="col-span-2 md:col-span-3 flex justify-center">
                   <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    {dish.totalViews || 0}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopDishes;
