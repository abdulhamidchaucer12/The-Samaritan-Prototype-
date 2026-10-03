import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Globe,
  Wifi,
  WifiOff,
  BookOpen,
  Search,
  CheckCircle,
  HelpCircle,
  Shield,
  DownloadCloud,
  Layers,
  ArrowLeftRight,
  Award,
  Presentation,
  Mail,
  User,
  Bell,
  Calendar,
  Users,
  Coins,
} from 'lucide-react';
import { Language, AuthUser, Theme } from '../types';
import { translations } from '../data/translations';
import { AdminOnlineStatusBadge } from './AdminOnlineStatusBadge';
import { UserBadge } from './UserBadge';
import { ThemeToggle } from './ThemeToggle';
import { getUserTokenBalance } from '../utils/facilitatorTokenRegistry';
import { getActiveUserSessions, subscribeToUserPresence } from '../utils/userPresence';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: (theme: Theme) => void;
  isOnline: boolean;
  onOpenOfflineModal: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: (mode: 'login' | 'register' | 'adminSettings') => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onOpenCommunityFeed?: () => void;
  onOpenTokensModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  isOnline,
  onOpenOfflineModal,
  currentUser,
  onOpenAuthModal,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenCommunityFeed,
  onOpenTokensModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presenceData, setPresenceData] = useState(() => getActiveUserSessions());
  const t = translations[language];

  useEffect(() => {
    const unsub = subscribeToUserPresence(() => {
      setPresenceData(getActiveUserSessions());
    });
    return () => unsub();
  }, []);

  const onlineSessionsCount = presenceData.sessions.filter((s) => s.isOnline).length;

  const primaryNavItems = [
    { id: 'home', label: t.nav.home, icon: Layers },
    { id: 'explorer', label: t.nav.explorer, icon: Search },
    { id: 'compare', label: t.nav.compare, icon: ArrowLeftRight },
    { id: 'howGov', label: t.nav.howGovWorks, icon: Shield },
    { id: 'lessons', label: t.nav.lessons, icon: BookOpen },
    { id: 'quiz', label: t.nav.quiz, icon: CheckCircle },
    { id: 'qa', label: t.nav.qa, icon: HelpCircle, badge: 'New' },
    { id: 'events', label: language === 'en' ? 'Events' : 'Matukio', icon: Calendar },
    { id: 'action', label: t.nav.citizenAction, icon: HelpCircle },
    { id: 'myLearning', label: t.nav.myLearning, icon: Award },
    { id: 'demoMode', label: t.nav.demoMode, icon: Presentation },
    { id: 'feedback', label: t.nav.feedback, icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Kenyan Flag Ribbon at the very top */}
      <div className="kenya-ribbon" />

      {/* Top Banner for KFE, Theme Switcher and Non-partisan Declaration */}
      <div className="bg-slate-950 text-slate-200 px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ThemeToggle
            theme={theme}
            onToggleTheme={onToggleTheme}
            language={language}
            variant="compact"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Admin live online status badge */}
          <AdminOnlineStatusBadge language={language} variant="compact" className="bg-slate-900 border-slate-700 text-slate-200" />

          <button
            onClick={onOpenOfflineModal}
            className="flex items-center gap-1.5 bg-blue-900/60 hover:bg-blue-900 text-blue-100 px-2.5 py-0.5 rounded text-xs transition-colors border border-blue-800"
            title="PWA Offline Storage Pack"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t.common.online}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.common.offline}</span>
              </>
            )}
            <DownloadCloud className="w-3 h-3 ml-0.5 text-blue-200" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand with KFE Identity */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-blue-900">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-950 font-serif">
                  THE SAMARITAN
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                  KENYA
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium tracking-tight truncate max-w-[210px] sm:max-w-xs">
                {language === 'en'
                  ? 'Digital Civic Education Platform • KFE'
                  : 'Elimu ya Uraia na Utawala Bora • KFE'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links (Responsive horizontal scroll / compact) */}
          <nav className="hidden xl:flex items-center space-x-0.5 overflow-x-auto py-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Dashboard dedicated button if admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-900 fill-current" />
                <span>{language === 'en' ? 'Admin Console' : 'Dashibodi'}</span>
              </button>
            )}
          </nav>

          {/* Right Controls: User Profile/Login, Language Switcher & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Online Citizens Button */}
            {onOpenCommunityFeed && (
              <button
                onClick={onOpenCommunityFeed}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-bold transition-all shadow-2xs"
                title={language === 'en' ? `${onlineSessionsCount} citizens active online now` : `Wananchi ${onlineSessionsCount} wako mtandaoni sasa`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Users className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                <span className="font-mono text-[11px]">{onlineSessionsCount}</span>
                <span className="hidden md:inline text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  {language === 'en' ? 'Online' : 'Mtandaoni'}
                </span>
              </button>
            )}

            {/* Direct User Notifications Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                title={language === 'en' ? 'Civic Notifications' : 'Taarifa za Kiraia'}
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Admin Badge Button */}
            {currentUser ? (
              <button
                onClick={() => onOpenAuthModal(currentUser.role === 'admin' ? 'adminSettings' : 'login')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-50 hover:bg-amber-100 text-slate-950 border border-amber-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
                title={currentUser.role === 'admin' ? 'Admin Panel' : 'User Profile'}
              >
                <UserBadge username={currentUser.username} size="xs" showAvatar />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-colors"
              >
                <User className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden sm:inline">{language === 'en' ? 'Sign In / Admin' : 'Ingia'}</span>
              </button>
            )}

            {/* Bilingual English / Kiswahili Switcher Button */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  language === 'en'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('sw')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                  language === 'sw'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                KISW
              </button>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[108px] bg-slate-950/40 backdrop-blur-xs z-30 xl:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="xl:hidden relative z-40 border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-2xl max-h-[calc(100vh-112px)] overflow-y-auto">
            {/* Mobile User Profile Button */}
            <div className="pb-2 mb-2 border-b border-slate-100">
              {currentUser ? (
                <button
                  onClick={() => {
                    onOpenAuthModal(currentUser.role === 'admin' ? 'adminSettings' : 'login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-amber-500 fill-current" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">
                        @
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-mono text-slate-900">{currentUser.username}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {currentUser.role === 'admin' ? 'Administrator' : 'Anonymous Citizen'}
                      </div>
                    </div>
                  </div>
                  <span className="text-blue-900 text-xs font-semibold">Settings →</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <User className="w-4 h-4 text-amber-300" />
                  <span>{language === 'en' ? 'Sign In / Admin Access' : 'Ingia / Msimamizi'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {onOpenCommunityFeed && (
                <button
                  onClick={() => {
                    onOpenCommunityFeed();
                    setMobileMenuOpen(false);
                  }}
                  className="col-span-full flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'en' ? 'Community Activity & Follow Network' : 'Mtandao wa Wananchi na Ufuatiliaji'}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Live</span>
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => {
                    onSelectTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`col-span-full flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-xs font-black transition-all min-h-[44px] ${
                    currentTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-amber-900 fill-current" />
                    <span>{language === 'en' ? 'Administrator Portal & Moderation' : 'Tovuti ya Wasimamizi na Udhibiti'}</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-bold">Admin Only</span>
                </button>
              )}

              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="pt-2">
              <ThemeToggle
                theme={theme}
                onToggleTheme={onToggleTheme}
                language={language}
                variant="full"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="font-semibold text-slate-700">KFE Civic Education</span>
              <button
                onClick={() => {
                  onOpenOfflineModal();
                  setMobileMenuOpen(false);
                }}
                className="text-blue-900 font-bold flex items-center gap-1.5 py-2 px-2.5 rounded-lg hover:bg-blue-50"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>{t.common.offlineReady}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
