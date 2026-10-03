import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Pin,
  Check,
  CheckCheck,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Globe,
  Sparkles,
  Send,
  Download,
  Lock,
  ChevronDown,
  ChevronRight,
  Activity,
  Bell,
  FileText,
  ArrowRight,
  CornerDownRight,
  ThumbsUp,
  Sliders,
  ExternalLink,
  Award,
  BookMarked,
  Bookmark,
  HelpCircle,
  Brain,
  Lightbulb,
  Radio,
  UserPlus,
  UserCheck,
  Heart,
} from 'lucide-react';
import {
  AuthUser,
  Language,
  CivicQuestion,
  AdminAnswer,
  CivicLesson,
  QuizQuestion,
} from '../types';
import {
  getCivicQuestions,
  answerCivicQuestion,
  deleteCivicQuestion,
  verifyOperatorAnswer,
  editAndVerifyOperatorAnswer,
  getRegisteredUsers,
  getAdminNotifications,
  markNotificationAsRead,
  removeAdminNotification,
  dismissAllAdminAlerts,
  changeAdminPassword,
  evaluatePasswordStrength,
} from '../utils/authAndQuestions';
import {
  getActiveUserSessions,
  getAuditLogs,
  recordAuditLog,
  clearAuditLogs,
  ActiveUserSession,
  CivicAuditLogEntry,
  recordUserHeartbeat,
} from '../utils/userPresence';
import {
  getAdminLessons,
  createCustomLesson,
  updateAdminLesson,
  deleteAdminLesson,
  toggleLessonPublishState,
  AdminLessonExtended,
  checkLessonDuplicate,
} from '../utils/lessonManagement';
import {
  getAllCategories,
  addCustomCategory,
  getCategoryLabel,
  CivicCategory,
} from '../utils/categoryManagement';
import { requestOperatorCourseDevelopment } from '../utils/operatorCourseClient';
import { officesData } from '../data/officesData';
import { UserBadge } from './UserBadge';
import { AdminExecutivePanel } from './AdminExecutivePanel';
import { AdminNotification } from '../types';
import {
  getFeatureSuggestions,
  updateSuggestionStatus,
  submitFeatureSuggestion,
  upvoteFeatureSuggestion,
  FeatureSuggestion,
} from '../utils/suggestionBox';
import {
  toggleFollowUser,
  isFollowing,
  getFollowStats,
  recordPublicActivity,
} from '../utils/userFollowSystem';
import { CivicCommunityFeedModal } from './CivicCommunityFeedModal';

interface AdminDashboardProps {
  language: Language;
  currentUser: AuthUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register' | 'adminSettings') => void;
  onNavigateToTab: (tab: string) => void;
  onPreviewLesson?: (lessonId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  currentUser,
  onOpenAuthModal,
  onNavigateToTab,
  onPreviewLesson,
}) => {
  // Admin privileges
  const isTheSamaritan =
    currentUser?.username === 'The_Samaritan' ||
    currentUser?.username === 'The Samaritan' ||
    currentUser?.username === '@The_Samaritan' ||
    currentUser?.adminLevel === 'super';
  const isAdmin3Or4 =
    currentUser?.username === 'Admin 3' ||
    currentUser?.username === 'Admin 4' ||
    currentUser?.username === '@admin.kfe3' ||
    currentUser?.username === '@admin.kfe4' ||
    currentUser?.adminLevel === 'executive' ||
    isTheSamaritan;
  const isTemporaryAdmin = currentUser?.adminLevel === 'temporary';

  // Primary Tabs
  const [activeTab, setActiveTab] = useState<
    'questions' | 'lessons' | 'users' | 'suggestions' | 'security' | 'executive'
  >('questions');

  // Suggestions state (reading all suggestions made by every user including admins)
  const [suggestions, setSuggestions] = useState<FeatureSuggestion[]>(() => getFeatureSuggestions());
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [suggestionAuthorFilter, setSuggestionAuthorFilter] = useState<'all' | 'citizens' | 'admins'>('all');
  const [suggestionStatusFilter, setSuggestionStatusFilter] = useState<string>('all');
  const [suggestionCategoryFilter, setSuggestionCategoryFilter] = useState<string>('all');
  const [suggestionNoteDrafts, setSuggestionNoteDrafts] = useState<{ [id: string]: string }>({});
  const [isSubmittingAdminSuggestion, setIsSubmittingAdminSuggestion] = useState(false);
  const [newAdminSuggTitle, setNewAdminSuggTitle] = useState('');
  const [newAdminSuggCategory, setNewAdminSuggCategory] = useState<FeatureSuggestion['category']>('tools');
  const [newAdminSuggDesc, setNewAdminSuggDesc] = useState('');

  // Presence Filters & Follow Feed
  const [presenceFilter, setPresenceFilter] = useState<'all' | 'online_only' | 'citizens' | 'admins'>('all');
  const [isCommunityFeedModalOpen, setIsCommunityFeedModalOpen] = useState(false);

  // Live data states
  const [questions, setQuestions] = useState<CivicQuestion[]>(() => getCivicQuestions());
  const [lessons, setLessons] = useState<AdminLessonExtended[]>(() => getAdminLessons());
  const [userPresence, setUserPresence] = useState(() => getActiveUserSessions());
  const [auditLogs, setAuditLogs] = useState<CivicAuditLogEntry[]>(() => getAuditLogs());
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => getAdminNotifications());
  const [realtimeAlertBanner, setRealtimeAlertBanner] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Search & Filters for Questions
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionStatusFilter, setQuestionStatusFilter] = useState<'all' | 'needs_review' | 'answered' | 'pinned' | 'ai_unverified'>('all');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>('all');

  // Search & Filters for Lessons
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonCategoryFilter, setLessonCategoryFilter] = useState<string>('all');

  // Modals / Drawers
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [selectedQuestionForAnswer, setSelectedQuestionForAnswer] = useState<CivicQuestion | null>(null);
  const [answerEn, setAnswerEn] = useState('');
  const [answerSw, setAnswerSw] = useState('');
  const [constitutionalArticle, setConstitutionalArticle] = useState('');
  const [recommendedOfficeId, setRecommendedOfficeId] = useState('ombudsman');

  // Edit Answer State
  const [isEditAnswerModalOpen, setIsEditAnswerModalOpen] = useState(false);
  const [isAlertsTrayOpen, setIsAlertsTrayOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<{ questionId: string; answer: AdminAnswer } | null>(null);
  const [editAnswerEn, setEditAnswerEn] = useState('');
  const [editAnswerSw, setEditAnswerSw] = useState('');
  const [editArticle, setEditArticle] = useState('');
  const [editOfficeId, setEditOfficeId] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  // Create Lesson Modal
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [newLessonTitleEn, setNewLessonTitleEn] = useState('');
  const [newLessonTitleSw, setNewLessonTitleSw] = useState('');
  const [newLessonSummaryEn, setNewLessonSummaryEn] = useState('');
  const [newLessonSummarySw, setNewLessonSummarySw] = useState('');
  const [newLessonCategory, setNewLessonCategory] = useState<string>('constitution');
  const [newLessonReadTime, setNewLessonReadTime] = useState(8);
  const [newLessonSectionTitleEn, setNewLessonSectionTitleEn] = useState('');
  const [newLessonSectionTitleSw, setNewLessonSectionTitleSw] = useState('');
  const [newLessonSectionContentEn, setNewLessonSectionContentEn] = useState('');
  const [newLessonSectionContentSw, setNewLessonSectionContentSw] = useState('');
  const [newLessonArticle, setNewLessonArticle] = useState('');
  const [newLessonTipEn, setNewLessonTipEn] = useState('');
  const [newLessonTipSw, setNewLessonTipSw] = useState('');

  // Operator AI Development & Dynamic Category States
  const [availableCategories, setAvailableCategories] = useState<CivicCategory[]>(() => getAllCategories());
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategoryInputEn, setCustomCategoryInputEn] = useState('');
  const [customCategoryInputSw, setCustomCategoryInputSw] = useState('');
  const [isOperatorDeveloping, setIsOperatorDeveloping] = useState(false);
  const [operatorDevelopmentSuccess, setOperatorDevelopmentSuccess] = useState(false);
  const [developedQuizzes, setDevelopedQuizzes] = useState<QuizQuestion[]>([]);
  const [showQuestionsReview, setShowQuestionsReview] = useState(false);

  // Admin Change Password State
  const [currentPassAttempt, setCurrentPassAttempt] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Clock in East Africa Time (EAT - UTC+3)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Africa/Nairobi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' EAT'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic refresh for active online presence and questions
  useEffect(() => {
    recordUserHeartbeat('Admin Dashboard');
    const refreshData = () => {
      setQuestions(getCivicQuestions());
      setLessons(getAdminLessons());
      setUserPresence(getActiveUserSessions());
      setAuditLogs(getAuditLogs());
    };

    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Real-time incoming notification event listener
  useEffect(() => {
    const handleIncomingNotif = (e: any) => {
      setNotifications(getAdminNotifications());
      setQuestions(getCivicQuestions());
      setAuditLogs(getAuditLogs());
      if (e.detail?.message) {
        setRealtimeAlertBanner(e.detail.message);
        setTimeout(() => setRealtimeAlertBanner(null), 9000);
      }
    };
    const handleNotifRead = () => {
      setNotifications(getAdminNotifications());
    };

    window.addEventListener('the_samaritan_admin_notification', handleIncomingNotif);
    window.addEventListener('the_samaritan_admin_notification_read', handleNotifRead);
    window.addEventListener('the_samaritan_admin_notification_removed', handleNotifRead);
    return () => {
      window.removeEventListener('the_samaritan_admin_notification', handleIncomingNotif);
      window.removeEventListener('the_samaritan_admin_notification_read', handleNotifRead);
      window.removeEventListener('the_samaritan_admin_notification_removed', handleNotifRead);
    };
  }, []);

  const handleManualRefresh = () => {
    setQuestions(getCivicQuestions());
    setLessons(getAdminLessons());
    setUserPresence(getActiveUserSessions());
    setAuditLogs(getAuditLogs());
    showToast(language === 'en' ? 'Dashboard telemetry refreshed' : 'Takwimu za usimamizi zimehuishwa');
  };

  // ---------------- SECURITY CHECK: Protected View ---------------- //
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden"
        >
          {/* Top Kenya ribbon & caution banner */}
          <div className="kenya-ribbon h-2" />
          <div className="bg-slate-900 px-6 sm:px-10 py-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center shrink-0">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Restricted Access' : 'Eneo Lililolindwa'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                  {language === 'en' ? 'Administrator Portal' : 'Tovuti ya Wasimamizi'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Kwale Focus Empowerment CBO • The Samaritan Civic Education
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950 text-sm leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Authentication Required to View Governance & Moderation Console'
                    : 'Uthibitishaji Unahitajika Kutazama Dashibodi ya Wasimamizi'}
                </span>
              </p>
              <p className="text-xs text-amber-900">
                {language === 'en'
                  ? 'This protected administrative space is reserved for designated Civic Educators, Legal Reviewers, and County Policy Leads (Admin 1 & Admin 2). It allows content moderation, curriculum editing, and user monitoring.'
                  : 'Sehemu hii imetengwa rasmi kwa ajili ya Wasimamizi wa Elimu ya Uraia na Mapitio ya Sheria (Admin 1 & Admin 2) kwa ajili ya kusimamia maswali ya wananchi, masomo ya katiba na usalama wa mfumo.'}
              </p>
            </div>

            {currentUser && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-500">{language === 'en' ? 'Currently Signed In As:' : 'Umeingia Kama:'}</div>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {currentUser.username} ({currentUser.role})
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  {language === 'en' ? 'Insufficient Privileges' : 'Mamlaka Hayatoshi'}
                </span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="grow flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm transition-all shadow-md active:scale-98"
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>{language === 'en' ? 'Sign In as Administrator' : 'Ingia Kama Msimamizi'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('home')}
                className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors text-center"
              >
                {language === 'en' ? 'Return to Citizen Home' : 'Rudi Nyumbani'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------- AUTHENTICATED ADMIN CONSOLE ---------------- //

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    // Search
    if (questionSearch.trim()) {
      const query = questionSearch.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchDetails = q.details.toLowerCase().includes(query);
      const matchHandle = q.askedByAnonymousHandle.toLowerCase().includes(query);
      const matchCounty = (q.locationCounty || '').toLowerCase().includes(query);
      if (!matchTitle && !matchDetails && !matchHandle && !matchCounty) return false;
    }

    // Category
    if (questionCategoryFilter !== 'all' && q.category !== questionCategoryFilter) {
      return false;
    }

    // Status filter
    if (questionStatusFilter === 'needs_review') {
      const hasAiUnverified = q.answers.some((a) => a.answeredBy === 'Operator' && !a.isVerified);
      const isPending = q.status === 'pending' || q.answers.length === 0;
      return isPending || hasAiUnverified;
    }
    if (questionStatusFilter === 'answered') {
      return q.status === 'answered' && q.answers.length > 0;
    }
    if (questionStatusFilter === 'pinned') {
      return !!q.isPinned;
    }
    if (questionStatusFilter === 'ai_unverified') {
      return q.answers.some((a) => a.answeredBy === 'Operator' && !a.isVerified);
    }

    return true;
  });

  // Filtered Lessons
  const filteredLessons = lessons.filter((l) => {
    if (lessonSearch.trim()) {
      const query = lessonSearch.toLowerCase();
      const matchTitle = l.title.en.toLowerCase().includes(query) || l.title.sw.toLowerCase().includes(query);
      const matchSummary = l.summary.en.toLowerCase().includes(query) || l.summary.sw.toLowerCase().includes(query);
      if (!matchTitle && !matchSummary) return false;
    }

    if (lessonCategoryFilter === 'supplementary') {
      return !!l.isSupplementary || !!l.isCustom;
    }

    if (lessonCategoryFilter !== 'all' && l.category !== lessonCategoryFilter) {
      return false;
    }

    return true;
  });

  // Stats
  const totalQuestions = questions.length;
  const questionsNeedingReview = questions.filter((q) => {
    const hasAiUnverified = q.answers.some((a) => a.answeredBy === 'Operator' && !a.isVerified);
    return q.status === 'pending' || q.answers.length === 0 || hasAiUnverified;
  }).length;
  const totalAiAnswers = questions.reduce((acc, q) => acc + q.answers.filter((a) => a.answeredBy === 'Operator').length, 0);
  const verifiedAiAnswers = questions.reduce((acc, q) => acc + q.answers.filter((a) => a.answeredBy === 'Operator' && a.isVerified).length, 0);

  // 1-Click Verify AI Answer
  const handleQuickVerify = (questionId: string, answerId: string) => {
    const adminName = currentUser.username === 'Admin 2' ? 'Admin 2' : 'Admin 1';
    const updated = verifyOperatorAnswer(questionId, answerId, adminName, 'Approved by Administrator under Constitution of Kenya 2010');
    if (updated) {
      setQuestions(getCivicQuestions());
      setNotifications(getAdminNotifications());
      recordAuditLog(
        'ai_verified',
        'Operator AI Answer Verified',
        `Administrator ${adminName} verified constitutional guidance for question: "${updated.title.slice(0, 45)}..."`,
        adminName
      );
      showToast(language === 'en' ? 'AI Answer verified & certified' : 'Jibu la AI limethibitishwa rasmi');
    }
  };

  // Delete Question
  const handleDeleteQuestion = (questionId: string, title: string, askedBy?: string) => {
    if (isTemporaryAdmin) {
      showToast(
        language === 'en'
          ? 'Action Denied: Appointed temporary administrators cannot delete any content.'
          : 'Mamlaka Yamezuiwa: Wasimamizi wa muda hawana idhini ya kufuta maudhui yoyote.'
      );
      return;
    }
    if (
      (askedBy === 'The_Samaritan' || askedBy === 'The Samaritan') &&
      !isTheSamaritan
    ) {
      showToast(
        language === 'en'
          ? 'Protected Content: Items created by The_Samaritan cannot be deleted by any other user.'
          : 'Maudhui Yamelindwa: Kazi zilizoundwa na The_Samaritan haziwezi kufutwa na mtumiaji mwingine yeyote.'
      );
      return;
    }
    if (!window.confirm(language === 'en' ? `Delete question: "${title}"?` : `Futa swali hili: "${title}"?`)) {
      return;
    }
    const adminName = currentUser.username;
    const res = deleteCivicQuestion(questionId, adminName);
    if (!res.success) {
      showToast(
        res.message ||
          (language === 'en'
            ? 'Action Denied: You cannot delete this question.'
            : 'Huwezi kufuta swali hili.')
      );
      return;
    }
    setQuestions(getCivicQuestions());
    setNotifications(getAdminNotifications());
    recordAuditLog(
      'question_deleted',
      'Civic Question Moderated & Removed',
      `Administrator ${adminName} removed question: "${title.slice(0, 50)}"`,
      adminName
    );
    showToast(language === 'en' ? 'Question deleted' : 'Swali limefutwa');
  };

  // Submit Quick Formal Answer
  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestionForAnswer || !answerEn.trim()) return;

    const adminName = currentUser.username === 'Admin 2' ? 'Admin 2' : 'Admin 1';
    answerCivicQuestion(selectedQuestionForAnswer.id, {
      answeredBy: adminName,
      answerEn: answerEn.trim(),
      answerSw: answerSw.trim() || answerEn.trim(),
      constitutionalArticle: constitutionalArticle.trim() || undefined,
      recommendedOfficeId: recommendedOfficeId || undefined,
    });

    setQuestions(getCivicQuestions());
    setNotifications(getAdminNotifications());
    recordAuditLog(
      'answer_approved',
      'Official Administrative Answer Published',
      `Administrator ${adminName} published verified civic response for: "${selectedQuestionForAnswer.title.slice(0, 45)}..."`,
      adminName
    );

    setIsAnswerModalOpen(false);
    setSelectedQuestionForAnswer(null);
    setAnswerEn('');
    setAnswerSw('');
    setConstitutionalArticle('');
    showToast(language === 'en' ? 'Official answer published' : 'Jibu rasmi limetangazwa kwa wananchi');
  };

  // Submit Edited Answer
  const handleSaveEditAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget || !editAnswerEn.trim()) return;

    const adminName = currentUser.username === 'Admin 2' ? 'Admin 2' : 'Admin 1';
    editAndVerifyOperatorAnswer(editingTarget.questionId, editingTarget.answer.id, adminName, {
      answerEn: editAnswerEn.trim(),
      answerSw: editAnswerSw.trim() || editAnswerEn.trim(),
      constitutionalArticle: editArticle.trim() || undefined,
      recommendedOfficeId: editOfficeId || undefined,
      remarks: editRemarks.trim() || undefined,
    });

    setQuestions(getCivicQuestions());
    setNotifications(getAdminNotifications());
    setIsEditAnswerModalOpen(false);
    setEditingTarget(null);
    showToast(language === 'en' ? 'Answer text updated and verified' : 'Jibu limerekebishwa na kuthibitishwa');
  };

  // Toggle Lesson Publish
  const handleToggleLessonPublish = (lessonId: string) => {
    const newState = toggleLessonPublishState(lessonId, currentUser.username);
    setLessons(getAdminLessons());
    showToast(
      newState
        ? language === 'en' ? 'Lesson Published to Citizens' : 'Somo limetangazwa kwa wananchi'
        : language === 'en' ? 'Lesson Unlisted / Draft' : 'Somo limewekwa rasimu'
    );
  };

  // Delete Custom Lesson
  const handleDeleteLesson = (lessonId: string, title: string, createdBy?: string) => {
    if (isTemporaryAdmin) {
      showToast(
        language === 'en'
          ? 'Action Denied: Appointed temporary administrators cannot delete any curriculum content.'
          : 'Mamlaka Yamezuiwa: Wasimamizi wa muda hawana idhini ya kufuta maudhui ya mtaala.'
      );
      return;
    }
    if (
      (createdBy === 'The_Samaritan' || createdBy === 'The Samaritan') &&
      !isTheSamaritan
    ) {
      showToast(
        language === 'en'
          ? 'Protected Content: Lessons authored by The_Samaritan cannot be deleted by any other user.'
          : 'Maudhui Yamelindwa: Masomo yaliyoundwa na The_Samaritan hayawezi kufutwa na mtumiaji mwingine.'
      );
      return;
    }
    if (!window.confirm(language === 'en' ? `Delete lesson: "${title}"?` : `Futa somo: "${title}"?`)) {
      return;
    }
    const success = deleteAdminLesson(lessonId, currentUser.username);
    if (!success) {
      showToast(
        language === 'en'
          ? 'Action Denied: Content authored by The_Samaritan can only be deleted by The_Samaritan.'
          : 'Mamlaka Yamezuiwa: Maudhui ya The_Samaritan yanaweza kufutwa na akaunti hiyo pekee.'
      );
      return;
    }
    setLessons(getAdminLessons());
    showToast(language === 'en' ? 'Lesson removed' : 'Somo limeondolewa');
  };

  // Add custom category on the fly
  const handleAddNewCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customCategoryInputEn.trim()) {
      showToast(language === 'en' ? 'Category name in English is required' : 'Jina la kitengo kwa Kiingereza linahitajika');
      return;
    }

    try {
      const added = addCustomCategory(customCategoryInputEn, customCategoryInputSw);
      setAvailableCategories(getAllCategories());
      setNewLessonCategory(added.id);
      setIsAddingNewCategory(false);
      setCustomCategoryInputEn('');
      setCustomCategoryInputSw('');
      showToast(
        language === 'en'
          ? `Category "${added.name.en}" registered successfully!`
          : `Kitengo cha "${added.name.sw || added.name.en}" kimesajiliwa kikamilifu!`
      );
    } catch (err: any) {
      showToast(err.message || 'Error creating category');
    }
  };

  // Develop 10 questions and translations with Operator AI
  const handleDevelopTopicWithOperatorAi = async (customTopic?: string) => {
    const topicToUse = (customTopic || newLessonTitleEn).trim();
    if (!topicToUse) {
      showToast(
        language === 'en'
          ? 'Please enter the Course Topic / Title first'
          : 'Tafadhali ingiza mada au jina la somo kwanza'
      );
      return null;
    }

    setIsOperatorDeveloping(true);
    setOperatorDevelopmentSuccess(false);

    try {
      const developed = await requestOperatorCourseDevelopment(
        topicToUse,
        newLessonCategory,
        newLessonSummaryEn,
        newLessonSummarySw,
        language
      );

      // Populate translations and missing fields
      if (!newLessonTitleSw.trim() && developed.title.sw) {
        setNewLessonTitleSw(developed.title.sw);
      }
      if (!newLessonSummaryEn.trim() && developed.summary.en) {
        setNewLessonSummaryEn(developed.summary.en);
      }
      if (!newLessonSummarySw.trim() && developed.summary.sw) {
        setNewLessonSummarySw(developed.summary.sw);
      }
      if (!newLessonSectionTitleEn.trim() && developed.sections[0]?.title.en) {
        setNewLessonSectionTitleEn(developed.sections[0].title.en);
      }
      if (!newLessonSectionTitleSw.trim() && developed.sections[0]?.title.sw) {
        setNewLessonSectionTitleSw(developed.sections[0].title.sw);
      }
      if (!newLessonSectionContentEn.trim() && developed.sections[0]?.content.en) {
        setNewLessonSectionContentEn(developed.sections[0].content.en);
      }
      if (!newLessonSectionContentSw.trim() && developed.sections[0]?.content.sw) {
        setNewLessonSectionContentSw(developed.sections[0].content.sw);
      }
      if (!newLessonArticle.trim() && developed.sections[0]?.constitutionalArticle) {
        setNewLessonArticle(developed.sections[0].constitutionalArticle);
      }
      if (!newLessonTipEn.trim() && developed.citizenActionTip.en) {
        setNewLessonTipEn(developed.citizenActionTip.en);
      }
      if (!newLessonTipSw.trim() && developed.citizenActionTip.sw) {
        setNewLessonTipSw(developed.citizenActionTip.sw);
      }

      setDevelopedQuizzes(developed.quizzes);
      setOperatorDevelopmentSuccess(true);
      setShowQuestionsReview(true);

      showToast(
        language === 'en'
          ? 'Operator AI developed 10 questions, choices & translations!'
          : 'Operator AI imetunga maswali 10, chaguzi na tafsiri zote!'
      );
      return developed;
    } catch (err) {
      console.error('Failed to develop course with Operator AI:', err);
      showToast(language === 'en' ? 'Error developing course with Operator AI' : 'Hitilafu ya Operator AI');
      return null;
    } finally {
      setIsOperatorDeveloping(false);
    }
  };

  // Submit New Custom Supplementary Lesson
  const handleCreateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitleEn.trim()) {
      showToast(language === 'en' ? 'Course topic/title is required' : 'Mada ya somo inahitajika');
      return;
    }

    const dupCheck = checkLessonDuplicate(newLessonTitleEn.trim());
    if (dupCheck.isDuplicate && dupCheck.matchedLesson) {
      showToast(
        language === 'en'
          ? `Anti-Repetition Alert: A course on this topic already exists as Lesson #${dupCheck.matchedLesson.lessonNumber}. Please enter a distinct topic.`
          : `Tahadhari ya Kuzuia Marudio: Somo kuhusu mada hii tayari lipo kama Somo #${dupCheck.matchedLesson.lessonNumber}. Tafadhali chagua mada tofauti.`
      );
      return;
    }

    const adminName = currentUser.username === 'Admin 2' ? 'Admin 2' : 'Admin 1';

    // If Operator AI has not developed the 10 questions yet, trigger it now as soon as the topic is submitted
    let quizzesToAttach = developedQuizzes;
    let titleSw = newLessonTitleSw.trim();
    let summaryEn = newLessonSummaryEn.trim();
    let summarySw = newLessonSummarySw.trim();
    let sectionTitleEn = newLessonSectionTitleEn.trim();
    let sectionTitleSw = newLessonSectionTitleSw.trim();
    let sectionContentEn = newLessonSectionContentEn.trim();
    let sectionContentSw = newLessonSectionContentSw.trim();
    let article = newLessonArticle.trim();
    let tipEn = newLessonTipEn.trim();
    let tipSw = newLessonTipSw.trim();

    if (!quizzesToAttach || quizzesToAttach.length < 10) {
      setIsOperatorDeveloping(true);
      const developed = await handleDevelopTopicWithOperatorAi(newLessonTitleEn.trim());
      setIsOperatorDeveloping(false);

      if (developed) {
        quizzesToAttach = developed.quizzes;
        if (!titleSw) titleSw = developed.title.sw;
        if (!summaryEn) summaryEn = developed.summary.en;
        if (!summarySw) summarySw = developed.summary.sw;
        if (!sectionTitleEn) sectionTitleEn = developed.sections[0]?.title.en || 'Key Constitutional Provisions';
        if (!sectionTitleSw) sectionTitleSw = developed.sections[0]?.title.sw || 'Vifungu Muhimu vya Kikatiba';
        if (!sectionContentEn) sectionContentEn = developed.sections[0]?.content.en || summaryEn;
        if (!sectionContentSw) sectionContentSw = developed.sections[0]?.content.sw || summarySw;
        if (!article) article = developed.sections[0]?.constitutionalArticle || 'Article 10 & 201';
        if (!tipEn) tipEn = developed.citizenActionTip.en || 'Engage with your local county governance structures.';
        if (!tipSw) tipSw = developed.citizenActionTip.sw || 'Shiriki katika miundo ya utawala wa kaunti yako.';
      }
    }

    createCustomLesson(
      {
        title: {
          en: newLessonTitleEn.trim(),
          sw: titleSw || newLessonTitleEn.trim(),
        },
        summary: {
          en: summaryEn || `Comprehensive civic education on ${newLessonTitleEn.trim()}.`,
          sw: summarySw || `Elimu kamili ya kiraia kuhusu ${newLessonTitleEn.trim()}.`,
        },
        category: newLessonCategory,
        readTimeMinutes: Number(newLessonReadTime) || 8,
        isPublished: true,
        isSupplementary: true, // Course is placed in Supplementary Courses (Supplementary Couser)
        developedByAi: true,
        quizzes: quizzesToAttach,
        sections: [
          {
            id: 'sec_1',
            title: {
              en: sectionTitleEn || 'Key Principles & Framework',
              sw: sectionTitleSw || 'Misingi na Mfumo Muhimu',
            },
            content: {
              en: sectionContentEn || summaryEn || 'Detailed civic guidance under the Constitution of Kenya.',
              sw: sectionContentSw || summarySw || 'Mwongozo wa kina wa kikatiba chini ya Katiba ya Kenya.',
            },
            constitutionalArticle: article || 'Article 10, 35 & 201',
          },
        ],
        keyTerms: [
          {
            term: { en: 'Constitutional Governance', sw: 'Utawala wa Kikatiba' },
            definition: {
              en: 'Exercising public authority under the strict checks and balances of the Constitution of Kenya 2010.',
              sw: 'Kutumia mamlaka ya umma chini ya udhibiti na mizania thabiti ya Katiba ya Kenya 2010.',
            },
          },
        ],
        citizenActionTip: {
          en: tipEn || 'Attend public hearings and review county gazettes in Kwale and across Kenya.',
          sw: tipSw || 'Shiriki mikutano ya ushirikishwaji wa umma na kagua matangazo ya kaunti.',
        },
      },
      adminName
    );

    setLessons(getAdminLessons());
    setIsCreateLessonOpen(false);

    // Reset form
    setNewLessonTitleEn('');
    setNewLessonTitleSw('');
    setNewLessonSummaryEn('');
    setNewLessonSummarySw('');
    setNewLessonSectionTitleEn('');
    setNewLessonSectionTitleSw('');
    setNewLessonSectionContentEn('');
    setNewLessonSectionContentSw('');
    setNewLessonArticle('');
    setNewLessonTipEn('');
    setNewLessonTipSw('');
    setDevelopedQuizzes([]);
    setOperatorDevelopmentSuccess(false);
    setShowQuestionsReview(false);

    showToast(
      language === 'en'
        ? 'Supplementary Course published with 10 Operator AI quiz questions!'
        : 'Somo la Ziada limechapishwa na maswali 10 ya Operator AI!'
    );
  };

  // Change Admin Password
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    const adminUsername = currentUser.username as 'Admin 1' | 'Admin 2';
    if (adminUsername !== 'Admin 1' && adminUsername !== 'Admin 2') {
      setPassMsg({ text: 'Unauthorized admin user', isError: true });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassMsg({ text: language === 'en' ? 'New passwords do not match' : 'Nenosiri halilingani', isError: true });
      return;
    }

    const result = changeAdminPassword(adminUsername, currentPassAttempt, newPassInput);
    if (!result.success) {
      setPassMsg({ text: result.message, isError: true });
    } else {
      setPassMsg({ text: result.message, isError: false });
      setCurrentPassAttempt('');
      setNewPassInput('');
      setConfirmPassInput('');
      recordAuditLog('admin_security_changed', `Password changed for ${adminUsername}`, `Security credentials updated by administrator.`, adminUsername);
    }
  };

  // Suggestion moderation handlers
  const handleUpdateSuggestionStatus = (
    suggestionId: string,
    newStatus: FeatureSuggestion['status']
  ) => {
    const note = suggestionNoteDrafts[suggestionId] || undefined;
    updateSuggestionStatus(suggestionId, newStatus, note, currentUser.username);
    setSuggestions(getFeatureSuggestions());
    showToast(
      language === 'en'
        ? `Suggestion marked as "${newStatus.replace('_', ' ')}"`
        : `Hali ya pendekezo imesasishwa kuwa "${newStatus}"`
    );
  };

  const handleSaveSuggestionNote = (suggestionId: string) => {
    const note = suggestionNoteDrafts[suggestionId];
    if (!note || !note.trim()) return;
    const current = suggestions.find((s) => s.id === suggestionId);
    if (!current) return;
    updateSuggestionStatus(
      suggestionId,
      current.status,
      note.trim(),
      currentUser.username
    );
    setSuggestions(getFeatureSuggestions());
    showToast(
      language === 'en'
        ? 'Official administration note saved'
        : 'Ujumbe wa usimamizi umehifadhiwa'
    );
  };

  const handleCreateAdminSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminSuggTitle.trim() || !newAdminSuggDesc.trim()) return;
    submitFeatureSuggestion(
      newAdminSuggTitle.trim(),
      newAdminSuggDesc.trim(),
      newAdminSuggCategory,
      currentUser.username,
      'Administrative Backlog'
    );
    setSuggestions(getFeatureSuggestions());
    setNewAdminSuggTitle('');
    setNewAdminSuggDesc('');
    setIsSubmittingAdminSuggestion(false);
    showToast(
      language === 'en'
        ? `Suggestion submitted by ${currentUser.username} to backlog`
        : `Pendekezo limetumwa kwa orodha ya maoni`
    );
  };

  const handleUpvoteSuggestion = (suggestionId: string) => {
    upvoteFeatureSuggestion(suggestionId, currentUser.username);
    setSuggestions(getFeatureSuggestions());
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0 pb-16">
      {/* Toast notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-slate-950 text-white border border-emerald-500/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <UserBadge username={currentUser.username} size="sm" showRoleLabel />
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentTime || 'Online EAT'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              {language === 'en' ? 'Civic Administration & Moderation Console' : 'Dashibodi ya Usimamizi na Udhibiti wa Uraia'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Authorized oversight for civic questions, curriculum modules, and real-time citizen activity across Kenya.'
                : 'Usimamizi wa maswali ya wananchi, mitaala ya kikatiba, na ufuatiliaji wa wananchi walioko mtandaoni.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAlertsTrayOpen(!isAlertsTrayOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isAlertsTrayOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              }`}
              title="Admin Alerts & Pending Requests"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'Alerts' : 'Arifa'}</span>
              {notifications.length > 0 ? (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                  {notifications.length}
                </span>
              ) : (
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                  0
                </span>
              )}
            </button>

            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-300" />
              <span>{language === 'en' ? 'Refresh' : 'Huisisha'}</span>
            </button>

            <button
              onClick={() => onOpenAuthModal('adminSettings')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors shadow-xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Admin Creds' : 'Nenosiri'}</span>
            </button>

            <button
              onClick={() => onNavigateToTab('qa')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors border border-blue-700"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'View Citizen Q&A' : 'Tazama Q&A'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Admin Alerts Drawer */}
      <AnimatePresence>
        {isAlertsTrayOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/80 shadow-2xl text-white overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base text-white">
                    {language === 'en'
                      ? 'Administrative Alerts & Requests Inbox'
                      : 'Kikasha cha Taarifa na Maombi ya Wananchi'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'en'
                      ? 'Citizen questions and requests are automatically purged from this queue once answered, verified, or moderated.'
                      : 'Maswali na maombi ya wananchi huondolewa kiotomatiki mara tu yanapojibiwa au kuthibitishwa.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      dismissAllAdminAlerts();
                      setNotifications(getAdminNotifications());
                      showToast(
                        language === 'en'
                          ? 'All pending alerts cleared from the inbox.'
                          : 'Taarifa zote zimeondolewa kwenye kikasha.'
                      );
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'en' ? 'Clear All' : 'Futa Zote'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsAlertsTrayOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold"
                >
                  {language === 'en' ? 'Close' : 'Funga'}
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
                <CheckCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-slate-300">
                  {language === 'en'
                    ? 'All citizen inquiry alerts have been reviewed.'
                    : 'Taarifa zote za maombi ya wananchi zimepitiwa.'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'en'
                    ? 'When new inquiries are submitted by citizens, real-time alerts will display here.'
                    : 'Maswali mapya yatakapowasilishwa, yataonekana hapa moja kwa moja.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((notif) => (
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
                          {language === 'en' ? 'Awaiting Review' : 'Inasubiri Mapitio'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          removeAdminNotification(notif.id);
                          setNotifications(getAdminNotifications());
                          showToast(
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
                          setNotifications(getAdminNotifications());
                          setIsAlertsTrayOpen(false);
                          const targetQ = questions.find((q) => q.id === notif.questionId);
                          if (targetQ) {
                            setSelectedQuestionForAnswer(targetQ);
                            setIsAnswerModalOpen(true);
                          } else {
                            setActiveTab('questions');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Review & Answer' : 'Kagua & Jibu'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time incoming administrative alert notification */}
      <AnimatePresence>
        {realtimeAlertBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-between gap-3 shadow-xl border-2 border-amber-400"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-900/80">
                  {language === 'en' ? 'Real-Time Admin Alert' : 'Taarifa ya Moja kwa Moja'}
                </span>
                <span className="text-sm font-extrabold">{realtimeAlertBanner}</span>
              </div>
            </div>
            <button
              onClick={() => setRealtimeAlertBanner(null)}
              className="px-2.5 py-1 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 text-xs font-bold"
            >
              {language === 'en' ? 'Dismiss' : 'Funga'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 High-Contrast KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Online Users */}
        <div
          onClick={() => setActiveTab('users')}
          className="cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {language === 'en' ? 'Learners Online' : 'Walioko Mtandaoni'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
              {userPresence.onlineCount}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {userPresence.totalRecentSessions} {language === 'en' ? 'recent visitor sessions' : 'vikao vya hivi karibuni'}
          </p>
        </div>

        {/* Metric 2: Questions Needing Review */}
        <div
          onClick={() => {
            setActiveTab('questions');
            setQuestionStatusFilter('needs_review');
          }}
          className="cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {language === 'en' ? 'Needs Attention' : 'Inayohitaji Mapitio'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-serif text-amber-900">
              {questionsNeedingReview}
            </span>
            <span className="text-xs text-slate-500">/ {totalQuestions} total</span>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            {questionsNeedingReview > 0 ? (language === 'en' ? 'Pending answers or AI review' : 'Inahitaji jibu au uthibitisho') : 'Queue clear'}
          </p>
        </div>

        {/* Metric 3: Curriculum Lessons */}
        <div
          onClick={() => setActiveTab('lessons')}
          className="cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {language === 'en' ? 'Civic Modules' : 'Masomo ya Uraia'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
              {lessons.length}
            </span>
            <span className="text-xs text-slate-500">
              {lessons.filter((l) => l.isPublished).length} {language === 'en' ? 'live' : 'hewa'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {lessons.filter((l) => l.isCustom).length} {language === 'en' ? 'custom admin modules' : 'masomo maalum'}
          </p>
        </div>

        {/* Metric 4: AI Operator Verification */}
        <div
          onClick={() => {
            setActiveTab('questions');
            setQuestionStatusFilter('ai_unverified');
          }}
          className="cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {language === 'en' ? 'AI Answers Verified' : 'AI Iliyothibitishwa'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-serif text-indigo-950">
              {verifiedAiAnswers}
            </span>
            <span className="text-xs text-slate-500">/ {totalAiAnswers} AI answers</span>
          </div>
          <p className="text-[11px] text-indigo-700 font-semibold mt-1">
            {totalAiAnswers - verifiedAiAnswers > 0
              ? `${totalAiAnswers - verifiedAiAnswers} unverified`
              : 'All certified'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'questions'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'en' ? 'Civic Questions Moderation' : 'Udhibiti wa Maswali'}</span>
          {questionsNeedingReview > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
              {questionsNeedingReview}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'lessons'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'en' ? 'Curriculum & Lessons' : 'Mtaala na Masomo'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
            {lessons.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{language === 'en' ? 'User Activity & Online Presence' : 'Ufuatiliaji wa Wananchi'}</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {userPresence.onlineCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'suggestions'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{language === 'en' ? 'Suggestions & Ideas' : 'Mapendekezo ya Wananchi na Wasimamizi'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
            {suggestions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'en' ? 'Security & Admin Logs' : 'Usalama na Kumbukumbu'}</span>
        </button>

        {isAdmin3Or4 && (
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'executive'
                ? isTheSamaritan
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black shadow-md border border-amber-300'
                  : 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-800" />
            <span>
              {isTheSamaritan
                ? language === 'en'
                  ? 'The Samaritan Executive Console'
                  : 'Dawati Kuu la The Samaritan'
                : currentUser.username === 'Admin 4'
                ? language === 'en'
                  ? 'Executive Director Console'
                  : 'Dawati la Mkurugenzi Mkuu'
                : language === 'en'
                ? 'Project Officer Console'
                : 'Dawati la Afisa wa Miradi'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
              {isTheSamaritan ? 'Super-Authority' : 'Special Privileges'}
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CIVIC QUESTIONS MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Filter / Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative grow">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search question titles, citizen handles, or keywords...'
                      : 'Tafuta mada, jina la raia, au maneno...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setQuestionStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    questionStatusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? 'All' : 'Zote'} ({questions.length})
                </button>
                <button
                  onClick={() => setQuestionStatusFilter('needs_review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    questionStatusFilter === 'needs_review'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {language === 'en' ? 'Needs Review' : 'Mapitio'} ({questionsNeedingReview})
                </button>
                <button
                  onClick={() => setQuestionStatusFilter('ai_unverified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    questionStatusFilter === 'ai_unverified'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                  }`}
                >
                  {language === 'en' ? 'Unverified AI' : 'AI Haijathibitishwa'}
                </button>
                <button
                  onClick={() => setQuestionStatusFilter('pinned')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    questionStatusFilter === 'pinned'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  {language === 'en' ? 'Pinned' : 'Iliyobandikwa'}
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Category:
              </span>
              {[
                { id: 'all', label: language === 'en' ? 'All' : 'Zote' },
                { id: 'county', label: language === 'en' ? 'County / Devolved' : 'Kaunti' },
                { id: 'national', label: language === 'en' ? 'National Government' : 'Kitaifa' },
                { id: 'police_rights', label: language === 'en' ? 'Police & Rights' : 'Polisi na Haki' },
                { id: 'cdf_funds', label: language === 'en' ? 'CDF & Bursaries' : 'CDF' },
                { id: 'integrity', label: language === 'en' ? 'Anti-Corruption' : 'Maadili' },
                { id: 'participation', label: language === 'en' ? 'Public Participation' : 'Ushiriki' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuestionCategoryFilter(c.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    questionCategoryFilter === c.id
                      ? 'bg-blue-100 text-blue-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Moderation List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-bold text-sm text-slate-800">
                  {language === 'en' ? 'No civic questions match this filter' : 'Hakuna maswali yanayolingana na kigezo hiki'}
                </p>
                <p className="text-xs">
                  {language === 'en' ? 'Try adjusting your status or search keywords.' : 'Badili vichungi au maneno ya utafutaji.'}
                </p>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const operatorAnswer = q.answers.find((a) => a.answeredBy === 'Operator');
                const humanAdminAnswers = q.answers.filter((a) => a.answeredBy !== 'Operator');
                const isNeedsAttention = q.status === 'pending' || (operatorAnswer && !operatorAnswer.isVerified);

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                      isNeedsAttention ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Question content */}
                      <div className="space-y-2.5 grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            {q.askedByAnonymousHandle}
                          </span>
                          {q.locationCounty && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {q.locationCounty}
                            </span>
                          )}
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {q.category}
                          </span>
                          {q.isPinned && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                              <Pin className="w-3 h-3" />
                              {language === 'en' ? 'Pinned' : 'Iliyobandikwa'}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-serif font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                          {q.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {q.details}
                        </p>

                        {/* Existing Answers summary */}
                        {q.answers.length > 0 && (
                          <div className="pt-2 space-y-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              {language === 'en' ? 'Existing Responses:' : 'Majibu Yaliyopo:'}
                            </span>

                            {q.answers.map((ans) => {
                              const isAi = ans.answeredBy === 'Operator';
                              return (
                                <div
                                  key={ans.id}
                                  className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 ${
                                    isAi
                                      ? ans.isVerified
                                        ? 'bg-emerald-50/80 border-emerald-300'
                                        : 'bg-amber-50 border-amber-300'
                                      : 'bg-blue-50 border-blue-200'
                                  }`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      {isAi ? (
                                        <Sparkles className="w-4 h-4 text-indigo-600" />
                                      ) : (
                                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                                      )}
                                      <span className="font-bold text-slate-900">
                                        {ans.answeredBy}
                                      </span>
                                      {isAi && (
                                        <span
                                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            ans.isVerified
                                              ? 'bg-emerald-200 text-emerald-950'
                                              : 'bg-amber-200 text-amber-950 animate-pulse'
                                          }`}
                                        >
                                          {ans.isVerified
                                            ? language === 'en'
                                              ? 'Verified by Admin'
                                              : 'Imethibitishwa na Msimamizi'
                                            : language === 'en'
                                            ? 'Pending Admin Verification'
                                            : 'Inasubiri Uthibitisho'}
                                        </span>
                                      )}
                                    </div>

                                    {/* Action buttons for answer */}
                                    <div className="flex items-center gap-2">
                                      {isAi && !ans.isVerified && (
                                        <button
                                          onClick={() => handleQuickVerify(q.id, ans.id)}
                                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
                                        >
                                          <Check className="w-3 h-3" />
                                          <span>{language === 'en' ? 'Certify & Verify' : 'Thibitisha'}</span>
                                        </button>
                                      )}

                                      <button
                                        onClick={() => {
                                          setEditingTarget({ questionId: q.id, answer: ans });
                                          setEditAnswerEn(ans.answerText.en);
                                          setEditAnswerSw(ans.answerText.sw);
                                          setEditArticle(ans.constitutionalArticle || '');
                                          setEditOfficeId(ans.recommendedOfficeId || '');
                                          setEditRemarks(ans.adminRemarks || '');
                                          setIsEditAnswerModalOpen(true);
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-[11px]"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                        <span>{language === 'en' ? 'Edit Text' : 'Hariri'}</span>
                                      </button>
                                    </div>
                                  </div>

                                  <p className="text-slate-800">
                                    {ans.answerText[language]}
                                  </p>

                                  {ans.constitutionalArticle && (
                                    <div className="text-[11px] font-semibold text-blue-900 bg-white/60 p-1.5 rounded border border-slate-200 inline-block">
                                      📜 {ans.constitutionalArticle}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Right: Quick action toolbar */}
                      <div className="shrink-0 flex md:flex-col gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        {/* Answer Button */}
                        <button
                          onClick={() => {
                            setSelectedQuestionForAnswer(q);
                            setIsAnswerModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs transition-colors shadow-2xs whitespace-nowrap"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'en' ? 'Official Reply' : 'Jibu Rasmi'}</span>
                        </button>

                        {/* Delete Question */}
                        {isTemporaryAdmin ? (
                          <div
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-medium text-[11px] cursor-not-allowed whitespace-nowrap"
                            title="Temporary admins cannot delete content"
                          >
                            <Lock className="w-3 h-3" />
                            <span>{language === 'en' ? 'Locked (Temp)' : 'Imefungwa'}</span>
                          </div>
                        ) : (q.askedByAnonymousHandle === 'The_Samaritan' || q.askedByAnonymousHandle === 'The Samaritan') && !isTheSamaritan ? (
                          <div
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium text-[11px] cursor-not-allowed whitespace-nowrap"
                            title="Items authored by The_Samaritan can only be deleted by The_Samaritan"
                          >
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>{language === 'en' ? 'Protected' : 'Imelindwa'}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteQuestion(q.id, q.title, q.askedByAnonymousHandle)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors whitespace-nowrap"
                            title="Delete question and content"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'Delete' : 'Futa'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CURRICULUM & LESSONS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">
                {language === 'en' ? 'Civic Curriculum Repository' : 'Hifadhi ya Masomo ya Kikatiba'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Manage foundational lessons, daily drops, and publish custom localized modules.'
                  : 'Simamia masomo 10 ya msingi, masomo ya kila siku, na machapisho maalum ya mtaala.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCreateLessonOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'en' ? 'Create New Civic Lesson' : 'Tunga Somo Jipya'}</span>
              </button>
            </div>
          </div>

          {/* Search and category filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder={language === 'en' ? 'Search lesson title or topics...' : 'Tafuta mada ya somo...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>
            <select
              value={lessonCategoryFilter}
              onChange={(e) => setLessonCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700"
            >
              <option value="all">{language === 'en' ? 'All Categories' : 'Vitengo Vyote'}</option>
              <option value="supplementary">
                ✨ {language === 'en' ? 'Supplementary Courses' : 'Masomo ya Ziada'}
              </option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name[language] || cat.name.en}
                </option>
              ))}
            </select>
          </div>

          {/* Lessons Grid / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900">
                      Lesson {lesson.lessonNumber} • {getCategoryLabel(lesson.category, language)}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(lesson.isSupplementary || lesson.isCustom) && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          <span>Supplementary</span>
                        </span>
                      )}
                      {lesson.developedByAi && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200 flex items-center gap-1">
                          <Brain className="w-2.5 h-2.5 text-teal-700" />
                          <span>Operator AI (10-Q)</span>
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleLessonPublish(lesson.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                          lesson.isPublished
                            ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {lesson.isPublished ? '● Live' : '○ Draft'}
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                    {lesson.title[language]}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lesson.summary[language]}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.readTimeMinutes} mins
                    </span>
                    <span>•</span>
                    <span>{lesson.sections.length} sections</span>
                    <span>•</span>
                    <span>{lesson.quizzes?.length || 10} quiz items</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => {
                      if (onPreviewLesson) {
                        onPreviewLesson(lesson.id);
                      } else {
                        onNavigateToTab('lessons');
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-950"
                  >
                    <span>{language === 'en' ? 'Learner View' : 'Tazama Somo'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isTemporaryAdmin ? (
                      <span
                        className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed flex items-center gap-1 text-[11px]"
                        title="Temporary admins cannot delete content"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (lesson.author === 'The_Samaritan' || lesson.author === 'The Samaritan') && !isTheSamaritan ? (
                      <span
                        className="p-1 rounded-md text-amber-800 bg-amber-50 border border-amber-200 cursor-not-allowed flex items-center gap-1 text-[10px] font-bold"
                        title="Content authored by The_Samaritan can only be deleted by The_Samaritan"
                      >
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Protected</span>
                      </span>
                    ) : (lesson.isCustom || isAdmin3Or4) ? (
                      <button
                        onClick={() => handleDeleteLesson(lesson.id, lesson.title.en, lesson.author)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        title={isAdmin3Or4 ? 'Executive Authority: Delete Course' : 'Delete custom lesson'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USER ACTIVITY & ONLINE MONITORING */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* The Samaritan Executive Telemetry Banner */}
          {isTheSamaritan && (
            <div className="bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-950 border-2 border-amber-400/50 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                    The Samaritan Omnipresence & Real-Time Citizen Radar
                  </span>
                </div>
                <h3 className="text-lg font-serif font-black text-white">
                  {language === 'en'
                    ? 'Active Citizen Telemetry & Real-Time Engagement Monitor'
                    : 'Ufuatiliaji wa Papo Hapo wa Wananchi na Shughuli Zao'}
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {language === 'en'
                    ? 'Complete visibility into all users connected across Kwale County and national nodes: inspect who is online in real-time and observe the exact constitutional study modules, tests, or civic questions they are actively reading.'
                    : 'Mamlaka kamili ya kuona watumiaji wote walioko mtandaoni kote Kwale na nchini: fuatilia shughuli zao za sasa, masomo, na maswali ya kikatiba wanayoshiriki.'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <button
                  onClick={() => setIsCommunityFeedModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md whitespace-nowrap"
                >
                  <Users className="w-4 h-4" />
                  <span>{language === 'en' ? 'Civic Activity & Follow Network' : 'Mtandao wa Shughuli na Ufuatiliaji'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Online Sessions Monitor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h2 className="text-base font-bold font-serif text-slate-900">
                    {language === 'en' ? 'Live Citizen Presence Telemetry' : 'Ufuatiliaji wa Wananchi Walioko Mtandaoni'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'en'
                    ? 'Active browser sessions tracking exact user engagement with Kenyan civic education modules.'
                    : 'Vikao vilivyo hewani sasa katika masomo na maswali ya katiba.'}
                </p>
              </div>

              {/* Filters & Community Feed trigger */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsCommunityFeedModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 font-bold text-xs transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Follow & Community Feed' : 'Mtandao wa Ufuatiliaji'}</span>
                </button>

                <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  Pulse Window: 5m
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {language === 'en' ? 'Filter Sessions:' : 'Chuja Vikao:'}
              </span>
              {[
                { id: 'all', label: language === 'en' ? `All Sessions (${userPresence.sessions.length})` : `Zote (${userPresence.sessions.length})` },
                { id: 'online_only', label: language === 'en' ? `Online Now (${userPresence.onlineCount})` : `Mtandaoni Sasa (${userPresence.onlineCount})` },
                { id: 'citizens', label: language === 'en' ? `Citizens (${userPresence.sessions.filter(s => s.role !== 'admin').length})` : `Wananchi (${userPresence.sessions.filter(s => s.role !== 'admin').length})` },
                { id: 'admins', label: language === 'en' ? `Admins (${userPresence.sessions.filter(s => s.role === 'admin').length})` : `Wasimamizi (${userPresence.sessions.filter(s => s.role === 'admin').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPresenceFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    presenceFilter === f.id
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Online users table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <th className="py-2.5 px-3">Citizen Handle / Identity</th>
                    <th className="py-2.5 px-3">County / Region</th>
                    <th className="py-2.5 px-3">Current Section</th>
                    <th className="py-2.5 px-3">Exact Activity (What They Are Doing)</th>
                    <th className="py-2.5 px-3">Device & Client</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Activity & Follow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userPresence.sessions
                    .filter((sess) => {
                      if (presenceFilter === 'online_only') return sess.isOnline;
                      if (presenceFilter === 'citizens') return sess.role !== 'admin';
                      if (presenceFilter === 'admins') return sess.role === 'admin';
                      return true;
                    })
                    .map((sess) => {
                      const diffMins = Math.floor((Date.now() - sess.lastActive) / 60000);
                      const isUserFollowed = currentUser ? isFollowing(currentUser.username, sess.username) : false;
                      const isSelf = currentUser?.username === sess.username;

                      return (
                        <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <UserBadge username={sess.username} size="sm" showRoleLabel />
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-medium">
                            <div>
                              <span>{sess.county}</span>
                              {sess.subCounty && (
                                <span className="text-[10px] text-slate-400 block font-normal">
                                  {sess.subCounty}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="bg-blue-50 text-blue-900 border border-blue-200/60 px-2 py-0.5 rounded-md font-semibold text-[11px] whitespace-nowrap">
                              {sess.currentSection}
                            </span>
                          </td>

                          {/* EXACT ACTION / WHAT THEY ARE DOING */}
                          <td className="py-3 px-3">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/70 font-medium text-[11px]">
                              <Activity className="w-3 h-3 text-emerald-600 animate-pulse shrink-0" />
                              <span className="truncate max-w-[220px]" title={sess.currentAction || `Studying ${sess.currentSection}`}>
                                {sess.currentAction || (language === 'en' ? `Engaging with ${sess.currentSection}` : `Akisoma ${sess.currentSection}`)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-600 capitalize">
                            <div className="flex items-center gap-1 text-[11px]">
                              {sess.deviceType === 'mobile' ? (
                                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                              ) : sess.deviceType === 'tablet' ? (
                                <Tablet className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span>{sess.deviceType}</span>
                              {sess.browser && (
                                <span className="text-[10px] text-slate-400">({sess.browser})</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {diffMins === 0 ? 'Just now' : `${diffMins}m ago`}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            {sess.isOnline ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* FOLLOW / INTERACTION BUTTON */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            {!isSelf && currentUser ? (
                              <button
                                onClick={() => {
                                  toggleFollowUser(sess.username, currentUser.username);
                                  showToast(
                                    !isUserFollowed
                                      ? language === 'en' ? `Now following ${sess.username}` : `Unamfuatilia ${sess.username}`
                                      : language === 'en' ? `Unfollowed ${sess.username}` : `Umeacha kumfuatilia ${sess.username}`
                                  );
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                                  isUserFollowed
                                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                                }`}
                              >
                                {isUserFollowed ? (
                                  <>
                                    <UserCheck className="w-3 h-3 text-emerald-700" />
                                    <span>{language === 'en' ? 'Following' : 'Unafuata'}</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="w-3 h-3" />
                                    <span>{language === 'en' ? 'Follow' : 'Fuata'}</span>
                                  </>
                                )}
                              </button>
                            ) : isSelf ? (
                              <span className="text-[10px] text-slate-400 italic font-mono">You</span>
                            ) : (
                              <button
                                onClick={() => onOpenAuthModal('login')}
                                className="text-[10px] text-blue-700 underline"
                              >
                                Sign in to follow
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Event Log Stream */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  {language === 'en' ? 'Platform Audit & Activity Trail' : 'Kumbukumbu ya Matukio ya Mfumo'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Chronological record of citizen inquiries, moderation actions, and quiz certifications.'
                    : 'Mlolongo wa maswali yaliyotumwa, vitendo vya wasimamizi, na vyeti vilivyotolewa.'}
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm(language === 'en' ? 'Clear local audit logs?' : 'Futa kumbukumbu?')) {
                    clearAuditLogs();
                    setAuditLogs([]);
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                {language === 'en' ? 'Clear Log' : 'Safisha Kumbukumbu'}
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div className="grow space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{log.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-500 font-mono">
                      <span>By: {log.performedBy}</span>
                      {log.county && <span>• {log.county}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: CITIZEN & ADMIN SUGGESTIONS (READING ALL SUGGESTIONS BY EVERY USER) */}
      {/* ========================================================================= */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          {/* Header & New Suggestion Prompt */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-purple-700" />
                  </div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    {language === 'en'
                      ? 'Suggestions & Community Ideas Backlog'
                      : 'Mapendekezo ya Wananchi na Wasimamizi'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  {language === 'en'
                    ? 'Review, evaluate, and officially respond to ideas submitted by citizens and fellow administrators across Kenya. As requested for The Samaritan oversight, all suggestions are transparently readable here.'
                    : 'Soma na ujibu mapendekezo yote yaliyotumwa na wananchi na wasimamizi wenzako nchini.'}
                </p>
              </div>

              <button
                onClick={() => setIsSubmittingAdminSuggestion(!isSubmittingAdminSuggestion)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isSubmittingAdminSuggestion
                    ? language === 'en' ? 'Close Form' : 'Funga Fomu'
                    : language === 'en' ? 'Submit Admin Proposal' : 'Wasilisha Pendekezo la Msimamizi'}
                </span>
              </button>
            </div>

            {/* Admin Suggestion Submission Form */}
            {isSubmittingAdminSuggestion && (
              <form
                onSubmit={handleCreateAdminSuggestion}
                className="mt-4 p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                    {language === 'en' ? 'Propose Administrative Feature / Initiative' : 'Pendekeza Kipengele au Mradi Mpya'}
                  </span>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-200/80 px-2 py-0.5 rounded-full">
                    Author: {currentUser.username}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {language === 'en' ? 'Proposal Title' : 'Kichwa cha Pendekezo'}
                    </label>
                    <input
                      type="text"
                      value={newAdminSuggTitle}
                      onChange={(e) => setNewAdminSuggTitle(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'e.g., County Youth Assembly Civic Mock Debates'
                          : 'mfano, Mijadala ya Bunge la Vijana la Kaunti'
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {language === 'en' ? 'Category' : 'Kitengo'}
                    </label>
                    <select
                      value={newAdminSuggCategory}
                      onChange={(e) => setNewAdminSuggCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700"
                    >
                      <option value="curriculum">Curriculum & Education</option>
                      <option value="quiz">Civic Quizzes & Tests</option>
                      <option value="feature">Platform Feature</option>
                      <option value="ui_ux">Design / UI / UX</option>
                      <option value="general">General Governance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'en' ? 'Detailed Description & Civic Justification' : 'Maelezo ya Kina na Umuhimu'}
                  </label>
                  <textarea
                    rows={3}
                    value={newAdminSuggDesc}
                    onChange={(e) => setNewAdminSuggDesc(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Explain how this will empower learners, improve transparency, or expand civic literacy...'
                        : 'Eleza jinsi itakavyowasaidia wananchi na kuboresha utawala...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmittingAdminSuggestion(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs"
                  >
                    Submit to Registry
                  </button>
                </div>
              </form>
            )}

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-3 border-t border-slate-100">
              <div className="relative grow max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                  placeholder={language === 'en' ? 'Search suggestions or authors...' : 'Tafuta mapendekezo...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Submitter role filter */}
                <select
                  value={suggestionAuthorFilter}
                  onChange={(e) => setSuggestionAuthorFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">All Submitters</option>
                  <option value="citizens">Citizen Submissions</option>
                  <option value="admins">Admin Proposals</option>
                </select>

                {/* Status filter */}
                <select
                  value={suggestionStatusFilter}
                  onChange={(e) => setSuggestionStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="received">Received / New</option>
                  <option value="under_review">Under Review</option>
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions
              .filter((s) => {
                if (suggestionStatusFilter !== 'all' && s.status !== suggestionStatusFilter) return false;
                const isAdminAuthor =
                  s.suggestedBy.startsWith('Admin') ||
                  s.suggestedBy.includes('The_Samaritan') ||
                  s.suggestedBy.includes('The Samaritan');
                if (suggestionAuthorFilter === 'citizens' && isAdminAuthor) return false;
                if (suggestionAuthorFilter === 'admins' && !isAdminAuthor) return false;
                if (suggestionSearch.trim()) {
                  const q = suggestionSearch.toLowerCase();
                  return (
                    s.title.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q) ||
                    s.suggestedBy.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((sugg) => {
                const isDrafting = suggestionNoteDrafts[sugg.id] !== undefined;
                const draftText = isDrafting ? suggestionNoteDrafts[sugg.id] : sugg.adminNote || '';
                const isAdminAuthor =
                  sugg.suggestedBy.startsWith('Admin') ||
                  sugg.suggestedBy.includes('The_Samaritan') ||
                  sugg.suggestedBy.includes('The Samaritan');

                return (
                  <div
                    key={sugg.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900">
                            {sugg.category}
                          </span>

                          {/* Status Pill */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sugg.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : sugg.status === 'planned'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : sugg.status === 'under_review'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {sugg.status.replace('_', ' ')}
                          </span>

                          {/* Submitter role pill */}
                          {isAdminAuthor ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              <Shield className="w-3 h-3 text-amber-600" />
                              Administrator Suggestion
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              <Users className="w-3 h-3 text-slate-500" />
                              Citizen Suggestion
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 pt-1">
                          {sugg.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {sugg.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 font-mono">
                          <span>
                            By:{' '}
                            <strong className="text-slate-700 font-sans">
                              {sugg.suggestedBy}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>{new Date(sugg.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-600 font-bold">
                            <ThumbsUp className="w-3 h-3 text-purple-600" />
                            {sugg.votes} {language === 'en' ? 'votes' : 'kura'}
                          </span>
                        </div>
                      </div>

                      {/* Upvote & Action Button */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => handleUpvoteSuggestion(sugg.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-colors"
                          title="Upvote idea"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{sugg.votes}</span>
                        </button>
                      </div>
                    </div>

                    {/* Official Admin Review & Note Section */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 bg-slate-50/70 p-3 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-800" />
                          {language === 'en' ? 'Administrative Moderation & State:' : 'Hali ya Pendekezo na Mapitio:'}
                        </span>

                        {/* Status change actions */}
                        <div className="flex flex-wrap items-center gap-1">
                          {(['received', 'under_review', 'planned', 'completed'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateSuggestionStatus(sugg.id, st)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition-colors ${
                                sugg.status === st
                                  ? 'bg-blue-900 text-white shadow-2xs'
                                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {st.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Official response note input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>
                            {language === 'en' ? 'Official Response / Note for Citizens:' : 'Ujumbe Rasmi wa Usimamizi:'}
                          </span>
                          {sugg.reviewedBy && (
                            <span className="font-mono">
                              Last reviewed by: <strong>{sugg.reviewedBy}</strong>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={draftText}
                            onChange={(e) =>
                              setSuggestionNoteDrafts((prev) => ({
                                ...prev,
                                [sugg.id]: e.target.value,
                              }))
                            }
                            placeholder={
                              language === 'en'
                                ? 'Add official remarks, implementation ETA, or policy considerations...'
                                : 'Weka maelezo rasmi au maendeleo ya pendekezo hili...'
                            }
                            className="grow px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-700"
                          />
                          <button
                            onClick={() => handleSaveSuggestionNote(sugg.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shrink-0"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {suggestions.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <Lightbulb className="w-8 h-8 mx-auto text-purple-300 mb-2" />
                <p className="text-sm font-bold">No suggestions registered yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Submit the first administrative proposal or invite citizens to share their civic recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SECURITY & CREDENTIALS */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Password Change Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {language === 'en' ? 'Update Administrator Password' : 'Badili Nenosiri la Msimamizi'}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentUser.username} • Kwale Focus Empowerment
                </p>
              </div>
            </div>

            {passMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passMsg.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {passMsg.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Current Password' : 'Nenosiri la Sasa'}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassAttempt}
                  onChange={(e) => setCurrentPassAttempt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'New Password (min 8 chars)' : 'Nenosiri Jipya (herufi 8+)'}
                </label>
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Confirm New Password' : 'Thibitisha Nenosiri Jipya'}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {language === 'en' ? 'Save New Password' : 'Hifadhi Nenosiri'}
              </button>
            </form>
          </div>

          {/* Privacy & Governance Architecture Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {language === 'en' ? 'Kenyan Privacy & Legal Standards' : 'Viwango vya Kisheria vya Faragha'}
                </h3>
                <p className="text-xs text-slate-500">
                  Data Protection Act 2019 & Article 31 Compliance
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Anonymous Citizen Handles:</strong> Citizens interact with civic questions using arbitrary handles (e.g. <code>@mwananchi_kwale</code>) without disclosing National ID numbers, telephone contacts, or real names.
              </p>
              <p>
                <strong>No Commercial Tracking:</strong> All telemetry and sessions are stored in local sandbox storage. No analytics or citizen data is sold or shared with external advertising networks.
              </p>
              <p>
                <strong>Constitutional Grounding:</strong> All answers must cite specific articles of the Constitution of Kenya 2010 (e.g., Article 10, Article 35, Article 49, Article 185, Article 201) or specific devolved Acts.
              </p>
            </div>

            {/* Quick Export / Backup */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `the_samaritan_questions_backup_${new Date().toISOString().slice(0, 10)}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showToast('Questions exported as JSON backup');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>{language === 'en' ? 'Export Questions Backup (JSON)' : 'Pakua Nakala ya Maswali (JSON)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EXECUTIVE POWERS CONSOLE (ADMIN 3 & ADMIN 4 ONLY) */}
      {/* ========================================================================= */}
      {activeTab === 'executive' && isAdmin3Or4 && (
        <AdminExecutivePanel
          language={language}
          currentUser={currentUser}
          onRefreshDashboard={handleManualRefresh}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL ADMIN REPLY FORM */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAnswerModalOpen && selectedQuestionForAnswer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-900" />
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {language === 'en' ? 'Publish Official Administrative Response' : 'Chapisha Jibu Rasmi la Msimamizi'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAnswerModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{selectedQuestionForAnswer.title}</div>
                <div className="text-slate-600">{selectedQuestionForAnswer.details}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Asked by {selectedQuestionForAnswer.askedByAnonymousHandle} • {selectedQuestionForAnswer.locationCounty}
                </div>
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Official Answer (English)' : 'Jibu Rasmi (Kiingereza)'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={answerEn}
                    onChange={(e) => setAnswerEn(e.target.value)}
                    placeholder="Under the Constitution of Kenya 2010..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Official Answer (Kiswahili) - Optional' : 'Jibu Rasmi (Kiswahili) - Hiari'}
                  </label>
                  <textarea
                    rows={3}
                    value={answerSw}
                    onChange={(e) => setAnswerSw(e.target.value)}
                    placeholder="Chini ya Katiba ya Kenya 2010..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Constitutional Article Reference' : 'Kifungu cha Katiba'}
                    </label>
                    <input
                      type="text"
                      value={constitutionalArticle}
                      onChange={(e) => setConstitutionalArticle(e.target.value)}
                      placeholder="e.g. Article 10, 185 & 201"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Recommended Office' : 'Ofisi Husika'}
                    </label>
                    <select
                      value={recommendedOfficeId}
                      onChange={(e) => setRecommendedOfficeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="governor">County Governor</option>
                      <option value="mca">Member of County Assembly (MCA)</option>
                      <option value="mp">Member of Parliament (MP)</option>
                      <option value="senator">Senator</option>
                      <option value="ombudsman">Commission on Admin Justice (Ombudsman)</option>
                      <option value="police">National Police Service / IPOA</option>
                      <option value="judiciary">Judiciary / High Court</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAnswerModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md"
                  >
                    {language === 'en' ? 'Publish Verified Response' : 'Chapisha Jibu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: EDIT ANSWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditAnswerModalOpen && editingTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-700" />
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {language === 'en' ? 'Edit & Verify Answer Text' : 'Hariri na Thibitisha Jibu'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditAnswerModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditAnswer} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Answer (English)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editAnswerEn}
                    onChange={(e) => setEditAnswerEn(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Answer (Kiswahili)
                  </label>
                  <textarea
                    rows={3}
                    value={editAnswerSw}
                    onChange={(e) => setEditAnswerSw(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Constitutional Article Citation
                    </label>
                    <input
                      type="text"
                      value={editArticle}
                      onChange={(e) => setEditArticle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Verification Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      placeholder="e.g. Verified by Admin 1 under Article 49"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditAnswerModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-md"
                  >
                    {language === 'en' ? 'Save & Certify Answer' : 'Hifadhi na Thibitisha'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW CIVIC LESSON / SUPPLEMENTARY COURSE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCreateLessonOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                        {language === 'en' ? 'Create Supplementary Course' : 'Tunga Somo la Ziada'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900 border border-purple-200">
                        Supplementary Couser
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'en'
                        ? 'Operator AI automatically generates 10 quiz questions, answer choices, and dual translations as soon as the topic is submitted.'
                        : 'Operator AI itatunga maswali 10, chaguzi zake na tafsiri zote punde mada inapowasilishwa.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateLessonOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Operator AI Live Processing Banner */}
              {isOperatorDeveloping && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-3 text-teal-950 text-xs">
                  <RefreshCw className="w-5 h-5 text-teal-700 animate-spin shrink-0" />
                  <div>
                    <div className="font-bold">
                      {language === 'en'
                        ? 'Operator AI is developing course questions & translations...'
                        : 'Operator AI inatunga maswali na kutafsiri...'}
                    </div>
                    <div className="text-[11px] text-teal-800">
                      {language === 'en'
                        ? 'Generating 10 multiple-choice questions, answer options (A-D), explanations, and Swahili translations grounded in Kenya 2010 Constitution.'
                        : 'Inaunda maswali 10, chaguzi 4 (A-D), ufafanuzi na tafsiri ya Kiswahili kwa mujibu wa Katiba ya Kenya 2010.'}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateLessonSubmit} className="space-y-4">
                {/* Course Topic & Instant Operator AI Trigger */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-800">
                      {language === 'en' ? 'Course Topic / Title (English) *' : 'Mada / Jina la Somo (Kiingereza) *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDevelopTopicWithOperatorAi()}
                      disabled={!newLessonTitleEn.trim() || isOperatorDeveloping}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        {isOperatorDeveloping
                          ? 'Developing...'
                          : language === 'en'
                          ? '✨ Develop with Operator AI'
                          : '✨ Tunga na Operator AI'}
                      </span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newLessonTitleEn}
                    onChange={(e) => setNewLessonTitleEn(e.target.value)}
                    placeholder="e.g. County Health Dispensaries & Patient Rights Under Article 43"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-700"
                  />

                  {/* Real-time Anti-Repetition Alert */}
                  {newLessonTitleEn.trim().length > 3 && (() => {
                    const check = checkLessonDuplicate(newLessonTitleEn.trim());
                    if (check.isDuplicate && check.matchedLesson) {
                      const matchedTitle =
                        typeof check.matchedLesson.title === 'string'
                          ? check.matchedLesson.title
                          : check.matchedLesson.title.en;
                      return (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-amber-950">
                              {language === 'en' ? 'Anti-Repetition Alert: Duplicate Topic Detected' : 'Tahadhari ya Kuzuia Marudio: Mada Inafanana'}
                            </div>
                            <div className="text-[11px] text-amber-800 mt-0.5">
                              {language === 'en' ? (
                                <>
                                  A course covering this civic topic already exists as{' '}
                                  <span className="font-semibold underline">Lesson #{check.matchedLesson.lessonNumber} ({matchedTitle})</span>.
                                  Please select a distinct civic topic to avoid lesson repetition.
                                </>
                              ) : (
                                <>
                                  Somo linalohusu mada hii tayari lipo kama{' '}
                                  <span className="font-semibold underline">Somo #{check.matchedLesson.lessonNumber} ({matchedTitle})</span>.
                                  Tafadhali chagua mada tofauti ili kuzuia kurudia masomo.
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <p className="text-[11px] text-slate-500">
                    💡 Submitting this topic or clicking the AI button automatically prompts Operator AI to build all 10 examination questions and choices.
                  </p>
                </div>

                {/* Swahili Title (Auto populated by AI or manual) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Lesson Title (Kiswahili) - Auto-translated by Operator AI' : 'Jina la Somo (Kiswahili)'}
                  </label>
                  <input
                    type="text"
                    value={newLessonTitleSw}
                    onChange={(e) => setNewLessonTitleSw(e.target.value)}
                    placeholder="e.g. Zahanati za Kaunti na Haki za Wagonjwa Chini ya Kifungu cha 43"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                {/* Category Selection & Custom Category Addition */}
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-800">
                      {language === 'en' ? 'Course Category *' : 'Kitengo cha Somo *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                      className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        {isAddingNewCategory
                          ? language === 'en'
                            ? 'Close New Category'
                            : 'Funga'
                          : language === 'en'
                          ? '+ Add New Category'
                          : '+ Ongeza Kitengo Kipya'}
                      </span>
                    </button>
                  </div>

                  {/* Inline Category Creation Box */}
                  {isAddingNewCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white rounded-xl border border-teal-300 space-y-2.5 shadow-xs"
                    >
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-teal-700" />
                        <span>{language === 'en' ? 'Add a Category That Does Not Already Exist' : 'Ongeza Kitengo Kisichokuwepo'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={customCategoryInputEn}
                          onChange={(e) => setCustomCategoryInputEn(e.target.value)}
                          placeholder="Category Name in English (e.g. Land & Environment)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700"
                        />
                        <input
                          type="text"
                          value={customCategoryInputSw}
                          onChange={(e) => setCustomCategoryInputSw(e.target.value)}
                          placeholder="Jina kwa Kiswahili (Mf. Ardhi na Mazingira)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingNewCategory(false)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddNewCategory()}
                          className="px-3 py-1 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-2xs"
                        >
                          {language === 'en' ? 'Register Category' : 'Sajili Kitengo'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <select
                        value={newLessonCategory}
                        onChange={(e) => {
                          if (e.target.value === '__add_new__') {
                            setIsAddingNewCategory(true);
                          } else {
                            setNewLessonCategory(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-800"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name[language] || cat.name.en} {cat.isCustom ? '★ (Custom)' : ''}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add a custom category that does not exist...</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        min={2}
                        max={30}
                        value={newLessonReadTime}
                        onChange={(e) => setNewLessonReadTime(Number(e.target.value))}
                        placeholder="Read time in minutes"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Operator AI Developed Quizzes Status & Preview Accordion */}
                {developedQuizzes.length > 0 && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <div>
                          <div className="text-xs font-bold text-emerald-950">
                            {language === 'en'
                              ? `Operator AI Developed 10 Examination Questions & Choices`
                              : `Operator AI Imetunga Maswali 10 ya Mtihani na Chaguzi`}
                          </div>
                          <div className="text-[11px] text-emerald-800">
                            {language === 'en'
                              ? '10 multiple-choice questions with verified correct answers and dual English/Swahili translations ready.'
                              : 'Maswali 10 yenye majibu sahihi na tafsiri mbili za Kiingereza na Kiswahili yako tayari.'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowQuestionsReview(!showQuestionsReview)}
                        className="text-xs font-bold text-emerald-900 underline hover:text-emerald-950"
                      >
                        {showQuestionsReview ? 'Hide Questions' : 'Review 10 Questions'}
                      </button>
                    </div>

                    {showQuestionsReview && (
                      <div className="max-h-60 overflow-y-auto space-y-2 pt-2 border-t border-emerald-200/60 pr-1">
                        {developedQuizzes.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5"
                          >
                            <div className="font-bold text-slate-900">
                              Q{idx + 1}: {q.question[language]}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                              {q.options.map((opt, optIdx) => {
                                const correctIdx =
                                  typeof q.correctAnswer === 'number'
                                    ? q.correctAnswer
                                    : typeof (q as any).correctAnswerIndex === 'number'
                                    ? (q as any).correctAnswerIndex
                                    : typeof q.correctOptionId === 'string'
                                    ? q.options.findIndex((o: any) => o.id === q.correctOptionId)
                                    : 0;
                                const isCorrect = optIdx === correctIdx || (opt as any).id === q.correctOptionId;
                                const optText = (opt as any).text
                                  ? (opt as any).text[language] || (opt as any).text.en
                                  : (opt as any)[language] || (opt as any).en || '';
                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-1.5 rounded-lg border ${
                                      isCorrect
                                        ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-950'
                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span className="font-mono mr-1">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    <span>{optText}</span>
                                    {isCorrect && (
                                      <span className="ml-1 text-[10px] text-emerald-700 font-bold">✓ Correct</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-slate-500 italic">
                              Article/Explanation: {q.explanation[language]}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Summary / Overview (English) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Summary / Overview (English)' : 'Muhtasari (Kiingereza)'}
                  </label>
                  <textarea
                    rows={2}
                    value={newLessonSummaryEn}
                    onChange={(e) => setNewLessonSummaryEn(e.target.value)}
                    placeholder="Brief explanation of what the learner will gain (auto-completed if left blank)..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                {/* Primary Section Content */}
                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {language === 'en' ? 'Course Content & Constitutional Articles' : 'Maudhui ya Somo na Vifungu'}
                    </h4>
                    <span className="text-[11px] text-slate-400">Auto-filled by Operator AI if blank</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Section Heading (EN)
                      </label>
                      <input
                        type="text"
                        value={newLessonSectionTitleEn}
                        onChange={(e) => setNewLessonSectionTitleEn(e.target.value)}
                        placeholder="e.g. 1. Patient Rights in County Dispensaries"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Constitutional Citation
                      </label>
                      <input
                        type="text"
                        value={newLessonArticle}
                        onChange={(e) => setNewLessonArticle(e.target.value)}
                        placeholder="e.g. Article 43(1)(a) & County Governments Act"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Section Body Content (EN)
                    </label>
                    <textarea
                      rows={3}
                      value={newLessonSectionContentEn}
                      onChange={(e) => setNewLessonSectionContentEn(e.target.value)}
                      placeholder="Detailed civic instruction and constitutional guidance..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Citizen Action Tip */}
                <div className="border-t border-slate-100 pt-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Citizen Action Tip (Call to Action)' : 'Hatua ya Mwananchi'}
                  </label>
                  <input
                    type="text"
                    value={newLessonTipEn}
                    onChange={(e) => setNewLessonTipEn(e.target.value)}
                    placeholder="e.g. Request your county dispensary service charter and participate in hospital committee meetings."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                {/* Submit & Cancel Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Publishes to: Supplementary Course</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateLessonOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isOperatorDeveloping}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        {isOperatorDeveloping
                          ? 'Developing Course with Operator AI...'
                          : language === 'en'
                          ? 'Publish Supplementary Course'
                          : 'Chapisha Somo la Ziada'}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
