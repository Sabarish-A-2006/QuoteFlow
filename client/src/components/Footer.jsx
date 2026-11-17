import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-violet flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-700 via-brand-600 to-violet bg-clip-text text-transparent">
                QuoteFlow
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Words That Inspire. Moments Worth Remembering. Discover meaningful quotes, save your inspiration automatically to MongoDB, and revisit the words that shape your day.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500 text-sm">
              <span>Full-Stack SaaS Architecture</span>
              <span>•</span>
              <span>React & Node.js</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/generate" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Quote Generator
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Quote History
                </Link>
              </li>
              <li>
                <Link to="/favourites" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Favourites
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Settings & Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>MongoDB & Mongoose</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Express REST APIs</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>React 18 + Vite + Tailwind</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Quotable & DummyJSON APIs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 space-y-4 sm:space-y-0">
          <p className="flex items-center">
            Crafted with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500" /> for thinkers, creators, and leaders worldwide.
          </p>
          <div className="flex items-center space-x-6">
            <span>&copy; {new Date().getFullYear()} QuoteFlow. Production-Ready Edition.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
