import {useCallback} from "react";
import PropTypes from "prop-types";
import {Area, AreaChart, ResponsiveContainer, Tooltip} from "recharts";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getReviewStats} from "@/utils/fetchData";
import {useCachedFetch} from "@/hooks/useCachedFetch";

/* ── Sparkline tooltip ──────────────────────────────── */
const SparkTooltip = ({active, payload, label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-100 dark:border-zinc-700/60">
      <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mb-0.5">
        {label}
      </p>
      <p className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
        {payload[0].value}{" "}
        <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
          מעברים
        </span>
      </p>
    </div>
  );
};

/* ── One figure in the funnel ───────────────────────── */
const Figure = ({label, value, suffix, trend, hint}) => (
  <div className="flex-1 min-w-[104px]">
    <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mb-1">
      {label}
    </p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
        {value}
        {suffix}
      </span>
      {trend != null && trend !== 0 && (
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
            trend >= 0
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          <span className="material-icons-round text-sm">
            {trend >= 0 ? "trending_up" : "trending_down"}
          </span>
          {trend >= 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
    {hint && (
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{hint}</p>
    )}
  </div>
);

/* ── Main Component ─────────────────────────────────── */
const ReviewFunnelCard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const isPro = user?.plan === "iMenu PRO";
  const isConfigured =
    user?.reviewSettings?.isEnabled &&
    user?.reviewSettings?.urlStatus === "valid";

  const fetchAndFormat = useCallback(async () => {
    if (!user?._id) return null;

    const response = await getReviewStats(user._id, 30);
    const stats = response?.formattedStats || [];

    // Fill the missing days so the sparkline spans a full month rather than
    // only the days that happened to record an event.
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(
        d.toLocaleDateString("he-IL", {day: "2-digit", month: "2-digit"}),
      );
    }
    const chartData = last30Days.map((date) => {
      const found = stats.find((s) => s.date === date);
      return {date, clicks: found ? found.clicks : 0};
    });

    // Second fortnight against the first, matching MenuViewsChart.
    const firstHalf = chartData
      .slice(0, 15)
      .reduce((acc, d) => acc + d.clicks, 0);
    const secondHalf = chartData
      .slice(15)
      .reduce((acc, d) => acc + d.clicks, 0);
    const trend =
      firstHalf > 0
        ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
        : secondHalf > 0
          ? 100
          : 0;

    return {
      chartData,
      totals: response?.totals || {shown: 0, clicks: 0, clickRate: 0},
      totalClicksAllTime: response?.totalClicksAllTime || 0,
      trend,
    };
  }, [user?._id]);

  const {data} = useCachedFetch(
    user?._id && isPro ? `review_stats_${user._id}_30` : null,
    fetchAndFormat,
    [user?._id, isPro],
  );

  // The prompt is an iMenu PRO feature, so there is nothing to report below it.
  if (!isPro) return null;

  const totals = data?.totals || {shown: 0, clicks: 0, clickRate: 0};
  const chartData = data?.chartData || [];

  return (
    <div
      dir="rtl"
      className="frosted-glass-card p-6 lg:p-8 rounded-2xl w-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
            <span className="material-icons-round text-lg text-amber-500">
              star
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-white leading-tight">
              ביקורות Google
            </h2>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              סועדים שהגיעו מהתפריט שלכם
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
            30 ימים
          </span>
        </div>
      </div>

      {!isConfigured ? (
        /* Live but unconfigured would read as "nobody reviews us", which is a
           very different message from "this is switched off". */
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            בקשת הביקורת עדיין לא פעילה. הוסיפו קישור לביקורות בפרופיל
            <br className="hidden sm:block" />
            כדי להתחיל לאסוף ביקורות מהסועדים.
          </p>
          <button
            onClick={() => navigate("/profile/edit")}
            className="shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            הגדרת הקישור
            <span className="material-icons-round text-base">chevron_left</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Sparkline */}
          <div className="w-full lg:w-[240px] h-[72px] shrink-0 order-2 lg:order-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{top: 4, right: 0, left: 0, bottom: 0}}
              >
                <defs>
                  <linearGradient
                    id="reviewSparkGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={<SparkTooltip />}
                  cursor={{stroke: "#22c55e", strokeOpacity: 0.25}}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#reviewSparkGradient)"
                  dot={false}
                  activeDot={{r: 4, fill: "#fff", stroke: "#22c55e", strokeWidth: 2.5}}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Figures */}
          <div className="flex flex-wrap items-start gap-6 lg:gap-8 flex-1 order-1 lg:order-2 lg:border-r lg:border-zinc-100 lg:dark:border-zinc-700/60 lg:pr-8">
            <Figure label="חשיפות" value={totals.shown.toLocaleString("he-IL")} />
            <Figure
              label="מעברים לגוגל"
              value={totals.clicks.toLocaleString("he-IL")}
              trend={data?.trend}
            />
            <Figure
              label="שיעור המרה"
              value={totals.clickRate}
              suffix="%"
              hint={
                totals.shown > 0
                  ? "מהסועדים שראו את הבקשה"
                  : "אין עדיין מספיק נתונים"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

SparkTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

Figure.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string,
  trend: PropTypes.number,
  hint: PropTypes.string,
};

export default ReviewFunnelCard;
