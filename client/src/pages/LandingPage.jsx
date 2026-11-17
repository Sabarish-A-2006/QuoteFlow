import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Database,
  Search,
  Heart,
  Share2,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Quote as QuoteIcon,
  BookMarked,
  Layers,
  Compass,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { quoteAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [previewQuote, setPreviewQuote] = useState({
    content: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Inspiration",
    tags: ["future", "belief", "courage"],
  });
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Fetch a live quote on landing load to showcase real API functionality
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const res = await quoteAPI.generateQuote();
        if (isMounted && res.data) {
          setPreviewQuote(res.data);
        }
      } catch (err) {
        // Fallback already in place
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLivePreviewGenerate = async () => {
    setLoadingPreview(true);
    try {
      const res = await quoteAPI.generateQuote();
      if (res.data) {
        setPreviewQuote(res.data);
        showToast('Fresh quote discovered & saved to MongoDB!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch quote', 'error');
    } finally {
      setLoadingPreview(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Real-time API Discovery',
      description:
        'Cascading external API integration with Quotable, DummyJSON, and ZenQuotes with instant fallback.',
      gradient: 'from-brand-600 to-violet',
    },
    {
      icon: Database,
      title: 'Automatic MongoDB Storage',
      description:
        'Every successfully generated quote is automatically persisted to MongoDB with indexed metadata.',
      gradient: 'from-emerald-600 to-teal-500',
    },
    {
      icon: Search,
      title: 'Full-Text Search & Filters',
      description:
        'Instant multi-field search across quote contents, author names, and custom category tags.',
      gradient: 'from-blue-600 to-indigo-500',
    },
    {
      icon: Heart,
      title: 'Curated Favourites',
      description:
        'Bookmark your most inspirational quotes and curate personal collections anytime with one click.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Download,
      title: 'Export as High-Res Image',
      description:
        'Transform any quote into a social-ready 1200x700 PNG image with multiple designer gradient themes.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Layers,
      title: 'Data Portability (CSV/JSON)',
      description:
        'Never lose your quotes. Seamlessly export your entire database history as structured CSV or JSON.',
      gradient: 'from-violet-600 to-purple-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Discover Inspiration',
      description:
        'Select a category like Motivation, Wisdom, or Philosophy and generate thought-provoking quotes.',
    },
    {
      number: '02',
      title: 'Auto-Saved to MongoDB',
      description:
        'Zero manual saving needed. Every quote is validated and permanently archived in your personal history.',
    },
    {
      number: '03',
      title: 'Revisit, Share & Export',
      description:
        'Search past quotes, toggle favourites, share across social media, or download as styled images.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/15 via-violet/20 to-pink-500/15 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 shadow-sm mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-brand-600" />
              <span>Full-Stack SaaS Quote Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15] mb-6"
            >
              Words That Inspire.{' '}
              <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-violet bg-clip-text text-transparent">
                Moments Worth Remembering.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              Discover meaningful quotes, save your inspiration automatically to MongoDB, and revisit the words that make a difference.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => navigate('/generate')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-brand-700 via-brand-600 to-violet hover:from-brand-800 hover:to-violet-700 shadow-xl shadow-brand-600/25 hover:shadow-2xl hover:shadow-brand-600/35 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>Generate Your First Quote</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl font-semibold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400 mr-1" />
                <span>Explore Dashboard</span>
              </button>
            </motion.div>
          </div>

          {/* Interactive Live Quote Preview Box */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-2xl shadow-brand-600/10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live Database Preview
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800">
                  {previewQuote.category || 'Inspiration'}
                </span>
              </div>

              <QuoteIcon className="w-10 h-10 text-brand-500/20 mb-3" />
              <blockquote className="font-quote text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed mb-6">
                &ldquo;{previewQuote.content}&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-violet flex items-center justify-center text-white text-xs font-bold">
                    {previewQuote.author?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {previewQuote.author}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Saved to MongoDB &bull; {previewQuote.source || 'api'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLivePreviewGenerate}
                  disabled={loadingPreview}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900 border border-brand-200 dark:border-brand-800 transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>{loadingPreview ? 'Fetching API...' : 'Generate Another'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Complete Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              Engineered for seamless inspiration.
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-3">
              Every detail built to provide a fast, responsive, and delightful quote curation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-200 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.gradient} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Simple & Powerful
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              How QuoteFlow Works
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-3">
              From thought-provoking quotes to permanent database storage in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
              >
                <span className="text-5xl font-black text-brand-500/15 dark:text-brand-400/10 absolute top-6 right-6">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Mindset & Productivity
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 mb-6">
                Cultivate daily wisdom with words that resonate.
              </h2>
              <div className="space-y-4">
                {[
                  'Start your morning with a tailored spark of motivation or philosophy.',
                  'Build an enduring archive of wisdom you can revisit anytime.',
                  'Quickly export quotes as presentation graphics or social media images.',
                  'Stay focused with a clean, ad-free, distraction-free SaaS interface.',
                ].map((text, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/generate')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-600/20 transition-all flex items-center space-x-2"
                >
                  <span>Start Generating Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Visual Card Stack */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Marcus Aurelius
                    </h4>
                    <p className="text-xs text-slate-400">Meditations &bull; Philosophy</p>
                  </div>
                </div>
                <blockquote className="font-quote text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                  &ldquo;You have power over your mind - not outside events. Realize this, and you will find strength.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  <span className="text-rose-500 font-semibold flex items-center">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 mr-1" /> Saved in Favourites
                  </span>
                  <span>MongoDB Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent CTA Banner */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-brand-700 via-brand-600 to-violet text-white shadow-2xl shadow-brand-600/30 text-center relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to find your next favorite thought?
            </h2>
            <p className="text-brand-100 max-w-xl mx-auto mb-8 text-base leading-relaxed">
              Generate random quotes, explore your archive, and download beautiful quote cards today.
            </p>
            <button
              onClick={() => navigate('/generate')}
              className="px-8 py-4 rounded-2xl font-bold text-base text-brand-900 bg-white hover:bg-brand-50 shadow-lg transition-transform transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
            >
              <span>Launch Quote Generator</span>
              <Sparkles className="w-4 h-4 text-brand-700 ml-1" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
