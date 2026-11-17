import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Database,
  Download,
  Trash2,
  Sparkles,
  Command,
  Check,
  Shield,
  Layers,
  Server,
  Info,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { quoteAPI } from '../services/api';

const SettingsPage = () => {
  const { theme, setTheme, isDark } = useTheme();
  const { showToast } = useToast();

  const [defaultCategory, setDefaultCategory] = useState(() => {
    return localStorage.getItem('quoteflow-default-category') || 'All';
  });

  const [clearHistoryModalOpen, setClearHistoryModalOpen] = useState(false);
  const [keepFavourites, setKeepFavourites] = useState(true);

  const categories = [
    'All',
    'Motivation',
    'Wisdom',
    'Success',
    'Life',
    'Philosophy',
    'Courage',
    'Happiness',
  ];

  const handleCategoryChange = (cat) => {
    setDefaultCategory(cat);
    if (cat === 'All') {
      localStorage.removeItem('quoteflow-default-category');
    } else {
      localStorage.setItem('quoteflow-default-category', cat);
    }
    showToast(`Default category updated to ${cat}`, 'success');
  };

  const handleExportData = (format) => {
    const url = quoteAPI.getExportUrl(format, 'all');
    window.open(url, '_blank');
    showToast(`Downloading database export as ${format.toUpperCase()}...`, 'info');
  };

  const handleClearHistory = async () => {
    try {
      const res = await quoteAPI.clearHistory(keepFavourites);
      showToast(res.message || 'Quote history cleared successfully', 'success');
      setClearHistoryModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to clear history', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Customize your workspace appearance, default categories, and data portability
        </p>
      </div>

      {/* Theme Appearance Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Appearance Theme</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Choose your preferred color theme for high readability and focus
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold">Light Mode</p>
                <p className="text-xs text-slate-500">Bright and crisp workspace</p>
              </div>
            </div>
            {theme === 'light' && <Check className="w-5 h-5 text-brand-600" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-sm">
                <Moon className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Dark Mode</p>
                <p className="text-xs text-slate-500">Low-glare midnight aesthetics</p>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-5 h-5 text-brand-600" />}
          </button>
        </div>
      </div>

      {/* Default Quote Category */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <span>Default Quote Category</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Set your preferred focus area when generating new quotes
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                defaultCategory === cat
                  ? 'bg-gradient-to-r from-brand-700 to-violet text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Data Management & Portability</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Export your database records or reset your archive with granular controls
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportData('json')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-left flex flex-col justify-between space-y-3 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Export as JSON
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete database backup format
              </p>
            </div>
          </button>

          <button
            onClick={() => handleExportData('csv')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-left flex flex-col justify-between space-y-3 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Export as CSV
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Spreadsheet ready format
              </p>
            </div>
          </button>

          <button
            onClick={() => setClearHistoryModalOpen(true)}
            className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-left flex flex-col justify-between space-y-3 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                Clear Quote History
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Wipe database records
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Command className="w-5 h-5 text-brand-600" />
            <span>Keyboard Shortcuts Guide</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Navigate QuoteFlow at lightspeed with built-in hotkeys
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { key: 'Space / G', desc: 'Generate new random quote' },
            { key: 'C', desc: 'Copy current quote to clipboard' },
            { key: 'F', desc: 'Toggle favourite on active quote' },
            { key: 'D', desc: 'Toggle Dark / Light mode' },
            { key: '/', desc: 'Quick focus search bar' },
            { key: 'Esc', desc: 'Close any active modal dialog' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
            >
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {item.desc}
              </span>
              <kbd className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400 shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* About QuoteFlow & Architecture */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400">
          <Info className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            About QuoteFlow
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          QuoteFlow is a production-quality full-stack SaaS application built to inspire and archive daily thought leadership. Every generated quote is dynamically pulled from real external APIs (Quotable, DummyJSON, ZenQuotes) with cascaded failover, then permanently indexed in MongoDB.
        </p>

        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 block mb-0.5">Frontend</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              React 18 + Vite
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 block mb-0.5">Backend</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Express REST API
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 block mb-0.5">Database</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              MongoDB + Mongoose
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 block mb-0.5">Version</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              v1.0.0 (Production)
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={clearHistoryModalOpen}
        onClose={() => setClearHistoryModalOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear quote history?"
        message="This action will delete quotes from MongoDB. Check the box below if you wish to keep starred favourites intact."
        confirmText="Confirm Clear"
        extraOption={
          <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={keepFavourites}
              onChange={(e) => setKeepFavourites(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-600"
            />
            <span>Preserve my starred favourites</span>
          </label>
        }
      />
    </div>
  );
};

export default SettingsPage;
