import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-violet text-white flex items-center justify-center mb-6 shadow-xl shadow-brand-500/20">
        <Sparkles className="w-8 h-8" />
      </div>

      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        The inspirational path you are seeking does not exist or has been relocated.
      </p>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-700 to-violet hover:from-brand-800 hover:to-violet-700 shadow-md transition-all flex items-center space-x-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
