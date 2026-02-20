import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getMenuStats } from '@/utils/fetchData'; // Verify path
import { useSelector } from 'react-redux';

const MenuViewsChart = () => {
  const [data, setData] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      const stats = await getMenuStats(user._id, 30);
      
      // Generate last 30 days
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last30Days.push(d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }));
      }

      // Merge data
      // API returns [{ date: "DD/MM", views: 5 }, ...]
      // We need to map last30Days to this, defaulting to 0
      const mergedData = last30Days.map(dateStr => {
        const found = stats.find(s => s.date === dateStr);
        return {
          date: dateStr,
          views: found ? found.views : 0
        };
      });

      setData(mergedData);
    };

    fetchData();
  }, [user]);

  return (
    <div dir="rtl" className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">סה״כ כניסות לתפריט</h2>
      </div>
      
      <div className="flex-grow w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorViews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MenuViewsChart;
