import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getMenuStats } from '@/utils/fetchData';
import { useSelector } from 'react-redux';

/* ── Custom Tooltip ─────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-100 dark:border-zinc-700/60 min-w-[120px]">
      <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mb-1">{label}</p>
      <p className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
        {Math.round(payload[0].value)}{' '}
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">כניסות</span>
      </p>
    </div>
  );
};

/* ── Custom Active Dot ──────────────────────────────── */
const GlowDot = (props) => {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="rgba(34,197,94,0.18)" />
      <circle cx={cx} cy={cy} r={5} fill="#fff" stroke="#22c55e" strokeWidth={2.5} />
    </g>
  );
};

/* ── Main Component ─────────────────────────────────── */
const MenuViewsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [trend, setTrend] = useState(0);
  const user = useSelector((state) => state.user.user);

  const fetchData = useCallback(async () => {
    if (!user?._id) return;

    const stats = await getMenuStats(user._id, 30);

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }));
    }

    const merged = last30Days.map((dateStr) => {
      const found = stats.find((s) => s.date === dateStr);
      return { date: dateStr, views: found ? found.views : 0 };
    });

    setChartData(merged);

    // Compute totals & trend
    const total = merged.reduce((acc, d) => acc + d.views, 0);
    setTotalViews(total);

    const firstHalf = merged.slice(0, 15).reduce((a, d) => a + d.views, 0);
    const secondHalf = merged.slice(15).reduce((a, d) => a + d.views, 0);
    const pct = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : secondHalf > 0 ? 100 : 0;
    setTrend(pct);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      dir="rtl"
      className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-full w-full flex-1"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-zinc-800 dark:text-white">סה״כ כניסות לתפריט</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {totalViews.toLocaleString('he-IL')}
            </span>
            {trend !== 0 && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                  trend >= 0
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                <span className="material-icons-round text-sm">{trend >= 0 ? 'trending_up' : 'trending_down'}</span>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">30 ימים</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              {/* SVG Defs — gradient + glow filter */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#22c55e" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Grid — horizontal dashed only */}
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="6 4"
                stroke="rgba(161,161,170,0.12)"
              />

              {/* X-Axis */}
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                interval="preserveStartEnd"
                minTickGap={30}
                dy={10}
              />

              {/* Y-Axis — integers only */}
              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                width={35}
                dx={-5}
              />

              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: '#22c55e',
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                  strokeOpacity: 0.35,
                }}
              />

              {/* Area + Line */}
              <Area
                type="monotone"
                dataKey="views"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#areaGradient)"
                activeDot={<GlowDot />}
                dot={false}
                style={{ filter: 'url(#glowFilter)' }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MenuViewsChart;
