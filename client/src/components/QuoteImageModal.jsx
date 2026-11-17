import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Sparkles, Palette, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const THEMES = [
  {
    id: 'indigo-violet',
    name: 'Cosmic Indigo',
    bg1: '#312E81',
    bg2: '#4338CA',
    bg3: '#7C3AED',
    textColor: '#FFFFFF',
    authorColor: '#C7D2FE',
    badgeBg: 'rgba(255, 255, 255, 0.15)',
  },
  {
    id: 'sunset',
    name: 'Sunset Radiance',
    bg1: '#831843',
    bg2: '#BE185D',
    bg3: '#F59E0B',
    textColor: '#FFFFFF',
    authorColor: '#FDE68A',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
  },
  {
    id: 'emerald',
    name: 'Deep Forest',
    bg1: '#064E3B',
    bg2: '#047857',
    bg3: '#10B981',
    textColor: '#FFFFFF',
    authorColor: '#A7F3D0',
    badgeBg: 'rgba(255, 255, 255, 0.18)',
  },
  {
    id: 'midnight',
    name: 'Midnight Noir',
    bg1: '#090D16',
    bg2: '#0F172A',
    bg3: '#1E293B',
    textColor: '#F8FAFC',
    authorColor: '#94A3B8',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
  },
];

const QuoteImageModal = ({ isOpen, onClose, quote }) => {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && quote) {
      drawCanvas();
    }
  }, [isOpen, quote, selectedTheme]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !quote) return;

    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 700;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, selectedTheme.bg1);
    gradient.addColorStop(0.5, selectedTheme.bg2);
    gradient.addColorStop(1, selectedTheme.bg3);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative background quotation mark watermark
    ctx.font = 'bold 360px Georgia, serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.textAlign = 'right';
    ctx.fillText('“', width - 80, 360);

    // Subtle border glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 16;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Top Category / Brand Pill
    const category = quote.category || 'Inspiration';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = selectedTheme.authorColor;
    ctx.textAlign = 'left';
    ctx.fillText(`✨ QUOTEFLOW  •  ${category.toUpperCase()}`, 90, 110);

    // Quote text with word-wrap
    const quoteContent = `“${quote.content}”`;
    ctx.fillStyle = selectedTheme.textColor;
    ctx.font = '500 46px Georgia, "Playfair Display", serif';

    const words = quoteContent.split(' ');
    let line = '';
    const lines = [];
    const maxLineWidth = width - 180;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Calculate vertical starting position to center text comfortably
    const lineHeight = 66;
    const totalTextHeight = lines.length * lineHeight;
    let startY = Math.max(180, (height - totalTextHeight) / 2 - 20);

    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], 90, startY + j * lineHeight);
    }

    // Author
    const authorY = startY + totalTextHeight + 40;
    ctx.fillStyle = selectedTheme.authorColor;
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`— ${quote.author || 'Unknown'}`, 90, authorY);

    // Footer Tagline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Discover & Save on QuoteFlow', width - 90, height - 70);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const authorSlug = (quote.author || 'quote').toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `quoteflow-${authorSlug}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Image downloaded successfully!', 'success');
      onClose();
    } catch (err) {
      showToast('Failed to download image', 'error');
    } finally {
      setIsRendering(false);
    }
  };

  if (!isOpen || !quote) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl p-6 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Download Quote Image
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="py-3 flex items-center space-x-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 flex items-center mr-1">
              <Palette className="w-3.5 h-3.5 mr-1" />
              Style:
            </span>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  selectedTheme.id === theme.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: theme.bg2 }}
                />
                <span>{theme.name}</span>
                {selectedTheme.id === theme.id && <Check className="w-3 h-3 ml-1" />}
              </button>
            ))}
          </div>

          {/* Canvas Preview */}
          <div className="relative my-2 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-950 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-h-[360px] object-contain rounded-xl"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400">
              High resolution 1200 x 700 PNG image
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={isRendering}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-700 to-violet hover:from-brand-800 hover:to-violet-700 shadow-md flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuoteImageModal;
