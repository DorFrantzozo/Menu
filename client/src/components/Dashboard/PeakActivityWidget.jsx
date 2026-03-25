import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { usePeakActivity } from "@/hooks/usePeakActivity";
import { useSelector } from "react-redux";

// Maps JS getDay() (0=Sun) to the graph index (0=Sun…6=Sat) — same alignment.
const getTodayBarIndex = () => new Date().getDay();

const PeakActivityWidget = () => {
  const user = useSelector((state) => state.user.user);
  const { data, isLoading, error } = usePeakActivity(user?._id);
  const [viewMode, setViewMode] = useState("days"); // 'days' | 'hours'

  if (isLoading) {
    return (
      <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-full w-full animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full w-1/4"></div>
        </div>
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col items-center justify-center h-full w-full min-h-[300px]">
        <span className="material-icons-round text-red-400 text-4xl mb-2">error_outline</span>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">שגיאה בטעינת הנתונים</p>
      </div>
    );
  }

  const chartData = viewMode === "days" ? data.daysData : data.hoursData;
  const maxVal = Math.max(...chartData.map(d => d.uv || 0), 1);
  const todayIndex = viewMode === "days" ? getTodayBarIndex() : -1; // No "today" for hours view

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-100 dark:border-zinc-700 text-sm" dir="rtl">
          <p className="font-semibold text-zinc-800 dark:text-white mb-1">{label}</p>
          <p className="text-amber-500 font-bold">
            {payload[0].value} <span className="text-zinc-500 font-normal">ממוצע צפיות וסריקות</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom bar shape that adds a blue border + dot for Today's bar
  const CustomBar = (props) => {
    const { x, y, width, height, index, fill } = props;
    const isToday = index === todayIndex;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={4}
          ry={4}
          stroke={isToday ? "#3b82f6" : "none"}
          strokeWidth={isToday ? 2 : 0}
        />
        {isToday && (
          <circle
            cx={x + width / 2}
            cy={y - 8}
            r={4}
            fill="#3b82f6"
          />
        )}
      </g>
    );
  };

  return (
    <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-full w-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-800 dark:text-white flex items-center gap-2">
            שעות וימי עומס
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            ממוצע יומי · 30 הימים האחרונים
          </p>
        </div>

        {/* Legend */}
        {viewMode === "days" && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 ml-4">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>שיא
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>היום
            </span>
          </div>
        )}

        {/* Toggle */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1">
          <button
            onClick={() => setViewMode("days")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              viewMode === "days"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            לפי ימים
          </button>
          <button
            onClick={() => setViewMode("hours")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              viewMode === "hours"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            לפי שעות
          </button>
        </div>
      </div>

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              dy={10}
              interval={viewMode === 'hours' ? 3 : 0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar
              dataKey="uv"
              shape={<CustomBar />}
              barSize={viewMode === 'days' ? 24 : 8}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => {
                const isPeak = entry.uv === maxVal && maxVal > 0;
                const isToday = index === todayIndex;
                // Priority: today with blue tint, peak with amber, default pale
                let fill;
                if (isPeak && isToday) {
                  fill = '#f59e0b'; // Both peak AND today → amber wins for the fill
                } else if (isPeak) {
                  fill = '#f59e0b'; // amber-500
                } else if (isToday) {
                  fill = '#bfdbfe'; // blue-200 – soft tint, border does the heavy lifting
                } else {
                  fill = '#fef3c7'; // amber-100 default
                }
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fill}
                    className={(!isPeak && !isToday) ? "dark:fill-amber-500/20" : ""}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeakActivityWidget;
