import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

export const CategoryDropdown = ({ value, onChange, categories = [] }) => {
  return (
    <div className="relative inline-flex items-center">
      <Filter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer shadow-sm"
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
    </div>
  );
};

export const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <ArrowUpDown className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer shadow-sm"
      >
        <option value="latest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="author">Author (A-Z)</option>
        <option value="content">Quote Length</option>
      </select>
      <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
    </div>
  );
};

export default { CategoryDropdown, SortDropdown };
