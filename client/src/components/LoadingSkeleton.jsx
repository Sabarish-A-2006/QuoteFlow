import React from 'react';

export const QuoteSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse flex flex-col justify-between h-56"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
              <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-4/5" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/5" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuoteSkeletonGrid;
