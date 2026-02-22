import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getMenuStats } from '@/utils/fetchData';
import { useSelector } from 'react-redux';

const MenuViewsChart = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const user = useSelector((state) => state.user.user);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      const stats = await getMenuStats(user._id, 30);
      
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last30Days.push(d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }));
      }

      const mergedData = last30Days.map(dateStr => {
        const found = stats.find(s => s.date === dateStr);
        return {
          date: dateStr,
          views: found ? found.views : 0
        };
      });

      setLabels(mergedData.map(d => d.date));
      setData(mergedData.map(d => d.views));
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // Emerald-500 fading out
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'כניסות',
          data: data,
          borderColor: '#10b981', // Emerald-500
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#10b981',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#27272a',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#3f3f46',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y + ' כניסות';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            position: 'right', // Standard for RTL
            grid: {
              color: 'rgba(161, 161, 170, 0.1)', 
              borderDash: [5, 5]
            },
            ticks: {
              color: '#a1a1aa',
              font: {
                family: "'Inter', sans-serif",
                size: 11
              }
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#a1a1aa',
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              maxTicksLimit: window.innerWidth < 768 ? 5 : 10
            },
            border: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels]);

  return (
    <div dir="rtl" className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl soft-shadow border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-full w-full flex-1">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white">סה״כ כניסות לתפריט</h2>
      </div>
      <div className="flex-1 w-full overflow-x-auto overflow-y-hidden custom-scrollbar min-h-0">
        <div className="min-w-[500px] md:min-w-full h-full relative">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default MenuViewsChart;
