import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Search, Download, Trash2, Sparkles } from 'lucide-react';
import HistoryCard from '../components/HistoryCard';
import SearchBar from '../components/SearchBar';
import QuoteSkeletonGrid from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import ShareModal from '../components/ShareModal';
import QuoteImageModal from '../components/QuoteImageModal';
import { quoteAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const FavouritesPage = () => {
  const { showToast } = useToast();

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [shareQuote, setShareQuote] = useState(null);
  const [imageQuote, setImageQuote] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const fetchFavourites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteAPI.getFavourites({ search: search.trim() || undefined });
      if (res.data) {
        setFavourites(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch favourite quotes', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const handleToggleFavourite = async (quote) => {
    try {
      await quoteAPI.toggleFavourite(quote._id || quote.id);
      showToast('Removed from favourites', 'info');
      // Remove from list
      setFavourites((prev) => prev.filter((q) => (q._id || q.id) !== (quote._id || quote.id)));
    } catch (err) {
      showToast(err.message || 'Error updating favourite', 'error');
    }
  };

  const handleDeleteIndividual = async () => {
    if (!deleteCandidate) return;
    try {
      await quoteAPI.deleteQuote(deleteCandidate._id || deleteCandidate.id);
      showToast('Quote deleted', 'success');
      setDeleteCandidate(null);
      fetchFavourites();
    } catch (err) {
      showToast(err.message || 'Failed to delete quote', 'error');
    }
  };

  const handleExport = (format) => {
    const url = quoteAPI.getExportUrl(format, 'favourites');
    window.open(url, '_blank');
    showToast(`Exporting favourites as ${format.toUpperCase()}...`, 'info');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Favourite Quotes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800">
              {favourites.length} starred
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Your personally curated collection of timeless quotes and insights
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={favourites.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={favourites.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Filter favourite quotes by keyword or author..."
        />
      </div>

      {/* Content */}
      {loading ? (
        <QuoteSkeletonGrid count={6} />
      ) : favourites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((q) => (
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
          icon={Heart}
          title={search ? 'No matching favourites' : 'No favourites yet'}
          description={
            search
              ? 'No starred quotes matched your search term.'
              : 'You have not marked any quotes as favourites yet. Click the heart icon on any quote to add it here.'
          }
          actionText="Discover Quotes"
          actionPath="/generate"
        />
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
        message="This will remove the quote from both your favourites and history permanently."
        confirmText="Delete Quote"
      />
    </div>
  );
};

export default FavouritesPage;
