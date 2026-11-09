import React from 'react';
import { Shield, EyeOff, AlertTriangle, Moon, Sun } from 'lucide-react';

export type NavTab = 'report' | 'track' | 'committee' | 'travel_safety' | 'legal_posh' | 'proposal';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerDisguise: () => void;
  isSOSActive: boolean;
  onToggleSOS: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onTriggerDisguise,
  isSOSActive,
  onToggleSOS,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onTabChange('report')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
              SafeVoice
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onTabChange('report')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'report' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Submit Report
          </button>

          <button
            onClick={() => onTabChange('track')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'track' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Track Case
          </button>

          <button
            onClick={() => onTabChange('travel_safety')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'travel_safety' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Travel Safety
          </button>

          <button
            onClick={() => onTabChange('committee')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'committee' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Committee Portal
          </button>

          <button
            onClick={() => onTabChange('legal_posh')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'legal_posh' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Legal & POSH
          </button>

          <button
            onClick={() => onTabChange('proposal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'proposal' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Value Case & Pitch
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster (Quick Disguise + SOS toggle + Theme) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Disguise Button */}
          <button
            onClick={onTriggerDisguise}
            title="Instantly disguise screen (Hotkey: Esc)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Quick Disguise</span>
          </button>

          {/* Primary SOS Action */}
          <button
            onClick={onToggleSOS}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm whitespace-nowrap ${
              isSOSActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>{isSOSActive ? 'SOS Active' : 'One-Tap SOS'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-xs gap-3">
        {(['report', 'track', 'travel_safety', 'committee', 'legal_posh', 'proposal'] as NavTab[]).map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors ${
              activeTab === t
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t === 'report' && 'Report'}
            {t === 'track' && 'Track Case'}
            {t === 'travel_safety' && 'Travel Safety'}
            {t === 'committee' && 'Committee'}
            {t === 'legal_posh' && 'Legal Guide'}
            {t === 'proposal' && 'Proposal & Pitch'}
          </button>
        ))}
      </div>
    </header>
  );
};
