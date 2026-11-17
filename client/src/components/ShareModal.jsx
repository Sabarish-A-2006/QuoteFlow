import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ShareModal = ({ isOpen, onClose, quote }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !quote) return null;

  const quoteText = `"${quote.content}" — ${quote.author}`;
  const shareUrl = window.location.origin;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${quoteText}\n\nShared via QuoteFlow`);
      setCopied(true);
      showToast('Quote copied for sharing!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      quoteText
    )}&hashtags=QuoteFlow,Inspiration,Quotes`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${quoteText}\n\nDiscover more at ${shareUrl}`
    )}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          text: quoteText,
          url: shareUrl,
        });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Native share failed', 'error');
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg p-6 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Share Inspiration
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quote Preview */}
          <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <p className="font-quote text-base text-slate-800 dark:text-slate-200 line-clamp-3 italic mb-2">
              &ldquo;{quote.content}&rdquo;
            </p>
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              — {quote.author}
            </p>
          </div>

          {/* Social Share Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              onClick={handleTwitterShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all flex flex-col items-center space-y-1.5 group"
            >
              <Twitter className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                X / Twitter
              </span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex flex-col items-center space-y-1.5 group"
            >
              <MessageCircle className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                WhatsApp
              </span>
            </button>

            <button
              onClick={handleLinkedInShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all flex flex-col items-center space-y-1.5 group"
            >
              <Linkedin className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                LinkedIn
              </span>
            </button>

            <button
              onClick={handleNativeShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all flex flex-col items-center space-y-1.5 group"
            >
              <Share2 className="w-5 h-5 text-violet-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                System Share
              </span>
            </button>
          </div>

          {/* Quick Copy Link Box */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate px-2 font-mono">
              {quoteText.substring(0, 45)}...
            </span>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;
