import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  History,
  Trash2,
  Download,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  RefreshCw,
} from 'lucide-react';
import HistoryCard from '../components/HistoryCard';
import SearchBar from '../components/SearchBar';
import { CategoryDropdown, SortDropdown } from '../components/FilterDropdown';
import QuoteSkeletonGrid from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import ShareModal from '../components/ShareModal';
import QuoteImageModal from '../components/QuoteImageModal';
import { quoteAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const HistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters & Sorting
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [isFavouriteOnly, setIsFavouriteOnly] = useState(false);

  // Modals
  const [shareQuote, setShareQuote] = useState(null);
  const [imageQuote, setImageQuote] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false);
  const [keepFavouritesOnClear, setKeepFavouritesOnClear] = useState(true);

  const categories = [
    'Motivation',
    'Wisdom',
    'Success',
    'Life',
    'Philosophy',
    'Courage',
    'Happiness',
    'Inspiration',
  ];

  const fetchQuotes = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      try {
        const params = {
          page: targetPage,
          limit: pagination.limit,
          search: search.trim() || undefined,
          category: category !== 'All' ? category : undefined,
          sort,
          isFavourite: isFavouriteOnly ? true : undefined,
        };

        const res = await quoteAPI.getQuotes(params);
        if (res.data) {
          setQuotes(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        showToast(err.message || 'Failed to fetch quote history', 'error');
      } finally {
        setLoading(false);
      }
    },
    [search, category, sort, isFavouriteOnly, pagination.limit, showToast]
  );

  useEffect(() => {
    fetchQuotes(1);
  }, [fetchQuotes]);

  // Sync url param if search query changes
  useEffect(() => {
    const queryParam = searchParams.get('search');
    if (queryParam !== null && queryParam !== search) {
      setSearch(queryParam);
    }
  }, [searchParams]);

  const handleToggleFavourite = async (quote) => {
    try {
      const res = await quoteAPI.toggleFavourite(quote._id || quote.id);
      showToast(res.message || 'Favourite status updated', 'success');
      setQuotes((prev) =>
        prev.map((q) =>
          (q._id || q.id) === (quote._id || quote.id)
            ? { ...q, isFavourite: !quote.isFavourite }
            : q
        )
      );
    } catch (err) {
      showToast(err.message || 'Error updating favourite', 'error');
    }
  };

  const handleDeleteIndividual = async () => {
    if (!deleteCandidate) return;
    try {
      await quoteAPI.deleteQuote(deleteCandidate._id || deleteCandidate.id);
      showToast('Quote removed from history', 'success');
      setDeleteCandidate(null);
      fetchQuotes(pagination.page);
    } catch (err) {
      showToast(err.message || 'Failed to delete quote', 'error');
    }
  };

  const handleClearHistory = async () => {
    try {
      const res = await quoteAPI.clearHistory(keepFavouritesOnClear);
      showToast(res.message || 'History cleared successfully', 'success');
      setClearHistoryOpen(false);
      fetchQuotes(1);
    } catch (err) {
      showToast(err.message || 'Failed to clear history', 'error');
    }
  };

  const handleExport = (format) => {
    const url = quoteAPI.getExportUrl(format, isFavouriteOnly ? 'favourites' : 'all');
    window.open(url, '_blank');
    showToast(`Exporting quotes as ${format.toUpperCase()}...`, 'info');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Quote History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800">
              {pagination.total} saved
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Browse, search, and manage all quotes previously saved to MongoDB
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => handleExport('csv')}
            disabled={quotes.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            disabled={quotes.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            title="Download JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => setClearHistoryOpen(true)}
            disabled={quotes.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full lg:w-96">
          <SearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder="Search in quotes or author name..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 w-full lg:w-auto flex-wrap gap-y-2">
          <CategoryDropdown
            value={category}
            onChange={(val) => setCategory(val)}
            categories={categories}
          />

          <SortDropdown
            value={sort}
            onChange={(val) => setSort(val)}
          />

          {/* Favourites Only Filter Toggle */}
          <button
            onClick={() => setIsFavouriteOnly(!isFavouriteOnly)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center space-x-1.5 ${
              isFavouriteOnly
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavouriteOnly ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span>Favourites Only</span>
          </button>
        </div>
      </div>

      {/* Quote Grid / Loading / Empty State */}
      {loading ? (
        <QuoteSkeletonGrid count={6} />
      ) : quotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <HistoryCard
              key={q._id || q.id}
              quote={q}
              onToggleFavourite={handleToggleFavourite}
              onDelete={(cand) => setDeleteCandidate(cand)}
              onOpenShareModal={(cand) => setShareQuote(cand)}
              onOpenImageModal={(cand) => setImageQuote(cand)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={search || category !== 'All' ? 'No matching quotes' : 'Your history is empty'}
          description={
            search || category !== 'All'
              ? 'No quotes match your search criteria. Try modifying your search or filters.'
              : 'Start by generating your first quote to build an inspirational history.'
          }
          actionText="Generate New Quote"
          actionPath="/generate"
        />
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} quotes)
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchQuotes(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              {pagination.page}
            </span>

            <button
              onClick={() => fetchQuotes(pagination.page + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

      <ConfirmationModal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDeleteIndividual}
        title="Delete this quote?"
        message="This will permanently delete this quote record from your MongoDB database."
        confirmText="Delete Quote"
      />

      <ConfirmationModal
        isOpen={clearHistoryOpen}
        onClose={() => setClearHistoryOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear entire history?"
        message="Are you sure you want to delete your quote history? You can choose to preserve your starred favourites below."
        confirmText="Clear History"
        extraOption={
          <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={keepFavouritesOnClear}
              onChange={(e) => setKeepFavouritesOnClear(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-600 focus:ring-brand-500"
            />
            <span>Keep my starred favourites safe (Recommended)</span>
          </label>
        }
      />
    </div>
  );
};

export default HistoryPage;
