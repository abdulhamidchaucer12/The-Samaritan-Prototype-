import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  MessageSquare,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ThumbsUp,
  User,
  Shield,
  ShieldCheck,
  BookOpen,
  Filter,
  Send,
  AlertCircle,
  Sparkles,
  MapPin,
  Bell,
  Trash2,
  Pin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  RefreshCw,
  Wifi,
  WifiOff,
  Globe,
  Edit3,
  Check,
  CheckCheck,
  Lightbulb,
  FileQuestion,
  Scale,
} from 'lucide-react';
import { Language, AuthUser, CivicQuestion, AdminNotification, AdminAnswer } from '../types';
import {
  getCivicQuestions,
  saveCivicQuestion,
  answerCivicQuestion,
  toggleQuestionUpvote,
  deleteCivicQuestion,
  getAdminNotifications,
  markNotificationAsRead,
  removeAdminNotification,
  dismissAllAdminAlerts,
  triggerAiOperatorResponse,
  verifyOperatorAnswer,
  editAndVerifyOperatorAnswer,
  findSimilarCivicQuestions,
  isCivicQuestionDuplicate,
} from '../utils/authAndQuestions';
import { isUserAppointedAdmin } from '../utils/adminManagement';
import { InteractiveCivicFaq } from './InteractiveCivicFaq';
import { SuggestionBoxModal } from './SuggestionBoxModal';
import { AdminOnlineStatusBadge } from './AdminOnlineStatusBadge';
import { KfeClearBoxIcon } from './KfeClearBoxIcon';
import { OnlineUsersPresenceBar } from './OnlineUsersPresenceBar';

interface CivicQuestionsHubProps {
  language: Language;
  currentUser: AuthUser | null;
  isOnline?: boolean;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onSelectOffice?: (officeId: string) => void;
  onNavigateToAdmin?: () => void;
  onOpenOnlineModal?: () => void;
  onOpenCommunityFeed?: () => void;
}

export const CivicQuestionsHub: React.FC<CivicQuestionsHubProps> = ({
  language,
  currentUser,
  isOnline = true,
  onOpenAuthModal,
  onSelectOffice,
  onNavigateToAdmin,
  onOpenOnlineModal,
  onOpenCommunityFeed,
}) => {
  const [questions, setQuestions] = useState<CivicQuestion[]>(() => getCivicQuestions());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'answered' | 'pending' | 'my_questions' | 'needs_verification'>('all');
  const [activeHubTab, setActiveHubTab] = useState<'qna' | 'faq'>('qna');
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // New Question Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newCategory, setNewCategory] = useState<CivicQuestion['category']>('county');
  const [newCounty, setNewCounty] = useState('Kwale County');
  const [preferredResponseLanguage, setPreferredResponseLanguage] = useState<Language>(language);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // Real-time Anti-Repetition Detection for Ask Modal
  const similarQuestions = useMemo(() => {
    if (!newTitle.trim() || newTitle.trim().length < 4) return [];
    return findSimilarCivicQuestions(newTitle, newDetails, questions);
  }, [newTitle, newDetails, questions]);

  // Operator AI responding state
  const [isAiGeneratingForQuestionId, setIsAiGeneratingForQuestionId] = useState<string | null>(null);

  // Admin Answering state
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerTextEn, setAnswerTextEn] = useState('');
  const [answerTextSw, setAnswerTextSw] = useState('');
  const [constitutionalArticle, setConstitutionalArticle] = useState('');
  const [recommendedOfficeId, setRecommendedOfficeId] = useState('');

  // Admin Verification & Edit Operator Answer state
  const [editingAnswerKey, setEditingAnswerKey] = useState<string | null>(null); // `${qId}_${ansId}`
  const [editAnswerEn, setEditAnswerEn] = useState('');
  const [editAnswerSw, setEditAnswerSw] = useState('');
  const [editHowToUseEn, setEditHowToUseEn] = useState('');
  const [editHowToUseSw, setEditHowToUseSw] = useState('');
  const [editConstitutionalArticle, setEditConstitutionalArticle] = useState('');
  const [editAdminRemarks, setEditAdminRemarks] = useState('');

  // Quick verify modal/popover state
  const [quickVerifyTarget, setQuickVerifyTarget] = useState<{ qId: string; ansId: string } | null>(null);
  const [quickRemarks, setQuickRemarks] = useState('');

  // Expanded questions state for accordion
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({
    q_1: true,
    q_2: true,
    q_4: true,
  });

  const toggleExpand = (qId: string) => {
    setExpandedQuestionIds((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const refreshQuestions = () => {
    setQuestions(getCivicQuestions());
  };

  // Count unverified Operator responses
  const unverifiedOperatorAnswersCount = useMemo(() => {
    let count = 0;
    questions.forEach((q) => {
      q.answers.forEach((a) => {
        if ((a.answeredBy === 'Operator' || a.isAiGenerated) && !a.isVerified) {
          count++;
        }
      });
    });
    return count;
  }, [questions]);

  const handleFilterNeedsVerification = () => {
    setStatusFilter('needs_verification');
    const newExpanded: Record<string, boolean> = { ...expandedQuestionIds };
    questions.forEach((q) => {
      if (q.answers.some((a) => (a.answeredBy === 'Operator' || a.isAiGenerated) && !a.isVerified)) {
        newExpanded[q.id] = true;
      }
    });
    setExpandedQuestionIds(newExpanded);
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.answers.some((a) =>
          a.answerText.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.answerText.sw.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;

      let matchesStatus = true;
      if (statusFilter === 'answered') {
        matchesStatus = q.status === 'answered';
      } else if (statusFilter === 'pending') {
        matchesStatus = q.status === 'pending';
      } else if (statusFilter === 'my_questions') {
        matchesStatus = currentUser ? q.askedByAnonymousHandle === currentUser.username : false;
      } else if (statusFilter === 'needs_verification') {
        matchesStatus = q.answers.some((a) => (a.answeredBy === 'Operator' || a.isAiGenerated) && !a.isVerified);
      }

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [questions, searchQuery, selectedCategory, statusFilter, currentUser]);

  // Admin Notifications Sync
  const [notificationsVersion, setNotificationsVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setNotificationsVersion((v) => v + 1);
    };
    window.addEventListener('the_samaritan_admin_notification', handleUpdate);
    window.addEventListener('the_samaritan_admin_notification_read', handleUpdate);
    window.addEventListener('the_samaritan_admin_notification_removed', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_admin_notification', handleUpdate);
      window.removeEventListener('the_samaritan_admin_notification_read', handleUpdate);
      window.removeEventListener('the_samaritan_admin_notification_removed', handleUpdate);
    };
  }, []);

  const adminNotifications = useMemo(() => {
    if (currentUser?.role !== 'admin') return [];
    return getAdminNotifications();
  }, [currentUser, questions, notificationsVersion]);

  const unreadAdminNotificationsCount = useMemo(() => {
    if (currentUser?.role !== 'admin') return 0;
    const adminU = (currentUser.username || '').toLowerCase();
    const isFirst = adminU.includes('1');
    return adminNotifications.filter((n) =>
      isFirst ? !n.readByAdmin1 : !n.readByAdmin2
    ).length;
  }, [currentUser, adminNotifications]);

  // Handle Question Submission with Operator Auto-Responder
  const handleAskQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal('register');
      return;
    }

    if (!newTitle.trim() || !newDetails.trim()) return;

    // Strict Anti-Repetition Guard: Check if duplicate already asked
    const existingDuplicate = isCivicQuestionDuplicate(newTitle.trim(), newDetails.trim(), questions);
    if (existingDuplicate) {
      setIsAskModalOpen(false);
      setNewTitle('');
      setNewDetails('');
      setExpandedQuestionIds((prev) => ({ ...prev, [existingDuplicate.id]: true }));
      setSubmitSuccessNotice(
        language === 'en'
          ? `Anti-Repetition Alert: This question has already been asked on The Samaritan: "${existingDuplicate.title}". To avoid repetition, we have directed you straight to the existing answer thread!`
          : `Tahadhari ya Kuzuia Marudio: Swali hili tayari liliulizwa: "${existingDuplicate.title}". Ili kuzuia kurudia maswali, tumekupeleka moja kwa moja kwenye jibu husika!`
      );
      setTimeout(() => setSubmitSuccessNotice(null), 10000);
      return;
    }

    const createdQuestion = saveCivicQuestion({
      title: newTitle.trim(),
      details: newDetails.trim(),
      category: newCategory,
      locationCounty: newCounty.trim() || undefined,
      askedByAnonymousHandle: currentUser.username,
    });

    refreshQuestions();
    setIsAskModalOpen(false);
    setNewTitle('');
    setNewDetails('');

    // Automatically expand the newly created question in the feed
    setExpandedQuestionIds((prev) => ({ ...prev, [createdQuestion.id]: true }));

    const userIsOnline = isOnline ?? (typeof navigator !== 'undefined' ? navigator.onLine : true);

    if (userIsOnline) {
      setIsAiGeneratingForQuestionId(createdQuestion.id);
      setSubmitSuccessNotice(
        language === 'en'
          ? `Question submitted anonymously under ${currentUser.username}! Operator is consulting the Constitution of Kenya 2010 to provide an immediate answer in layman's language (${preferredResponseLanguage === 'sw' ? 'Kiswahili' : 'English'})...`
          : `Swali limewasilishwa chini ya ${currentUser.username}! Opereta anachunguza Katiba ya Kenya 2010 ili kutoa jibu mara moja kwa lugha rahisi (${preferredResponseLanguage === 'sw' ? 'Kiswahili' : 'Kiingereza'})...`
      );

      try {
        await triggerAiOperatorResponse(createdQuestion, preferredResponseLanguage);
        refreshQuestions();
        setSubmitSuccessNotice(
          language === 'en'
            ? `Operator has automatically responded with an accessible constitutional breakdown in layman's language! Admin 1 and Admin 2 have also received email notifications for subsequent review.`
            : `Opereta ametoa jibu la kikatiba mara moja kwa lugha rahisi ya mwananchi! Wasimamizi (Admin 1 na Admin 2) pia wamepata arifa za barua pepe kwa ajili ya mapitio zaidi.`
        );
      } catch (err) {
        console.error('Operator auto-response error:', err);
      } finally {
        setIsAiGeneratingForQuestionId(null);
      }
    } else {
      setSubmitSuccessNotice(
        language === 'en'
          ? `Question submitted anonymously under ${currentUser.username}! You are currently offline. Operator will formulate an answer once you reconnect, and dual email notifications have been logged for Admin 1 and Admin 2.`
          : `Swali limewasilishwa kwa usalama chini ya ${currentUser.username}! Haupo mtandaoni kwa sasa. Opereta atatoa jibu mara tu ukiunganishwa mtandaoni, na arifa zimetumwa kwa Wasimamizi wote wawili.`
      );
    }

    setTimeout(() => {
      setSubmitSuccessNotice(null);
    }, 10000);
  };

  // Manual trigger for Operator answer on any question
  const handleTriggerOperatorForQuestion = async (q: CivicQuestion) => {
    setIsAiGeneratingForQuestionId(q.id);
    setExpandedQuestionIds((prev) => ({ ...prev, [q.id]: true }));
    try {
      await triggerAiOperatorResponse(q, language);
      refreshQuestions();
    } catch (err) {
      console.error('Failed to trigger Operator answer:', err);
    } finally {
      setIsAiGeneratingForQuestionId(null);
    }
  };

  // Handle Admin Submitting Answer
  const handleAdminAnswerSubmit = (qId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (!answerTextEn.trim()) return;

    const adminName = currentUser.username as 'Admin 1' | 'Admin 2';

    answerCivicQuestion(qId, {
      answeredBy: adminName,
      answerEn: answerTextEn.trim(),
      answerSw: answerTextSw.trim() || answerTextEn.trim(),
      constitutionalArticle: constitutionalArticle.trim() || undefined,
      recommendedOfficeId: recommendedOfficeId.trim() || undefined,
    });

    refreshQuestions();
    setAnsweringQuestionId(null);
    setAnswerTextEn('');
    setAnswerTextSw('');
    setConstitutionalArticle('');
    setRecommendedOfficeId('');
  };

  const handleUpvote = (qId: string) => {
    toggleQuestionUpvote(qId);
    refreshQuestions();
  };

  const handleQuickVerify = (qId: string, ansId: string, remarks?: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    verifyOperatorAnswer(qId, ansId, currentUser.username as 'Admin 1' | 'Admin 2', remarks);
    refreshQuestions();
    setQuickVerifyTarget(null);
    setQuickRemarks('');
    setSubmitSuccessNotice(
      language === 'en'
        ? `Operator response verified successfully by ${currentUser.username}.`
        : `Jibu la Opereta limethibitishwa rasmi na ${currentUser.username}.`
    );
  };

  const handleStartEditAnswer = (qId: string, ans: AdminAnswer) => {
    setEditingAnswerKey(`${qId}_${ans.id}`);
    setEditAnswerEn(ans.answerText.en);
    setEditAnswerSw(ans.answerText.sw);
    setEditHowToUseEn(ans.howToUseArticles?.en || '');
    setEditHowToUseSw(ans.howToUseArticles?.sw || '');
    setEditConstitutionalArticle(ans.constitutionalArticle || '');
    setEditAdminRemarks(ans.adminRemarks || '');
  };

  const handleSaveEditedAnswer = (qId: string, ansId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (!editAnswerEn.trim()) return;

    editAndVerifyOperatorAnswer(
      qId,
      ansId,
      currentUser.username as 'Admin 1' | 'Admin 2',
      {
        answerEn: editAnswerEn.trim(),
        answerSw: editAnswerSw.trim() || editAnswerEn.trim(),
        constitutionalArticle: editConstitutionalArticle.trim() || undefined,
        howToUseArticles: editHowToUseEn.trim()
          ? {
              en: editHowToUseEn.trim(),
              sw: editHowToUseSw.trim() || editHowToUseEn.trim(),
            }
          : undefined,
        remarks: editAdminRemarks.trim() || undefined,
      }
    );

    refreshQuestions();
    setEditingAnswerKey(null);
    setSubmitSuccessNotice(
      language === 'en'
        ? `Operator response refined and verified successfully by ${currentUser.username}.`
        : `Jibu la Opereta limerekebishwa na kuthibitishwa rasmi na ${currentUser.username}.`
    );
  };

  const isTemporaryAdmin =
    currentUser?.adminLevel === 'temporary' ||
    Boolean(currentUser?.username && isUserAppointedAdmin(currentUser.username));

  const handleDelete = (qId: string) => {
    if (isTemporaryAdmin) {
      alert(
        language === 'en'
          ? 'Action Denied: Appointed temporary administrators do not have authorization to delete content.'
          : 'Umezuiliwa: Wasimamizi wa muda hawana mamlaka ya kufuta maudhui yoyote.'
      );
      return;
    }
    if (window.confirm(language === 'en' ? 'Delete this question?' : 'Futa swali hili?')) {
      const res = deleteCivicQuestion(qId, currentUser?.username);
      if (res && !res.success) {
        alert(res.message);
      }
      refreshQuestions();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Top Hub Navigation Bar: Q&A Forum vs Interactive FAQ vs Suggestion Box */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveHubTab('qna')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeHubTab === 'qna'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>{language === 'en' ? 'Citizen Q&A Forum' : 'Kituo cha Maswali ya Wananchi'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {questions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveHubTab('faq')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeHubTab === 'faq'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-700" />
            <span>{language === 'en' ? 'Interactive FAQ' : 'Maswali ya Kawaida (FAQ)'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Accordion
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Admin Online Live Indicator */}
          <AdminOnlineStatusBadge language={language} variant="compact" />

          {/* Platform Suggestion Box Trigger */}
          <button
            onClick={() => setIsSuggestionBoxOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold transition-colors shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'en' ? 'Suggestion Box' : 'Sanduku la Mapendekezo'}</span>
          </button>
        </div>
      </div>

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-blue-900">
        <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Civic Inquiries & Citizen Q&A' : 'Maswali na Majibu ya Wananchi'}</span>
            </div>

            {/* Detailed Admin Online status */}
            <AdminOnlineStatusBadge language={language} variant="compact" className="bg-emerald-950/80 border-emerald-500/40 text-emerald-200" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white leading-tight">
            {language === 'en'
              ? 'Ask Government & Devolution Questions'
              : 'Uliza Kuhusu Serikali, Ugatuzi na Haki Zako'}
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            {language === 'en'
              ? 'Submit questions anonymously about County Governors, MCAs, MPs, CDF funds, village projects, or police accountability. Before even an admin responds, if you are online, our AI Operator instantly analyzes the Constitution of Kenya 2010 and structures the answer in simple layman\'s language in your choice of language. Admin 1 and Admin 2 receive email notifications for verified review.'
              : 'Uliza swali kwa usalama ukitumia jina la siri kuhusu Magavana, Madiwani, Wabunge, fedha za CDF au huduma za polisi. Kabla hata msimamizi hajajibu, ukiwa mtandaoni msaidizi wa AI (Opereta) anachambua Katiba ya Kenya 2010 na kutoa jibu mara moja kwa lugha rahisi ya mwananchi kwa lugha uliyochagua. Wasimamizi (Admin 1 na Admin 2) hupokea arifa za barua pepe.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveHubTab('qna');
                if (!currentUser) {
                  onOpenAuthModal('register');
                } else {
                  setPreferredResponseLanguage(language);
                  setIsAskModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>{language === 'en' ? 'Ask a Civic Question' : 'Uliza Swali la Uraia'}</span>
            </button>

            {/* Quick link to Interactive FAQ */}
            <button
              onClick={() => setActiveHubTab(activeHubTab === 'faq' ? 'qna' : 'faq')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs border border-teal-600 transition-colors shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-teal-300" />
              <span>
                {activeHubTab === 'faq'
                  ? language === 'en'
                    ? 'Back to Citizen Q&A Forum'
                    : 'Rudi kwenye Maswali ya Wananchi'
                  : language === 'en'
                  ? 'Interactive FAQ (Government Literacy)'
                  : 'Maswali ya Kawaida ya Utawala'}
              </span>
            </button>

            {/* Online Status Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}>
              {isOnline ? (
                <>
                  <KfeClearBoxIcon className="w-4 h-4 shrink-0" />
                  <span>{language === 'en' ? 'Operator AI Online' : 'Opereta Yupo Mtandaoni'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'en' ? 'Offline (Queued)' : 'Nje ya Mtandao'}</span>
                </>
              )}
            </div>

            {/* Suggestion Box button in hero */}
            <button
              onClick={() => setIsSuggestionBoxOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'Suggest a Feature' : 'Toa Pendekezo'}</span>
            </button>

            {currentUser?.role === 'admin' && (
              <>
                {onNavigateToAdmin && (
                  <button
                    onClick={onNavigateToAdmin}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs border border-amber-400 transition-colors shadow-xs"
                  >
                    <Shield className="w-4 h-4 text-slate-950" />
                    <span>{language === 'en' ? 'Admin Dashboard' : 'Dashibodi ya Admin'}</span>
                  </button>
                )}
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs border border-blue-600 transition-colors relative"
                >
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span>Admin Alerts Inbox</span>
                  {unreadAdminNotificationsCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {unreadAdminNotificationsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {!currentUser && (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-blue-300" />
                <span>{language === 'en' ? 'Sign In / Admin Access' : 'Ingia / Msimamizi'}</span>
              </button>
            )}

            {currentUser && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-xs font-semibold text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {language === 'en' ? 'Posting as:' : 'Unauliza kama:'}{' '}
                  <strong className="text-white font-mono">{currentUser.username}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Online Users Presence Bar */}
      <OnlineUsersPresenceBar
        currentUser={currentUser}
        language={language}
        onOpenCommunityFeed={onOpenCommunityFeed}
        onOpenOnlineModal={onOpenOnlineModal}
      />

      {/* Success / Status notification banner */}
      <AnimatePresence>
        {submitSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-sm shadow-sm flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
            <div className="grow">
              <strong className="block font-bold">
                {language === 'en' ? 'Civic Inquiry & Constitutional Operator' : 'Swali la Uraia na Msaidizi wa Kikatiba'}
              </strong>
              <p className="text-xs text-indigo-900 mt-0.5 leading-relaxed">{submitSuccessNotice}</p>
            </div>
            <button
              onClick={() => setSubmitSuccessNotice(null)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-950"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Notification Tray (Accessible to Administrators) */}
      <AnimatePresence>
        {currentUser?.role === 'admin' && notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 text-white shadow-xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base text-white">
                    {language === 'en'
                      ? 'Administrative Alerts & Citizen Requests'
                      : 'Taarifa za Usimamizi na Maombi ya Wananchi'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'en'
                      ? 'Requests are automatically removed from this inbox once answered or verified.'
                      : 'Maombi huondolewa kiotomatiki mara tu yanapojibiwa au kuthibitishwa.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {currentUser.username}
                </span>
                {adminNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      dismissAllAdminAlerts();
                      setSubmitSuccessNotice(
                        language === 'en'
                          ? 'All active request alerts have been cleared.'
                          : 'Taarifa zote zimeondolewa.'
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors"
                  >
                    {language === 'en' ? 'Clear Alerts' : 'Futa Zote'}
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {language === 'en'
                ? 'Every citizen question submitted on The Samaritan notifies the administrative team. When an administrator publishes an official answer or certifies the Operator AI guidance, the request is permanently cleared from this alert queue.'
                : 'Kila swali la raia linalowasilishwa linatuma taarifa kwa wasimamizi. Mara tu msimamizi anapochapisha jibu rasmi au kuthibitisha mwongozo wa Opereta, ombi hilo huondolewa mara moja kwenye orodha hii ya arifa.'}
            </p>

            {adminNotifications.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
                <CheckCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-slate-300">
                  {language === 'en'
                    ? 'All incoming requests have been reviewed.'
                    : 'Maombi yote ya wananchi yamepitiwa na kushughulikiwa.'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'en'
                    ? 'New citizen submissions will appear here automatically.'
                    : 'Maswali mapya ya wananchi yataonekana hapa kiotomatiki.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {adminNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-800 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white leading-snug">{notif.questionTitle}</div>
                      <div className="text-slate-400 text-[11px] mt-1 flex items-center gap-2 flex-wrap">
                        <span>
                          By <span className="font-mono text-amber-300">{notif.submittedByHandle}</span>
                        </span>
                        <span>•</span>
                        <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                          {language === 'en' ? 'Needs Review' : 'Inahitaji Mapitio'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          removeAdminNotification(notif.id);
                          setSubmitSuccessNotice(
                            language === 'en'
                              ? `Request "${notif.questionTitle || 'Citizen Inquiry'}" marked as reviewed and removed from alerts.`
                              : `Ombi limetiwa alama ya kupitiwa na kuondolewa kwenye taarifa.`
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1 border border-slate-600"
                        title={language === 'en' ? 'Mark as reviewed and remove from alerts' : 'Weka alama ya kupitiwa na uondoe'}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Mark Reviewed' : 'Ondoa'}</span>
                      </button>
                      <button
                        onClick={() => {
                          markNotificationAsRead(notif.id, currentUser.username);
                          setAnsweringQuestionId(notif.questionId || null);
                          setNotificationsOpen(false);
                          if (notif.questionId) {
                            setExpandedQuestionIds((prev) => ({ ...prev, [notif.questionId!]: true }));
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Answer / Review' : 'Jibu / Kagua'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {activeHubTab === 'faq' ? (
        <InteractiveCivicFaq
          language={language}
          onAskCustomQuestion={() => {
            setActiveHubTab('qna');
            if (!currentUser) {
              onOpenAuthModal('register');
            } else {
              setPreferredResponseLanguage(language);
              setIsAskModalOpen(true);
            }
          }}
          onSelectRelatedQuestion={(qTitle) => {
            setNewTitle(qTitle);
            setActiveHubTab('qna');
            if (!currentUser) {
              onOpenAuthModal('register');
            } else {
              setPreferredResponseLanguage(language);
              setIsAskModalOpen(true);
            }
          }}
        />
      ) : (
        <>
          {/* Admin Operational Review & Verification Console Bar */}
          {currentUser?.role === 'admin' && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 border-2 border-indigo-500/30 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-white">
                    {language === 'en' ? 'Admin Verification & Review Console' : 'Jopo la Uthibitishaji wa Msimamizi'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {currentUser.username}
                  </span>
                  {unverifiedOperatorAnswersCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                      {unverifiedOperatorAnswersCount} {language === 'en' ? 'Awaiting Verification' : 'Zinasubiri Uthibitisho'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {language === 'en' ? 'All Verified' : 'Zote Zimethibitishwa'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {language === 'en'
                    ? 'Review constitutional pre-responses generated by the AI Operator. You can verify them with 1 click, or choose "Edit Before Verification" to refine phrasing, cite local laws, and append official admin remarks.'
                    : 'Kagua majibu ya kikatiba ya Opereta. Unaweza kuyathibitisha kwa kubofya mara moja, au chagua "Hariri Kabla ya Kuthibitisha" kurekebisha vifungu vya sheria na kuweka maoni ya msimamizi.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={handleFilterNeedsVerification}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  statusFilter === 'needs_verification'
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-indigo-700/90 hover:bg-indigo-700 text-white border border-indigo-400/30'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {language === 'en'
                    ? `Review Awaiting (${unverifiedOperatorAnswersCount})`
                    : `Kagua Zinasubiri (${unverifiedOperatorAnswersCount})`}
                </span>
              </button>
              {statusFilter === 'needs_verification' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  {language === 'en' ? 'Show All' : 'Onyesha Yote'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search questions, legal articles, or topics...'
                  : 'Tafuta swali, kifungu cha katiba au mada...'
              }
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          {/* Category selector */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">{language === 'en' ? 'All Categories' : 'Mada Zote'}</option>
              <option value="county">{language === 'en' ? 'County Government & MCAs' : 'Serikali ya Kaunti na Diwani'}</option>
              <option value="national">{language === 'en' ? 'National Government & MPs' : 'Serikali ya Kitaifa na Mbunge'}</option>
              <option value="cdf_funds">{language === 'en' ? 'NG-CDF & Ward Funds' : 'Fedha za CDF na Wadi'}</option>
              <option value="police_rights">{language === 'en' ? 'Police & Human Rights' : 'Polisi na Haki za Binadamu'}</option>
              <option value="participation">{language === 'en' ? 'Public Participation & Access' : 'Ushiriki na Haki ya Taarifa'}</option>
              <option value="integrity">{language === 'en' ? 'Chapter 6 & Corruption' : 'Sura ya 6 na Rushwa'}</option>
            </select>
          </div>

          {/* Status filter tabs */}
          <div className="lg:col-span-4 flex items-center justify-end gap-1 bg-slate-100 p-1 rounded-xl flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'en' ? 'All' : 'Yote'}
            </button>
            <button
              onClick={() => setStatusFilter('answered')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'answered'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'en' ? 'Answered' : 'Yaliyojibiwa'}
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={handleFilterNeedsVerification}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  statusFilter === 'needs_verification'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-amber-800 hover:text-amber-900 bg-amber-50'
                }`}
                title="Questions with AI Operator answers awaiting administrative sign-off"
              >
                <Clock className="w-3 h-3 text-amber-700" />
                <span>{language === 'en' ? 'Needs Verification' : 'Kuhakiki'}</span>
                {unverifiedOperatorAnswersCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-amber-600 text-white text-[10px] font-bold rounded-full">
                    {unverifiedOperatorAnswersCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'en' ? 'Pending' : 'Yanayosubiri'}
            </button>
            {currentUser && currentUser.role !== 'admin' && (
              <button
                onClick={() => setStatusFilter('my_questions')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'my_questions'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'en' ? 'Mine' : 'Yangu'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Feed List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              {language === 'en' ? 'No civic questions match your criteria' : 'Hakuna maswali yanayolingana na utafutaji wako'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {language === 'en'
                ? 'Be the first to ask about this topic. Our AI Operator will instantly respond with constitutional guidance in layman\'s language, followed by administrative review.'
                : 'Kuwa wa kwanza kuuliza swali kuhusu mada hii. Opereta wetu wa AI atatoa jibu la kikatiba mara moja kwa lugha rahisi ya mwananchi.'}
            </p>
            <button
              onClick={() => {
                if (!currentUser) onOpenAuthModal('register');
                else setIsAskModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs"
            >
              {language === 'en' ? 'Ask a Question Now' : 'Uliza Swali Sasa'}
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = !!expandedQuestionIds[q.id];
            const isCurrentlyGenerating = isAiGeneratingForQuestionId === q.id;

            const hasOperatorAnswer = q.answers.some((a) => a.answeredBy === 'Operator');
            const hasAdminAnswer = q.answers.some(
              (a) =>
                a.answeredBy === 'Admin 1' ||
                a.answeredBy === 'Admin 2' ||
                a.answeredBy === 'Admin 3' ||
                a.answeredBy === 'Admin 4' ||
                a.answeredBy?.startsWith('@admin.kfe') ||
                a.answeredBy === 'The_Samaritan'
            );
            const hasUnverifiedOperatorAnswer = q.answers.some(
              (a) => (a.answeredBy === 'Operator' || a.isAiGenerated) && !a.isVerified
            );

            return (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  hasUnverifiedOperatorAnswer && currentUser?.role === 'admin'
                    ? 'border-amber-400 shadow-sm ring-2 ring-amber-200/70'
                    : q.isPinned
                    ? 'border-amber-300 shadow-sm ring-1 ring-amber-200'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Question Header Card */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {q.isPinned && (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Pin className="w-3 h-3 text-amber-700" />
                          <span>Pinned Guidance</span>
                        </span>
                      )}
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                        {q.category.replace('_', ' ')}
                      </span>
                      {q.locationCounty && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>{q.locationCounty}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrentlyGenerating ? (
                        <span className="flex items-center gap-1.5 bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>
                            {language === 'en' ? 'Operator Analyzing Katiba...' : 'Opereta Anachambua Katiba...'}
                          </span>
                        </span>
                      ) : hasOperatorAnswer && hasAdminAnswer ? (
                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {language === 'en' ? 'Operator & Admin Verified' : 'Imejibiwa: Opereta & Admin'}
                          </span>
                        </span>
                      ) : hasOperatorAnswer ? (
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          hasUnverifiedOperatorAnswer
                            ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {hasUnverifiedOperatorAnswer ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>
                                {currentUser?.role === 'admin'
                                  ? language === 'en' ? 'Operator Answer Awaiting Verification' : 'Jibu la Opereta Linasubiri Uthibitisho'
                                  : language === 'en' ? 'Answered by Operator (Awaiting Admin Sign-off)' : 'Imejibiwa na Opereta (Inasubiri Uthibitisho)'}
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>
                                {language === 'en' ? 'Operator Answer Verified' : 'Jibu la Opereta Limethibitishwa'}
                              </span>
                            </>
                          )}
                        </span>
                      ) : hasAdminAnswer ? (
                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {language === 'en' ? 'Answered by Admin' : 'Imejibiwa na Msimamizi'}
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {language === 'en' ? 'Pending Review' : 'Inasubiri Mapitio'}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Details */}
                  <h3
                    onClick={() => toggleExpand(q.id)}
                    className="text-base sm:text-lg font-bold text-slate-900 font-serif leading-snug cursor-pointer hover:text-blue-900 transition-colors mb-2"
                  >
                    {q.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {q.details}
                  </p>

                  {/* Active AI Generation Progress Banner */}
                  {isCurrentlyGenerating && (
                    <div className="mb-4 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                      <div>
                        <strong className="block font-semibold">
                          {language === 'en'
                            ? 'Operator is structuring your answer from the Constitution of Kenya 2010...'
                            : 'Opereta anaiandaa jibu lako kutoka Katiba ya Kenya 2010 kwa lugha rahisi...'}
                        </strong>
                        <span className="text-[11px] text-indigo-700">
                          {language === 'en'
                            ? 'Translating constitutional articles into accessible layman\'s terms.'
                            : 'Kutafsiri vifungu vya kikatiba kwa lugha nyepesi ya mwananchi.'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Citizen Metadata Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-mono font-bold text-[10px] text-slate-700">
                          @
                        </div>
                        <span className="font-mono text-slate-700 font-medium">
                          {q.askedByAnonymousHandle}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvote(q.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold transition-colors"
                        title="Mark as helpful question"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{q.upvotes || 0}</span>
                      </button>

                      {/* If no Operator answer yet and user is online, provide quick button to trigger Operator */}
                      {!hasOperatorAnswer && !isCurrentlyGenerating && isOnline && (
                        <button
                          onClick={() => handleTriggerOperatorForQuestion(q)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold transition-colors"
                          title="Ask Operator AI for immediate constitutional answer in layman's language"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{language === 'en' ? 'Ask Operator' : 'Uliza Opereta'}</span>
                        </button>
                      )}

                      {q.answers.length > 0 && (
                        <button
                          onClick={() => toggleExpand(q.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>
                            {q.answers.length}{' '}
                            {language === 'en' ? 'Answer' : 'Majibu'}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      )}

                      {currentUser?.role === 'admin' && hasUnverifiedOperatorAnswer && (
                        <button
                          onClick={() => {
                            setExpandedQuestionIds((prev) => ({ ...prev, [q.id]: true }));
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
                          title="Review this unverified Operator answer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Review & Verify' : 'Kagua na Thibitisha'}</span>
                        </button>
                      )}

                      {currentUser?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => setAnsweringQuestionId(q.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-bold text-xs hover:bg-blue-950 transition-colors"
                          >
                            {q.answers.length > 0 ? 'Add Note' : 'Answer'}
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answers Section (Accordion Expansion) */}
                <AnimatePresence>
                  {isExpanded && q.answers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50/80 border-t border-slate-200 p-5 sm:p-6 space-y-4"
                    >
                      {q.answers.map((ans) => {
                        const isOperatorAnswer = ans.answeredBy === 'Operator';

                        return (
                          <div
                            key={ans.id}
                            className={`p-5 rounded-2xl shadow-xs relative overflow-hidden transition-all ${
                              isOperatorAnswer
                                ? 'bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 border-2 border-indigo-200'
                                : 'bg-white border border-blue-200'
                            }`}
                          >
                            {/* Answer Header Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2.5">
                                {isOperatorAnswer ? (
                                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-sky-400/40 p-1 flex items-center justify-center shadow-xs">
                                    <KfeClearBoxIcon className="w-6 h-6 shrink-0" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-bold shadow-xs">
                                    <ShieldCheck className="w-4 h-4" />
                                  </div>
                                )}

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                      {isOperatorAnswer ? 'Operator' : ans.answeredBy}
                                    </span>
                                    {isOperatorAnswer ? (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-wide">
                                          AI Constitutional Operator
                                        </span>
                                        {ans.isVerified ? (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            <span>
                                              {language === 'en'
                                                ? `Verified by ${ans.verifiedBy || 'Admin'}`
                                                : `Imethibitishwa na ${ans.verifiedBy || 'Admin'}`}
                                            </span>
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100/80 text-amber-900 border border-amber-200 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-amber-600" />
                                            <span>
                                              {language === 'en' ? 'Awaiting Admin Verification' : 'Inasubiri Uthibitisho wa Admin'}
                                            </span>
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                                        Verified Admin
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    {isOperatorAnswer
                                      ? language === 'en'
                                        ? "Automatic constitutional answer in layman's language • "
                                        : 'Jibu la kiotomatiki la kikatiba kwa lugha rahisi • '
                                      : 'Administrative review • '}
                                    {new Date(ans.answeredAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              {ans.constitutionalArticle && (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                                  <BookOpen className="w-3 h-3 text-amber-700" />
                                  <span>{ans.constitutionalArticle}</span>
                                </span>
                              )}
                            </div>

                            {/* Answer Text in chosen/current language */}
                            {editingAnswerKey === `${q.id}_${ans.id}` ? (
                              /* Admin Inline Editor for Operator Answer */
                              <div className="mt-2 p-4 bg-white rounded-xl border-2 border-indigo-300 shadow-sm space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                                    <Edit3 className="w-3.5 h-3.5 text-indigo-700" />
                                    <span>
                                      {!ans.isVerified
                                        ? language === 'en'
                                          ? `Edit Operator Response Before Verification (${currentUser?.username})`
                                          : `Hariri Jibu la Opereta Kabla ya Kuthibitisha (${currentUser?.username})`
                                        : language === 'en'
                                          ? `Edit Verified Operator Response (${currentUser?.username})`
                                          : `Hariri Jibu Lililothibitishwa la Opereta (${currentUser?.username})`}
                                    </span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setEditingAnswerKey(null)}
                                    className="text-xs text-slate-400 hover:text-slate-700"
                                  >
                                    {language === 'en' ? 'Cancel' : 'Ghairi'}
                                  </button>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                    {language === 'en' ? 'Refined Answer (English) *' : 'Jibu Lililohaririwa (Kiingereza) *'}
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={editAnswerEn}
                                    onChange={(e) => setEditAnswerEn(e.target.value)}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                    {language === 'en' ? 'Refined Answer (Kiswahili)' : 'Jibu Lililohaririwa (Kiswahili)'}
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={editAnswerSw}
                                    onChange={(e) => setEditAnswerSw(e.target.value)}
                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1 flex items-center gap-1.5">
                                    <Scale className="w-3.5 h-3.5 text-amber-700" />
                                    <span>
                                      {language === 'en'
                                        ? 'How to Use These Articles (English Guide)'
                                        : 'Jinsi ya Kutumia Vifungu Hivi (Mwongozo wa Kiingereza)'}
                                    </span>
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={editHowToUseEn}
                                    onChange={(e) => setEditHowToUseEn(e.target.value)}
                                    placeholder="Step-by-step practical citizen instructions on how to invoke and apply the articles..."
                                    className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-amber-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1 flex items-center gap-1.5">
                                    <Scale className="w-3.5 h-3.5 text-amber-700" />
                                    <span>
                                      {language === 'en'
                                        ? 'How to Use These Articles (Kiswahili Guide)'
                                        : 'Jinsi ya Kutumia Vifungu Hivi (Mwongozo wa Kiswahili)'}
                                    </span>
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={editHowToUseSw}
                                    onChange={(e) => setEditHowToUseSw(e.target.value)}
                                    placeholder="Hatua kwa hatua jinsi mwananchi anavyoweza kutumia na kutekeleza vifungu hivi..."
                                    className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-amber-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                      {language === 'en' ? 'Constitutional Article / Reference' : 'Kifungu cha Katiba'}
                                    </label>
                                    <input
                                      type="text"
                                      value={editConstitutionalArticle}
                                      onChange={(e) => setEditConstitutionalArticle(e.target.value)}
                                      placeholder="e.g. Article 185 & PFMA 2012"
                                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                      {language === 'en' ? 'Admin Remarks / Extra Notes (Optional)' : 'Maelezo / Vidokezo vya Ziada vya Admin'}
                                    </label>
                                    <input
                                      type="text"
                                      value={editAdminRemarks}
                                      onChange={(e) => setEditAdminRemarks(e.target.value)}
                                      placeholder="e.g. Approved with addition of Section 87 notification requirements"
                                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingAnswerKey(null)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                                  >
                                    {language === 'en' ? 'Cancel' : 'Ghairi'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditedAnswer(q.id, ans.id)}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>
                                      {language === 'en' ? 'Save & Verify Answer' : 'Hifadhi na Uthibitishe'}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal space-y-2 whitespace-pre-line">
                                  {ans.answerText[language] || ans.answerText.en}
                                </div>

                                {/* Dedicated practical application guide on how the cited articles can be used */}
                                {ans.howToUseArticles && (
                                  <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 text-slate-900 shadow-xs">
                                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-950 mb-2">
                                      <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                                      <span>
                                        {language === 'en'
                                          ? 'How to Use & Apply These Articles in Your Situation:'
                                          : 'Jinsi ya Kutumia Vifungu Hivi Kisheria Katika Hali Yako:'}
                                      </span>
                                    </div>
                                    <div className="text-xs sm:text-sm text-amber-950/90 leading-relaxed whitespace-pre-line space-y-1 font-normal">
                                      {ans.howToUseArticles[language] || ans.howToUseArticles.en}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Extra Admin Remarks / Notes Callout */}
                            {ans.adminRemarks && (
                              <div className="mt-3 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                                    <span>{language === 'en' ? 'Admin Remarks & Guidance' : 'Maelezo na Miongozo ya Admin'}</span>
                                    {ans.verifiedBy && (
                                      <span className="font-normal text-[10px] text-emerald-700 font-mono">
                                        ({ans.verifiedBy})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-emerald-900/90 leading-relaxed font-normal">
                                    {ans.adminRemarks}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Admin Action Controls for Operator Answers */}
                            {currentUser?.role === 'admin' && isOperatorAnswer && editingAnswerKey !== `${q.id}_${ans.id}` && (
                              <div className="mt-3 pt-3 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-2 bg-indigo-50/40 p-2.5 rounded-xl">
                                <div className="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                                  <span>
                                    {language === 'en' ? 'Admin Verification Control:' : 'Uthibitishaji wa Admin:'}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {quickVerifyTarget?.qId === q.id && quickVerifyTarget?.ansId === ans.id ? (
                                    <div className="flex items-center gap-1.5 w-full sm:w-auto mt-1 sm:mt-0">
                                      <input
                                        type="text"
                                        value={quickRemarks}
                                        onChange={(e) => setQuickRemarks(e.target.value)}
                                        placeholder={language === 'en' ? 'Remarks/notes (optional)...' : 'Maoni/vidokezo (hiari)...'}
                                        className="text-xs px-2.5 py-1 border border-indigo-300 rounded-lg bg-white w-48 focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleQuickVerify(q.id, ans.id, quickRemarks)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800"
                                      >
                                        {language === 'en' ? 'Confirm' : 'Thibitisha'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setQuickVerifyTarget(null)}
                                        className="px-2 py-1 rounded-lg border border-slate-300 text-[11px] text-slate-600 hover:bg-white"
                                      >
                                        {language === 'en' ? 'Cancel' : 'Ghairi'}
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      {!ans.isVerified ? (
                                        <button
                                          type="button"
                                          onClick={() => handleQuickVerify(q.id, ans.id)}
                                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                                        >
                                          <Check className="w-3 h-3" />
                                          <span>{language === 'en' ? 'Verify Operator Answer' : 'Thibitisha Jibu la Opereta'}</span>
                                        </button>
                                      ) : null}

                                      <button
                                        type="button"
                                        onClick={() => setQuickVerifyTarget({ qId: q.id, ansId: ans.id })}
                                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100/70 border border-indigo-200 text-indigo-900 text-[11px] font-semibold transition-colors"
                                      >
                                        <span>
                                          {ans.adminRemarks
                                            ? language === 'en' ? 'Update Remarks' : 'Badilisha Maoni'
                                            : language === 'en' ? '+ Add Remarks' : '+ Ongeza Maoni'}
                                        </span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleStartEditAnswer(q.id, ans)}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                        <span>
                                          {ans.isVerified
                                            ? language === 'en' ? 'Edit Verified Answer' : 'Hariri Jibu Lililothibitishwa'
                                            : language === 'en' ? 'Edit Before Verification' : 'Hariri Kabla ya Kuthibitisha'}
                                        </span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Reassurance footer for Operator answers */}
                            {isOperatorAnswer && (
                              <div className="mt-3 pt-2.5 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1.5 text-indigo-900 font-medium">
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>
                                    {language === 'en'
                                      ? 'Responded automatically by Operator before admin review. Dual notifications dispatched to Admin 1 and Admin 2.'
                                      : 'Limetolewa moja kwa moja na Opereta kabla ya majibu ya wasimamizi. Arifa zimetumwa kwa Admin 1 na Admin 2.'}
                                  </span>
                                </span>
                              </div>
                            )}

                            {ans.recommendedOfficeId && onSelectOffice && (
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">
                                  {language === 'en' ? 'Related constitutional office:' : 'Ofisi husika ya kikatiba:'}
                                </span>
                                <button
                                  onClick={() => onSelectOffice(ans.recommendedOfficeId!)}
                                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                                >
                                  <span>View Office Profile</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Admin Answering Form (Inline for Admin 1 / Admin 2) */}
                {answeringQuestionId === q.id && (
                  <div className="p-5 bg-blue-50/70 border-t border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xs text-blue-950 font-serif flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                        <span>
                          Provide Authoritative Civic Answer ({currentUser?.username})
                        </span>
                      </h4>
                      <button
                        onClick={() => setAnsweringQuestionId(null)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Answer in English *
                        </label>
                        <textarea
                          rows={3}
                          value={answerTextEn}
                          onChange={(e) => setAnswerTextEn(e.target.value)}
                          placeholder="Provide detailed constitutional and statutory clarification..."
                          className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Answer in Kiswahili (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={answerTextSw}
                          onChange={(e) => setAnswerTextSw(e.target.value)}
                          placeholder="Maelezo kwa lugha ya Kiswahili..."
                          className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Constitutional Article (e.g. Article 10, Article 185)
                          </label>
                          <input
                            type="text"
                            value={constitutionalArticle}
                            onChange={(e) => setConstitutionalArticle(e.target.value)}
                            placeholder="Article 185 & PFMA Sec. 135"
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Relevant Office ID
                          </label>
                          <input
                            type="text"
                            value={recommendedOfficeId}
                            onChange={(e) => setRecommendedOfficeId(e.target.value)}
                            placeholder="e.g. mca, governor, eacc"
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setAnsweringQuestionId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAdminAnswerSubmit(q.id)}
                          className="px-4 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 shadow-xs"
                        >
                          Publish Verified Answer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* "Ask a Civic Question" Modal */}
      <AnimatePresence>
        {isAskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8"
            >
              <div className="h-1.5 kenya-ribbon" />

              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 font-serif">
                      {language === 'en' ? 'Ask a Civic Question' : 'Uliza Swali la Uraia'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'en'
                        ? 'Operator AI responds instantly online; forwarded to Admin 1 and Admin 2'
                        : 'Opereta wa AI anajibu mara moja mtandaoni; linatumwa kwa Wasimamizi wote wawili'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAskModalOpen(false)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAskQuestionSubmit} className="p-6 space-y-4">
                {/* Anonymous user attribution banner */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>
                      {language === 'en' ? 'Posting anonymously as:' : 'Unauliza kwa jina la siri:'}{' '}
                      <strong className="font-mono">{currentUser?.username}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">100% Private</span>
                </div>

                {/* Operator AI instant response preview notice */}
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl flex items-start gap-2.5 text-xs text-indigo-950">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">
                      {language === 'en'
                        ? 'Immediate AI Operator Response'
                        : 'Jibu la Mara Moja Kutoka kwa Opereta'}
                    </strong>
                    <span className="text-[11px] text-indigo-900 leading-relaxed">
                      {language === 'en'
                        ? "Before even an admin responds, our AI Operator will instantly search the Constitution of Kenya 2010 and structure the answer in simple layman's terms in your preferred language."
                        : 'Kabla hata msimamizi hajajibu, Opereta wetu wa AI atatafuta jibu katika Katiba ya Kenya 2010 na kulitoa kwa lugha rahisi ya mwananchi.'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Question Summary / Headline' : 'Kichwa cha Swali Lako'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'e.g. Who is responsible for repairing the village borehole in Matuga?'
                        : 'mfano: Nani anawajibika kurekebisha kisima cha maji kijijini?'
                    }
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  {/* Real-time Anti-Repetition Sentinel */}
                  {similarQuestions.length > 0 && (
                    <div className="mt-2 p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          {language === 'en'
                            ? 'Anti-Repetition Alert: Similar questions already answered!'
                            : 'Kizuia Marudio: Maswali yanayofanana tayari yapo na yamejibiwa!'}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        {language === 'en'
                          ? 'To prevent repeated inquiries, check if these existing questions solve your issue:'
                          : 'Ili kuepuka kurudia maswali, angalia ikiwa maswali haya yaliyopo yanakidhi hitaji lako:'}
                      </p>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {similarQuestions.slice(0, 3).map((sq) => {
                          const hasAnswer = sq.answers && sq.answers.length > 0;
                          return (
                            <div
                              key={sq.id}
                              className="p-2 bg-white rounded-lg border border-amber-200 shadow-xs flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{sq.title}</p>
                                <span className={`text-[10px] inline-flex items-center gap-1 font-medium ${
                                  hasAnswer ? 'text-emerald-700' : 'text-slate-500'
                                }`}>
                                  {hasAnswer ? '✓ ' + (language === 'en' ? 'Verified answer available' : 'Jibu la kikatiba lipo') : (language === 'en' ? 'In review' : 'Inachunguzwa')}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAskModalOpen(false);
                                  setSearchQuery(sq.title.slice(0, 30));
                                  setExpandedQuestionIds((prev) => ({ ...prev, [sq.id]: true }));
                                }}
                                className="shrink-0 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                {language === 'en' ? 'View Answer' : 'Tazama Jibu'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Detailed Background / Situation' : 'Maelezo Zaidi ya Kisa au Eneo'} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Explain what happened, what public office was approached, and what specific constitutional advice you need...'
                        : 'Eleza kisa kilichotokea, ofisi mliyoiendea na ushauri wa kikatiba mnaohitaji...'
                    }
                    className="w-full text-sm p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Civic Category' : 'Mada ya Swali'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CivicQuestion['category'])}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="county">County Government & MCAs</option>
                      <option value="national">National Government & MPs</option>
                      <option value="cdf_funds">NG-CDF & Ward Fund Allocations</option>
                      <option value="police_rights">Police, Arrests & Human Rights</option>
                      <option value="participation">Public Participation & Access to Info</option>
                      <option value="integrity">Chapter 6 Leadership & Corruption</option>
                      <option value="general">General Constitutional Rights</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'County / Sub-County (Optional)' : 'Kaunti / Wadi (Hiari)'}
                    </label>
                    <input
                      type="text"
                      value={newCounty}
                      onChange={(e) => setNewCounty(e.target.value)}
                      placeholder="e.g. Kwale (Matuga / Kinango / Msambweni)"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Choice of Language for Operator Response */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-700" />
                    <span>
                      {language === 'en'
                        ? 'Choice of Language for Operator Answer'
                        : 'Lugha ya Jibu Utakayopendelea kutoka kwa Opereta'}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredResponseLanguage('en')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                        preferredResponseLanguage === 'en'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                          : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                        {preferredResponseLanguage === 'en' && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </span>
                      <span>English (Layman's Terms)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredResponseLanguage('sw')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                        preferredResponseLanguage === 'sw'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                          : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                        {preferredResponseLanguage === 'sw' && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </span>
                      <span>Kiswahili (Lugha Rahisi)</span>
                    </button>
                  </div>
                </div>

                {/* Email Notification Dispatch Disclaimer */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
                  <Bell className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Dual Admin Email Notification</strong>
                    {language === 'en'
                      ? 'Submitting this question automatically alerts both Admin 1 and Admin 2 via dedicated administrative email notifications for review and verification.'
                      : 'Kutuma swali hili kunatuma arifa za barua pepe kwa Wasimamizi wote wawili (Admin 1 & Admin 2) ili kulikagua na kutoa majibu ya kikatiba.'}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {language === 'en' ? 'Cancel' : 'Ghairi'}
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Submit Question & Get Operator Answer' : 'Wasilisha & Pata Jibu la Opereta'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suggestion Box Modal for proposing new features */}
      <SuggestionBoxModal
        isOpen={isSuggestionBoxOpen}
        onClose={() => setIsSuggestionBoxOpen(false)}
        language={language}
      />
    </div>
  );
};

