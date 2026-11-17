import React from 'react';
import { Sparkles, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No quotes found',
  description = 'Try adjusting your search filters or generate a new quote to get started.',
  actionText = 'Generate New Quote',
  actionPath = '/generate',
  onAction,
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <button
          onClick={handleAction}
          className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-700 to-violet hover:from-brand-800 hover:to-violet-700 shadow-md shadow-brand-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
