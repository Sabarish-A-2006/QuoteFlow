import React from 'react';
import { motion } from 'framer-motion';

const StatisticsCard = ({
  title,
  value,
  icon: Icon,
  gradient = 'from-brand-600 to-violet',
  badgeText,
  badgeType = 'brand',
  subtitle,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-md shadow-brand-500/15`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value !== undefined ? Number(value).toLocaleString() : '0'}
        </div>
        {badgeText && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              badgeType === 'emerald'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                : badgeType === 'rose'
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'
                : 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default StatisticsCard;
