import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Heart,
  Calendar,
  Users,
  ArrowRight,
  TrendingUp,
  Quote as QuoteIcon,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';
import AnalyticsChart from '../components/AnalyticsChart';
import HistoryCard from '../components/HistoryCard';
import ShareModal from '../components/ShareModal';
import QuoteImageModal from '../components/QuoteImageModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { quoteAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalQuotes: 0,
    favouriteQuotes: 0,
    quotesToday: 0,
    uniqueAuthorsCount: 0,
    categoryStats: [],
    timeline: [],
    recentQuotes: [],
  });
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyCopied, setDailyCopied] = useState(false);

  // Modals
  const [shareQuote, setShareQuote] = useState(null);
  const [imageQuote, setImageQuote] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, dailyRes] = await Promise.all([
        quoteAPI.getStats(),
        quoteAPI.getDailyQuote().catch(() => ({ data: null })),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (dailyRes && dailyRes.data) {
        setDailyQuote(dailyRes.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleFavourite = async (quote) => {
    try {
      const res = await quoteAPI.toggleFavourite(quote._id || quote.id);
      showToast(res.message || 'Updated favourite status', 'success');
      // Update local recent list & stats
      setStats((prev) => ({
        ...prev,
        favouriteQuotes: quote.isFavourite
          ? Math.max(0, prev.favouriteQuotes - 1)
          : prev.favouriteQuotes + 1,
        recentQuotes: prev.recentQuotes.map((q) =>
          (q._id || q.id) === (quote._id || quote.id)
            ? { ...q, isFavourite: !quote.isFavourite }
            : q
        ),
      }));
    } catch (err) {
      showToast(err.message || 'Could not update favourite', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await quoteAPI.deleteQuote(deleteCandidate._id || deleteCandidate.id);
      showToast('Quote removed successfully', 'success');
      setDeleteCandidate(null);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete quote', 'error');
    }
  };

  const handleCopyDaily = async () => {
    if (!dailyQuote) return;
    try {
      await navigator.clipboard.writeText(`"${dailyQuote.content}" — ${dailyQuote.author}`);
      setDailyCopied(true);
      showToast('Daily quote copied!', 'success');
      setTimeout(() => setDailyCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-700 via-brand-600 to-violet text-white shadow-xl shadow-brand-600/15">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-200">
              Personal SaaS Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, Explorer!
            </h1>
            <p className="text-sm text-brand-100/90 leading-relaxed">
              Your personal library currently holds{' '}
              <strong className="text-white font-bold">{stats.totalQuotes}</strong> quotes with{' '}
              <strong className="text-white font-bold">{stats.favouriteQuotes}</strong> marked as favourites.
            </p>
          </div>

          <button
            onClick={() => navigate('/generate')}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-brand-900 bg-white hover:bg-brand-50 shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-brand-700" />
            <span>Generate Quote Now</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatisticsCard
          title="Total Quotes Generated"
          value={stats.totalQuotes}
          icon={BookOpen}
          gradient="from-brand-600 to-indigo-600"
          badgeText="All Time"
          badgeType="brand"
          subtitle="Saved permanently in MongoDB"
        />
        <StatisticsCard
          title="Favourite Quotes"
          value={stats.favouriteQuotes}
          icon={Heart}
          gradient="from-rose-500 to-pink-600"
          badgeText="Curated"
          badgeType="rose"
          subtitle="Starred for inspiration"
        />
        <StatisticsCard
          title="Quotes Generated Today"
          value={stats.quotesToday}
          icon={Calendar}
          gradient="from-emerald-500 to-teal-600"
          badgeText="Today"
          badgeType="emerald"
          subtitle="Active daily cadence"
        />
        <StatisticsCard
          title="Unique Authors"
          value={stats.uniqueAuthorsCount}
          icon={Users}
          gradient="from-violet-600 to-purple-600"
          badgeText="Diversity"
          badgeType="brand"
          subtitle="Distinct voices discovered"
        />
      </div>

      {/* Quote of the Day Banner */}
      {dailyQuote && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200/60 dark:border-brand-900/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-600" />
              Quote of the Day
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleCopyDaily}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy quote"
              >
                {dailyCopied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setShareQuote(dailyQuote)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Share quote"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <blockquote className="font-quote text-xl sm:text-2xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed mb-4">
            &ldquo;{dailyQuote.content}&rdquo;
          </blockquote>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-200">
                — {dailyQuote.author}
              </span>
            </div>
            <span className="italic">Daily Thought</span>
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      <AnalyticsChart
        timeline={stats.timeline}
        categoryStats={stats.categoryStats}
      />

      {/* Recent Quotes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Recent Discoveries
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Your most recently generated quotes from MongoDB
            </p>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
          >
            <span>View Full History ({stats.totalQuotes})</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {stats.recentQuotes && stats.recentQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.recentQuotes.map((q) => (
              <HistoryCard
                key={q._id || q.id}
                quote={q}
                onToggleFavourite={handleToggleFavourite}
                onDelete={(candidate) => setDeleteCandidate(candidate)}
                onOpenShareModal={(candidate) => setShareQuote(candidate)}
                onOpenImageModal={(candidate) => setImageQuote(candidate)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-sm text-slate-400">
            No quotes generated yet. Click "Generate Quote Now" above to begin!
          </div>
        )}
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

      <ConfirmationModal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this quote?"
        message="This will remove the quote permanently from your MongoDB history."
        confirmText="Delete Quote"
      />
    </div>
  );
};

export default DashboardPage;
