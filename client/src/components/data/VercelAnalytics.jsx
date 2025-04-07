import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [stats, setStats] = useState([]);
  const VERCEL_PROJECT_ID = import.meta.env.VITE_VERCEL_PROJECTID;
  const VERCEL_TOKEN = import.meta.env.VITE_VERCEL_ANALYTICS;
  console.log(VERCEL_PROJECT_ID + VERCEL_TOKEN);

  useEffect(() => {
    const fetchData = async () => {
      if (!VERCEL_PROJECT_ID || !VERCEL_TOKEN) {
        console.error("Missing Vercel Project ID or Token");
        return;
      }
      try {
        const response = await axios.get(
          `https://api.vercel.com/v2/insights/${VERCEL_PROJECT_ID}/traffic
`,
          {
            headers: {
              Authorization: `Bearer ${VERCEL_TOKEN}`,
            },
          }
        );

        if (response.data && response.data.traffic) {
          const formattedData = response.data.traffic.map((entry) => ({
            date: new Date(entry.timestamp).toLocaleDateString(),
            visits: entry.visitors,
          }));
          setStats(formattedData);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Vercel Analytics</h2>
      {stats.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="visits" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available or loading...</p>
      )}
    </div>
  );
};

export default Analytics;
