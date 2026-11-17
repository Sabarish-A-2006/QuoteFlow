import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Copy,
  Check,
  Share2,
  Trash2,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const HistoryCard = ({
  quote,
  onToggleFavourite,
  onDelete,
  onOpenShareModal,
  onOpenImageModal,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const formattedDate = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const formattedTime = quote.createdAt
    ? new Date(quote.createdAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200"
    >
      <div>
        {/* Top Badges and Favourite */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800">
            {quote.category || 'Inspiration'}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleFavourite(quote)}
              className={`p-1.5 rounded-lg transition-colors ${
                quote.isFavourite
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={quote.isFavourite ? 'Unfavourite' : 'Mark Favourite'}
              aria-label="Toggle favourite"
            >
              <Heart
                className={`w-4 h-4 ${
                  quote.isFavourite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quote Content */}
        <p className="font-quote text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed line-clamp-4 mb-4">
          &ldquo;{quote.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-700 to-violet flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {quote.author ? quote.author.charAt(0) : 'U'}
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
            {quote.author || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Card Footer Details & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1" title={`${formattedDate} at ${formattedTime}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy quote"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => onOpenShareModal(quote)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share quote"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenImageModal(quote)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Export as image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(quote)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Delete quote"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryCard;
