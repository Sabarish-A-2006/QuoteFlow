import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Command, Info } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import ShareModal from '../components/ShareModal';
import QuoteImageModal from '../components/QuoteImageModal';
import { quoteAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const GeneratePage = () => {
  const { showToast } = useToast();

  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('quoteflow-default-category') || null;
  });
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Modals
  const [shareQuote, setShareQuote] = useState(null);
  const [imageQuote, setImageQuote] = useState(null);

  // Generate a quote
  const handleGenerate = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await quoteAPI.generateQuote(selectedCategory);
      if (res.data) {
        setCurrentQuote(res.data);
        setIsDuplicate(!!res.isDuplicate);
        if (res.isDuplicate) {
          showToast('Retrieved recent quote from your archive.', 'info');
        } else {
          showToast('New quote generated and saved to MongoDB!', 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate quote. Please check your network.', 'error');
    } finally {
      setLoading(false);
    }
  }, [loading, selectedCategory, showToast]);

  // Initial quote fetch on mount if none loaded
  useEffect(() => {
    let mounted = true;
    const fetchFirst = async () => {
      setLoading(true);
      try {
        const res = await quoteAPI.generateQuote(selectedCategory);
        if (mounted && res.data) {
          setCurrentQuote(res.data);
          setIsDuplicate(!!res.isDuplicate);
        }
      } catch (err) {
        // Fallback handled
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFirst();
    return () => {
      mounted = false;
    };
  }, []);

  // Keyboard shortcut listener on Generate page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space' || e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleGenerate();
      } else if (e.key.toLowerCase() === 'c' && currentQuote?.content) {
        e.preventDefault();
        navigator.clipboard.writeText(`"${currentQuote.content}" — ${currentQuote.author}`);
        showToast('Quote copied to clipboard!', 'success');
      } else if (e.key.toLowerCase() === 'f' && currentQuote) {
        e.preventDefault();
        handleToggleFavourite(currentQuote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, currentQuote]);

  const handleToggleFavourite = async (quote) => {
    if (!quote) return;
    try {
      const res = await quoteAPI.toggleFavourite(quote._id || quote.id);
      setCurrentQuote((prev) => ({
        ...prev,
        isFavourite: !prev.isFavourite,
      }));
      showToast(res.message || 'Updated favourite status', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update favourite', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Description */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800 mb-1">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-600" />
          Interactive Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Quote Generator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover hand-crafted wisdom fetched in real-time and automatically archived in MongoDB.
        </p>
      </div>

      {/* Main Quote Card */}
      <QuoteCard
        quote={currentQuote}
        loading={loading}
        onGenerate={handleGenerate}
        onToggleFavourite={handleToggleFavourite}
        onOpenShareModal={(q) => setShareQuote(q)}
        onOpenImageModal={(q) => setImageQuote(q)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        isDuplicate={isDuplicate}
      />

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-4 sm:gap-6 shadow-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
          <Command className="w-3.5 h-3.5 mr-1 text-brand-600" />
          Hotkeys:
        </span>
        <div className="flex items-center space-x-1.5">
          <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold">
            Space
          </kbd>
          <span>/</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold">
            G
          </kbd>
          <span>Generate</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold">
            C
          </kbd>
          <span>Copy</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold">
            F
          </kbd>
          <span>Favourite</span>
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={!!shareQuote}
        onClose={() => setShareQuote(null)}
        quote={shareQuote}
      />

      <QuoteImageModal
        isOpen={!!imageQuote}
        onClose={() => setImageQuote(null)}
        quote={imageQuote}
      />
    </div>
  );
};

export default GeneratePage;
