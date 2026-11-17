import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { TrendingUp, PieChart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
        <p className="text-brand-600 dark:text-brand-400 font-bold">
          {payload[0].value} {payload[0].value === 1 ? 'quote' : 'quotes'} generated
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ timeline = [], categoryStats = [] }) => {
  const { isDark } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 7-Day Activity Trend Chart */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Quotes Generated (Last 7 Days)</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Visual overview of your daily inspirational discovery cadence
            </p>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          {timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338CA" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke={isDark ? '#64748B' : '#94A3B8'}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={isDark ? '#64748B' : '#94A3B8'}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#chartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No activity recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Top Categories</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Distribution of saved quotes
          </p>
        </div>

        <div className="space-y-3 my-auto">
          {categoryStats.length > 0 ? (
            categoryStats.map((item, index) => {
              const maxCount = categoryStats[0]?.count || 1;
              const percentage = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.name || index} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                    <span className="text-brand-600 dark:text-brand-400">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-violet rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">
              Generate quotes to see your category breakdown.
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          Automatically categorized on generation
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
