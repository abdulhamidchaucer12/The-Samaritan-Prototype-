import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme, Language } from '../types';
import { translations } from '../data/translations';

interface ThemeToggleProps {
  theme: Theme;
  onToggleTheme: (newTheme: Theme) => void;
  language: Language;
  variant?: 'compact' | 'full' | 'icon-only';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggleTheme,
  language,
  variant = 'compact',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const t = translations[language];

  const handleToggle = () => {
    onToggleTheme(isDark ? 'light' : 'dark');
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        id="theme-toggle-btn"
        onClick={handleToggle}
        className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center ${
          isDark
            ? 'bg-slate-900 border-amber-500/40 text-amber-400 hover:bg-slate-800 hover:border-amber-400'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
        } ${className}`}
        aria-label={isDark ? t.common.lightMode : t.common.darkMode}
        title={isDark ? t.common.lightMode : t.common.darkMode}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-12 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 hover:text-blue-900 duration-300" />
        )}
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        id="theme-toggle-full-btn"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer min-h-[44px] ${
          isDark
            ? 'bg-slate-900 border-amber-500/30 text-amber-200 hover:bg-slate-850'
            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
        } ${className}`}
        aria-label={isDark ? t.common.lightMode : t.common.darkMode}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold">
              {isDark ? t.common.lightMode : t.common.highContrastDark}
            </div>
            <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isDark ? (language === 'en' ? 'Switch to day palette' : 'Rudi kwenye muonekano wa mchana') : (language === 'en' ? 'Low-light reading & eye comfort' : 'Kusoma gizani kwa utulivu wa macho')}
            </div>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDark
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      </button>
    );
  }

  // Default compact pill switcher
  return (
    <div
      id="theme-toggle-compact-group"
      className={`flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 transition-colors ${className}`}
      role="group"
      aria-label="Theme selection"
    >
      <button
        type="button"
        id="theme-light-btn"
        onClick={() => onToggleTheme('light')}
        className={`flex items-center gap-1.5 px-2 py-1 sm:py-0.5 text-xs font-bold rounded transition-all cursor-pointer ${
          !isDark
            ? 'bg-white text-slate-950 shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title={t.common.lightMode}
        aria-pressed={!isDark}
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
        <span className="text-[11px] hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        id="theme-dark-btn"
        onClick={() => onToggleTheme('dark')}
        className={`flex items-center gap-1.5 px-2 py-1 sm:py-0.5 text-xs font-bold rounded transition-all cursor-pointer ${
          isDark
            ? 'bg-slate-800 text-amber-300 shadow-xs border border-slate-700'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title={t.common.highContrastDark}
        aria-pressed={isDark}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-slate-400'}`} />
        <span className="text-[11px] hidden sm:inline">Dark</span>
      </button>
    </div>
  );
};
