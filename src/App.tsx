import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Landmark,
  ArrowLeftRight,
  BookOpen,
  HelpCircle,
  MoreHorizontal,
  CheckSquare,
  Shield,
  Award,
  Presentation,
  Building2,
  X,
  Layers,
  Globe,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { GovernmentExplorer } from './components/GovernmentExplorer';
import { HowGovernmentWorks } from './components/HowGovernmentWorks';
import { LessonsView } from './components/LessonsView';
import { QuizSection } from './components/QuizSection';
import { CitizenActionHub } from './components/CitizenActionHub';
import { OfficeComparison } from './components/OfficeComparison';
import { MyLearningDashboard } from './components/MyLearningDashboard';
import { FacilitatorDemoMode } from './components/FacilitatorDemoMode';
import { FeedbackAndContact } from './components/FeedbackAndContact';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { CivicQuestionsHub } from './components/CivicQuestionsHub';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CivicEventsCalendar } from './components/CivicEventsCalendar';
import { UserNotificationsDrawer } from './components/UserNotificationsDrawer';
import { CivicCommunityFeedModal } from './components/CivicCommunityFeedModal';
import { FloatingCivicGuide } from './components/FloatingCivicGuide';
import { BannedScreen } from './components/BannedScreen';
import { FacilitatorTokensModal } from './components/FacilitatorTokensModal';
import { OnlineUsersModal } from './components/OnlineUsersModal';
import { LoginOnlineUsersToast } from './components/LoginOnlineUsersToast';
import { Language, AuthUser, UserDirectNotification, Theme } from './types';
import { officesData } from './data/officesData';
import { translations } from './data/translations';
import {
  getStoredLanguage,
  setStoredLanguage,
  getStoredTheme,
  setStoredTheme,
  getUserProgress,
  toggleBookmarkOffice,
} from './utils/storage';
import { ThemeToggle } from './components/ThemeToggle';
import {
  getCurrentAuthUser,
  setCurrentAuthUser,
} from './utils/authAndQuestions';
import {
  checkIfUserOrDeviceBanned,
  getUserDirectNotifications,
  checkExpiredTemporaryAdminAppointments,
  sendDailyGuidanceNotificationToAdminIfOnline,
} from './utils/adminManagement';
import { recordUserHeartbeat, getOtherOnlineUsers } from './utils/userPresence';
import {
  recordUserDailyLogin,
  registerSessionVisitIfLoggedIn,
} from './utils/userDailyLogins';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Sync theme with documentElement and localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, [theme]);

  const handleToggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };
  const [offlineModalOpen, setOfflineModalOpen] = useState<boolean>(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState<boolean>(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [comparisonPreselectedId, setComparisonPreselectedId] = useState<string | undefined>(undefined);

  const t = translations[language];

  // Authentication state for anonymous citizens and Admin 1 & Admin 2
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentAuthUser());
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'adminSettings' | 'recover'>('login');
  const [tokensModalOpen, setTokensModalOpen] = useState<boolean>(false);
  const [tokensModalTab, setTokensModalTab] = useState<'overview' | 'share' | 'history'>('overview');
  const [tokensModalRecipient, setTokensModalRecipient] = useState<string>('');
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState<boolean>(false);
  const [communityFeedOpen, setCommunityFeedOpen] = useState<boolean>(false);
  const [communityFeedInitialPeer, setCommunityFeedInitialPeer] = useState<string | null>(null);
  const [onlineUsersModalOpen, setOnlineUsersModalOpen] = useState<boolean>(false);
  const [loginToastOpen, setLoginToastOpen] = useState<boolean>(false);
  const [userNotifications, setUserNotifications] = useState<UserDirectNotification[]>(() => {
    const user = getCurrentAuthUser();
    return getUserDirectNotifications(user?.username);
  });

  const reloadUserNotifications = () => {
    setUserNotifications(getUserDirectNotifications(currentUser?.username));
  };

  // Check and expire temporary admin passes
  useEffect(() => {
    checkExpiredTemporaryAdminAppointments();
    const updated = getCurrentAuthUser();
    if (updated && currentUser && (updated.role !== currentUser.role || updated.adminLevel !== currentUser.adminLevel)) {
      setCurrentUser(updated);
    }
  }, []);

  // Listen for direct notification events & online modal triggers
  useEffect(() => {
    const handleNotifSent = () => {
      reloadUserNotifications();
    };
    const handleOpenTokens = (e: any) => {
      if (e?.detail?.tab) setTokensModalTab(e.detail.tab);
      if (e?.detail?.recipient) setTokensModalRecipient(e.detail.recipient);
      setTokensModalOpen(true);
    };
    const handleOpenOnlineModal = () => {
      setOnlineUsersModalOpen(true);
    };
    const handleOpenDirectChat = (e: any) => {
      if (e?.detail?.peer) {
        setCommunityFeedInitialPeer(e.detail.peer);
        setCommunityFeedOpen(true);
      }
    };
    const handleOpenFeed = () => {
      setCommunityFeedInitialPeer(null);
      setCommunityFeedOpen(true);
    };

    window.addEventListener('the_samaritan_user_notification_sent', handleNotifSent);
    window.addEventListener('open_facilitator_tokens_modal', handleOpenTokens);
    window.addEventListener('open_online_users_modal', handleOpenOnlineModal);
    window.addEventListener('open_direct_chat_with_peer', handleOpenDirectChat);
    window.addEventListener('open_community_feed', handleOpenFeed);
    return () => {
      window.removeEventListener('the_samaritan_user_notification_sent', handleNotifSent);
      window.removeEventListener('open_facilitator_tokens_modal', handleOpenTokens);
      window.removeEventListener('open_online_users_modal', handleOpenOnlineModal);
      window.removeEventListener('open_direct_chat_with_peer', handleOpenDirectChat);
      window.removeEventListener('open_community_feed', handleOpenFeed);
    };
  }, [currentUser?.username]);

  // Track daily login session on initial load or user change
  useEffect(() => {
    if (currentUser?.username) {
      registerSessionVisitIfLoggedIn(currentUser.username);
      if (currentUser.role === 'admin' && currentUser.username !== 'The_Samaritan') {
        const sent = sendDailyGuidanceNotificationToAdminIfOnline(currentUser.username);
        if (sent) {
          reloadUserNotifications();
        }
      }
    }
  }, [currentUser?.username, currentUser?.role]);

  const handleOpenAuthModal = (mode: 'login' | 'register' | 'adminSettings' | 'recover' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentAuthUser(user);
    recordUserDailyLogin(user.username);
    recordUserHeartbeat('Citizen Home');
    if (user.role === 'admin' && user.username !== 'The_Samaritan') {
      sendDailyGuidanceNotificationToAdminIfOnline(user.username);
    }
    setUserNotifications(getUserDirectNotifications(user.username));
    // Immediately show other online users welcome toast so the user sees who is online
    setLoginToastOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAuthUser(null);
    setUserNotifications(getUserDirectNotifications());
    setLoginToastOpen(false);
    recordUserHeartbeat('Citizen Home');
  };

  // User progress state
  const [userProgress, setUserProgress] = useState(() => getUserProgress());

  // Refresh progress helper
  const refreshProgress = () => {
    setUserProgress(getUserProgress(currentUser?.username));
  };

  // Sync user progress whenever currentUser changes or progress is saved
  useEffect(() => {
    refreshProgress();
    const handleProgressUpdate = () => {
      refreshProgress();
    };
    window.addEventListener('the_samaritan_progress_updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('the_samaritan_progress_updated', handleProgressUpdate);
    };
  }, [currentUser?.username]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Refresh progress and send heartbeat whenever tab changes
  useEffect(() => {
    refreshProgress();
    const tabNameMap: Record<string, string> = {
      home: 'Citizen Home',
      explorer: 'Government Explorer',
      compare: 'Office Comparison',
      howGov: 'How Government Works',
      lessons: 'Constitutional Lessons',
      quiz: 'Testing & Certificates',
      qa: 'Civic Questions Hub',
      events: 'Civic Events & Barazas',
      action: 'Citizen Action Hub',
      myLearning: 'My Civic Progress',
      demoMode: 'Facilitator Demo Mode',
      feedback: 'Feedback & Contact',
      admin: 'Admin Dashboard',
    };
    const currentSection = tabNameMap[currentTab] || currentTab;
    recordUserHeartbeat(currentSection);

    // Keep active session alive in real-time for Admin 3, 4, and The_Samaritan monitoring consoles
    const interval = setInterval(() => {
      recordUserHeartbeat(currentSection);
    }, 15000);

    return () => clearInterval(interval);
  }, [currentTab]);

  // Language switch handler
  const handleToggleLanguage = (lang: Language) => {
    setLanguage(lang);
    setStoredLanguage(lang);
  };

  // Tab navigation handler
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOfficeFromHome = (officeId: string) => {
    setSelectedOfficeId(officeId);
    setCurrentTab('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLessonFromHome = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCompare = (officeId: string) => {
    setComparisonPreselectedId(officeId);
    setCurrentTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmarkFromDashboard = (officeId: string) => {
    toggleBookmarkOffice(officeId);
    refreshProgress();
  };

  // Calculate highest quiz score
  const highestQuizScore = Object.values(userProgress.quizScores || {}).reduce(
    (max: number, item: { score: number; total: number; date: string }) =>
      item && typeof item.score === 'number' && item.score > max ? item.score : max,
    0
  );

  // Check if current user or device is banned
  const banStatus = checkIfUserOrDeviceBanned(currentUser?.username);
  if (banStatus.banned) {
    return (
      <BannedScreen
        banRecord={banStatus.record}
        language={language}
        onRefresh={() => window.location.reload()}
      />
    );
  }

  const unreadNotifCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-slate-950 font-sans text-stone-900 dark:text-slate-100 selection:bg-emerald-200 selection:text-emerald-950 app-container transition-colors duration-200">
      {/* App Header with Kenyan Ribbon and KFE Colors */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOnline={isOnline}
        onOpenOfflineModal={() => setOfflineModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenNotifications={() => setNotificationsDrawerOpen(true)}
        unreadNotificationsCount={unreadNotifCount}
        onOpenCommunityFeed={() => setCommunityFeedOpen(true)}
        onOpenOnlineUsersModal={() => setOnlineUsersModalOpen(true)}
        onOpenTokensModal={() => setTokensModalOpen(true)}
      />

      {/* Main Content Area with Smooth Page Animation */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {currentTab === 'home' && (
              <HomeHero
                language={language}
                onSelectTab={handleSelectTab}
                onSelectOffice={handleSelectOfficeFromHome}
                onSelectLesson={handleSelectLessonFromHome}
                currentUser={currentUser}
                onOpenCommunityFeed={() => setCommunityFeedOpen(true)}
                onOpenOnlineModal={() => setOnlineUsersModalOpen(true)}
              />
            )}

            {currentTab === 'explorer' && (
              <GovernmentExplorer
                language={language}
                selectedOfficeId={selectedOfficeId}
                onClearSelectedOffice={() => setSelectedOfficeId(null)}
                onNavigateToCompare={handleNavigateToCompare}
              />
            )}

            {currentTab === 'compare' && (
              <OfficeComparison
                offices={officesData}
                language={language}
                preselectedOfficeId={comparisonPreselectedId}
                onSelectOffice={handleSelectOfficeFromHome}
              />
            )}

            {currentTab === 'howGov' && (
              <HowGovernmentWorks
                language={language}
                onNavigateToExplorer={() => handleSelectTab('explorer')}
              />
            )}

            {currentTab === 'lessons' && (
              <LessonsView
                language={language}
                selectedLessonId={selectedLessonId}
                onClearSelectedLesson={() => setSelectedLessonId(null)}
                onNavigateToQuiz={() => handleSelectTab('quiz')}
              />
            )}

            {currentTab === 'quiz' && (
              <QuizSection
                language={language}
                onNavigateToLessons={() => handleSelectTab('lessons')}
              />
            )}

            {currentTab === 'qa' && (
              <CivicQuestionsHub
                language={language}
                currentUser={currentUser}
                isOnline={isOnline}
                onOpenAuthModal={handleOpenAuthModal}
                onSelectOffice={handleSelectOfficeFromHome}
                onNavigateToAdmin={() => handleSelectTab('admin')}
                onOpenOnlineModal={() => setOnlineUsersModalOpen(true)}
                onOpenCommunityFeed={() => setCommunityFeedOpen(true)}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                language={language}
                currentUser={currentUser}
                onOpenAuthModal={handleOpenAuthModal}
                onNavigateToTab={handleSelectTab}
                onPreviewLesson={(lessonId) => {
                  setSelectedLessonId(lessonId);
                  setCurrentTab('lessons');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'action' && (
              <CitizenActionHub language={language} currentUser={currentUser} />
            )}

            {currentTab === 'events' && (
              <CivicEventsCalendar
                language={language}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'myLearning' && (
              <MyLearningDashboard
                language={language}
                completedLessons={userProgress.completedLessons}
                bookmarkedOfficeIds={userProgress.bookmarkedOffices}
                highestQuizScore={highestQuizScore}
                totalQuizQuestions={10}
                offices={officesData}
                onSelectTab={handleSelectTab}
                onSelectOffice={handleSelectOfficeFromHome}
                onToggleBookmark={handleToggleBookmarkFromDashboard}
                onOpenTokensModal={() => setTokensModalOpen(true)}
                onOpenAuthModal={handleOpenAuthModal}
                onOpenCommunityFeed={() => setCommunityFeedOpen(true)}
                onOpenOnlineModal={() => setOnlineUsersModalOpen(true)}
              />
            )}

            {currentTab === 'demoMode' && (
              <FacilitatorDemoMode
                language={language}
                onToggleLanguage={handleToggleLanguage}
                onExit={() => handleSelectTab('home')}
              />
            )}

            {currentTab === 'feedback' && (
              <FeedbackAndContact
                language={language}
                onSelectTab={handleSelectTab}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* App Footer with KFE Details & Abdulhamid Chaucer credit */}
      <Footer language={language} onSelectTab={handleSelectTab} />

      {/* Mobile Sticky Quick Navigation Bar (Active on phones & tablets) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg md:hidden pb-safe"
      >
        <div className="grid grid-cols-6 h-16 items-center px-1">
          <button
            onClick={() => handleSelectTab('home')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
              {t.nav.home}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('explorer')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentTab === 'explorer' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
              {t.nav.explorer}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('compare')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentTab === 'compare' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
              {t.nav.compare}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('lessons')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentTab === 'lessons' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
              {t.nav.lessons}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('qa')}
            className={`flex flex-col items-center justify-center h-full transition-colors relative ${
              currentTab === 'qa' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
              {t.nav.qa}
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              ['quiz', 'action', 'myLearning', 'howGov', 'demoMode', 'feedback'].includes(currentTab)
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate max-w-full px-0.5">
              {language === 'en' ? 'More' : 'Zaidi'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" Drawer Sheet */}
      <AnimatePresence>
        {mobileMoreOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMoreOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 bg-white rounded-t-3xl p-5 border-t border-slate-200 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto pb-safe"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    {language === 'en' ? 'All Civic Modules' : 'Mifumo Yote ya Kijamii'}
                  </h3>
                </div>
                <button
                  onClick={() => setMobileMoreOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    handleSelectTab('quiz');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[72px] transition-colors ${
                    currentTab === 'quiz'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <CheckSquare className="w-5 h-5 text-emerald-600 mb-2" />
                  <span className="text-xs font-semibold">{t.nav.quiz}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectTab('action');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[72px] transition-colors ${
                    currentTab === 'action'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Shield className="w-5 h-5 text-emerald-600 mb-2" />
                  <span className="text-xs font-semibold">{t.nav.citizenAction}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectTab('howGov');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[72px] transition-colors ${
                    currentTab === 'howGov'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Layers className="w-5 h-5 text-blue-600 mb-2" />
                  <span className="text-xs font-semibold">{t.nav.howGovWorks}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectTab('myLearning');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[72px] transition-colors ${
                    currentTab === 'myLearning'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Award className="w-5 h-5 text-amber-600 mb-2" />
                  <span className="text-xs font-semibold">{t.nav.myLearning}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectTab('demoMode');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[72px] transition-colors ${
                    currentTab === 'demoMode'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Presentation className="w-5 h-5 text-blue-700 mb-2" />
                  <span className="text-xs font-semibold">{t.nav.demoMode}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectTab('feedback');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[72px] transition-colors ${
                    currentTab === 'feedback'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-slate-600 mb-2" />
                  <span className="text-xs font-semibold">{t.nav.feedback}</span>
                </button>

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      handleSelectTab('admin');
                      setMobileMoreOpen(false);
                    }}
                    className={`col-span-2 p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      currentTab === 'admin'
                        ? 'bg-amber-500 border-amber-600 text-slate-950 font-black'
                        : 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-900 fill-current" />
                      <div>
                        <div className="text-xs font-black">{language === 'en' ? 'Administrator Portal' : 'Tovuti ya Wasimamizi'}</div>
                        <div className="text-[10px] text-amber-800 font-normal">Moderation, Lessons & Activity</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-bold">Admin</span>
                  </button>
                )}
              </div>

              {/* Offline, Language & Theme Quick Switcher */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setOfflineModalOpen(true);
                      setMobileMoreOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex-1 justify-center"
                  >
                    {isOnline ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.common.online} • PWA</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.common.offline} Mode</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleToggleLanguage(language === 'en' ? 'sw' : 'en')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 flex-1 justify-center shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-700" />
                    <span>{language === 'en' ? 'Kiswahili' : 'English'}</span>
                  </button>
                </div>

                <ThemeToggle
                  theme={theme}
                  onToggleTheme={handleToggleTheme}
                  language={language}
                  variant="full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offline Management & PWA Modal */}
      <OfflineManagerModal
        isOpen={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
        language={language}
        isOnline={isOnline}
      />

      {/* Direct User Notifications Drawer */}
      <UserNotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={userNotifications}
        language={language}
        onNotificationRead={reloadUserNotifications}
        currentUser={currentUser}
      />

      {/* Civic Community Activity & Follow Network Modal */}
      <CivicCommunityFeedModal
        isOpen={communityFeedOpen}
        onClose={() => {
          setCommunityFeedOpen(false);
          setCommunityFeedInitialPeer(null);
        }}
        currentUser={currentUser}
        language={language}
        onOpenAuthModal={(mode) => handleOpenAuthModal(mode)}
        initialPeer={communityFeedInitialPeer}
      />

      {/* Online Citizens & Administrators Real-time Modal */}
      <OnlineUsersModal
        isOpen={onlineUsersModalOpen}
        onClose={() => setOnlineUsersModalOpen(false)}
        currentUser={currentUser}
        language={language}
        onOpenDirectChat={(targetUsername) => {
          setCommunityFeedInitialPeer(targetUsername);
          setCommunityFeedOpen(true);
        }}
        onOpenCommunityFeed={() => {
          setCommunityFeedInitialPeer(null);
          setCommunityFeedOpen(true);
        }}
      />

      {/* Instant Login Online Welcome Toast Notification */}
      <LoginOnlineUsersToast
        isOpen={loginToastOpen}
        onClose={() => setLoginToastOpen(false)}
        currentUser={currentUser}
        language={language}
        onViewOnlineUsers={() => {
          setLoginToastOpen(false);
          setOnlineUsersModalOpen(true);
        }}
        otherOnlineUsers={getOtherOnlineUsers(currentUser?.username)}
      />

      {/* Anonymous Citizen Account & Admin Access Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        initialMode={authModalMode}
        onOpenTokensModal={() => setTokensModalOpen(true)}
        onOpenCommunityFeed={() => setCommunityFeedOpen(true)}
      />

      {/* Facilitator Tokens & Physical Training Registry Modal */}
      <FacilitatorTokensModal
        isOpen={tokensModalOpen}
        onClose={() => setTokensModalOpen(false)}
        language={language}
        currentUser={currentUser}
        initialTab={tokensModalTab}
        prefilledRecipient={tokensModalRecipient}
      />

      {/* Floating Civic Guides (Role-aware & No-admin-leak for citizens) */}
      <FloatingCivicGuide
        currentUser={currentUser}
        language={language}
        onNavigateTab={handleSelectTab}
      />
    </div>
  );
}
