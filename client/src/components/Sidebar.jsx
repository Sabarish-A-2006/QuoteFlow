import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  History,
  Heart,
  Settings,
  Home,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Generate Quote', path: '/generate', icon: Sparkles },
  { name: 'Quote History', path: '/history', icon: History },
  { name: 'Favourites', path: '/favourites', icon: Heart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 dark:border-slate-800/80">
            <NavLink
              to="/"
              onClick={closeMobileSidebar}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-violet flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-brand-700 via-brand-600 to-violet bg-clip-text text-transparent">
                  QuoteFlow
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  SaaS Studio
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 mr-3 transition-colors ${
                          isActive
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.path === '/generate' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                          AI
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Action Box & Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-700 to-violet text-white shadow-lg shadow-brand-500/20">
            <div className="flex items-center space-x-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-brand-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">
                Quick Inspiration
              </span>
            </div>
            <p className="text-xs text-brand-100/90 mb-3 leading-relaxed">
              Generate a spark of wisdom in just one click.
            </p>
            <button
              onClick={() => {
                closeMobileSidebar();
                navigate('/generate');
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-brand-900 bg-white hover:bg-brand-50 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1"
            >
              <span>Instant Generate</span>
              <Sparkles className="w-3.5 h-3.5 ml-1 text-brand-700" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 px-1">
            <NavLink
              to="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              Landing Page
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
