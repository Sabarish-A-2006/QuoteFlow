import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Copy,
  Check,
  Share2,
  Sparkles,
  Download,
  Quote as QuoteIcon,
  Tag,
  Clock,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';

const QuoteCard = ({
  quote,
  loading,
  onGenerate,
  onToggleFavourite,
  onOpenShareModal,
  onOpenImageModal,
  selectedCategory,
  onSelectCategory,
  isDuplicate = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    if (!quote?.content) return;
    try {
      await navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`);
      setCopied(true);
      showToast('Quote copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleFavouriteClick = () => {
    if (!quote) return;
    if (!quote.isFavourite) {
      // Trigger subtle confetti burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#4338CA', '#7C3AED', '#EC4899'],
        });
      } catch (e) {
        // ignore
      }
    }
    onToggleFavourite(quote);
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1 flex items-center">
          <Tag className="w-3.5 h-3.5 mr-1" />
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat === 'All' ? null : cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              (cat === 'All' && !selectedCategory) || selectedCategory === cat
                ? 'bg-gradient-to-r from-brand-700 to-violet text-white shadow-sm shadow-brand-500/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Quote Card Container */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-300">
        {/* Decorative gradient top bar */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-violet" />

        {/* Decorative background watermark */}
        <QuoteIcon className="absolute right-6 top-8 w-32 h-32 text-slate-100 dark:text-slate-800/40 pointer-events-none -z-0 rotate-12 transition-opacity" />

        <div className="relative z-10 p-6 sm:p-10 md:p-12 flex flex-col justify-between min-h-[380px]">
          {/* Card Top Badges */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-600" />
                {quote?.category || selectedCategory || 'Inspirational'}
              </span>

              {isDuplicate && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Previously Saved
                </span>
              )}

              {quote?.source && (
                <span className="hidden sm:inline-flex items-center text-[11px] text-slate-400 dark:text-slate-500">
                  via {quote.source}
                </span>
              )}
            </div>

            {quote?.createdAt && (
              <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {new Date(quote.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Animated Quote Content */}
          <div className="my-auto py-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 animate-pulse"
                >
                  <div className="h-7 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-11/12" />
                  <div className="h-7 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-4/5" />
                  <div className="h-7 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-2/3" />
                  <div className="pt-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-36" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={quote?._id || quote?.content}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  <blockquote className="font-quote text-2xl sm:text-3xl md:text-4xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed sm:leading-relaxed">
                    &ldquo;{quote?.content || 'Click Generate to discover your next quote.'}&rdquo;
                  </blockquote>

                  {quote?.author && (
                    <div className="flex items-center space-x-3 pt-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-violet flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {quote.author.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <cite className="not-italic text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                          {quote.author}
                        </cite>
                        {quote.tags && quote.tags.length > 0 && (
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            {quote.tags.slice(0, 3).map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] text-slate-500 dark:text-slate-400 capitalize"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Bar */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Utility Actions */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-start">
              {/* Favourite Button */}
              <button
                onClick={handleFavouriteClick}
                disabled={!quote || loading}
                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center space-x-1.5 ${
                  quote?.isFavourite
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500'
                }`}
                title={quote?.isFavourite ? 'Remove from favourites' : 'Mark as favourite'}
                aria-label="Toggle favourite"
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    quote?.isFavourite ? 'fill-rose-500 text-rose-500 scale-110' : ''
                  }`}
                />
                <span className="text-xs font-semibold hidden md:inline">
                  {quote?.isFavourite ? 'Saved' : 'Favourite'}
                </span>
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled={!quote || loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center space-x-1.5"
                title="Copy to clipboard"
                aria-label="Copy quote"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden md:inline">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span className="text-xs font-semibold hidden md:inline">Copy</span>
                  </>
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={() => onOpenShareModal(quote)}
                disabled={!quote || loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center space-x-1.5"
                title="Share quote"
                aria-label="Share quote"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-semibold hidden md:inline">Share</span>
              </button>

              {/* Download Image Button */}
              <button
                onClick={() => onOpenImageModal(quote)}
                disabled={!quote || loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center space-x-1.5"
                title="Save as beautiful image"
                aria-label="Save as image"
              >
                <Download className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span className="text-xs font-semibold hidden md:inline">Image</span>
              </button>
            </div>

            {/* Primary Generate Button */}
            <button
              onClick={onGenerate}
              disabled={loading}
              className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-semibold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-brand-400 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-brand-700 via-brand-600 to-violet hover:from-brand-800 hover:to-violet-700 shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Fetching Inspiration...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Quote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
