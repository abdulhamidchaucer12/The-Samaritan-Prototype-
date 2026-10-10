import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Printer,
  Sparkles,
  Download,
  Share2,
  Shield,
  ArrowRight,
  WifiOff,
  Coins,
  Camera,
  Crown,
  QrCode,
} from 'lucide-react';
import { OfficeProfile, Language } from '../types';
import { translations } from '../data/translations';
import { printCertificate } from '../utils/printHelper';
import { getCurrentAuthUser, getUserAvatar } from '../utils/authAndQuestions';
import { getUserTokenBalance } from '../utils/facilitatorTokenRegistry';
import { CivicProgressBadges } from './CivicProgressBadges';
import { OnlineUsersPresenceBar } from './OnlineUsersPresenceBar';
import { GrandExamModal } from './GrandExamModal';
import { hasUserStudiedAll100Courses } from '../utils/grandExamEngine';
import { isUserMeritGraduate, getMeritGraduateRecord } from '../utils/meritGraduation';

interface MyLearningDashboardProps {
  language: Language;
  completedLessons: (number | string)[];
  bookmarkedOfficeIds: string[];
  highestQuizScore: number;
  totalQuizQuestions: number;
  offices: OfficeProfile[];
  onSelectTab: (tab: string) => void;
  onSelectOffice: (officeId: string) => void;
  onToggleBookmark: (officeId: string) => void;
  onOpenTokensModal?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register' | 'adminSettings') => void;
  onOpenCommunityFeed?: () => void;
  onOpenOnlineModal?: () => void;
}

export const MyLearningDashboard: React.FC<MyLearningDashboardProps> = ({
  language,
  completedLessons,
  bookmarkedOfficeIds,
  highestQuizScore,
  totalQuizQuestions,
  offices,
  onSelectTab,
  onSelectOffice,
  onToggleBookmark,
  onOpenTokensModal,
  onOpenAuthModal,
  onOpenCommunityFeed,
  onOpenOnlineModal,
}) => {
  const t = translations[language];
  const currentUser = getCurrentAuthUser();
  const [userName, setUserName] = useState<string>(currentUser?.username || 'Kenyan Citizen');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showGrandExamModal, setShowGrandExamModal] = useState<boolean>(false);

  const grandExamProgress = hasUserStudiedAll100Courses(currentUser?.username);
  const isMeritGraduate = isUserMeritGraduate(currentUser?.username);
  const meritRecord = getMeritGraduateRecord(currentUser?.username);

  const totalLessons = 100;
  const progressPercent = Math.min(100, Math.round(((completedLessons.length || grandExamProgress.completedCount) / totalLessons) * 100));

  const bookmarkedOffices = offices.filter((o) => bookmarkedOfficeIds.includes(o.id));

  const handlePrintCertificate = () => {
    printCertificate('printable-overall-certificate');
  };

  const certificateDate = new Date().toLocaleDateString(language === 'en' ? 'en-KE' : 'sw-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full space-y-8">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl flex items-start gap-4">
            {/* User Profile Avatar */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                {currentUser?.username && getUserAvatar(currentUser.username) ? (
                  <img
                    src={getUserAvatar(currentUser.username)!}
                    alt={currentUser.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{(currentUser?.username || 'KC').slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal(currentUser?.role === 'admin' ? 'adminSettings' : 'login')}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                  title={language === 'en' ? 'Change Profile Picture' : 'Badilisha Picha ya Wasifu'}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Civic Achievement Tracker</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-1">
                {t.myLearning.title}
              </h1>
              <p className="text-blue-100/90 text-sm leading-relaxed">
                {t.myLearning.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-4 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-md">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-300">
                {t.myLearning.lessonsCompleted}
              </div>
              <div className="text-lg font-bold text-white">
                {completedLessons.length} / {totalLessons}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Online Citizens Real-time Presence Bar */}
      <OnlineUsersPresenceBar
        currentUser={currentUser}
        language={language}
        onOpenCommunityFeed={onOpenCommunityFeed}
        onOpenOnlineModal={onOpenOnlineModal}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Metric 1: Lessons Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.myLearning.lessonsCompleted}
            </span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-2">
            {completedLessons.length} of {totalLessons}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={() => onSelectTab('lessons')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>{language === 'en' ? 'Continue Civic Curriculum' : 'Endelea na Masomo'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 2: Quiz Score */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.myLearning.quizScore}
            </span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-2">
            {highestQuizScore} / {totalQuizQuestions}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {highestQuizScore >= 8
              ? language === 'en'
                ? 'Mastery Level: Constitutional Scholar'
                : 'Kiwango cha Umahiri: Mtaalamu wa Katiba'
              : language === 'en'
                ? 'Review lessons to achieve full score'
                : 'Pitia masomo ili upate alama kamili'}
          </p>
          <button
            onClick={() => onSelectTab('quiz')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{language === 'en' ? 'Take / Retake Quiz' : 'Fanya Chemsha Bongo'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 3: Bookmarks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.myLearning.bookmarkedOffices}
            </span>
            <Bookmark className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-2">
            {bookmarkedOfficeIds.length}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {language === 'en'
              ? 'Saved public offices for rapid reference'
              : 'Ofisi za umma zilizohifadhiwa'}
          </p>
          <button
            onClick={() => onSelectTab('explorer')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{language === 'en' ? 'Browse 35 Offices' : 'Chunguza Ofisi 35'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 4: Facilitator Tokens & Physical Training */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'en' ? 'Facilitator Tokens' : 'Tokeni za Wawezeshaji'}
            </span>
            <Coins className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-2 font-mono flex items-baseline gap-2">
            <span>{getUserTokenBalance(currentUser?.username).availableBalance}</span>
            <span className="text-xs font-sans font-semibold text-amber-700">
              / 5 {language === 'en' ? 'for Certificate' : 'kwa Cheti'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {language === 'en'
              ? 'Physical baraza training credits under The_Samaritan'
              : 'Mikopo ya mafunzo ya ana kwa ana ya Msamaria'}
          </p>
          <button
            onClick={onOpenTokensModal}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{language === 'en' ? 'View Tokens & Certs' : 'Tazama Tokeni na Cheti'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Visual Progress Milestone Badges (25%, 50%, 75%, 100%) */}
      <div className="mb-8">
        <CivicProgressBadges
          language={language}
          progressPercent={progressPercent}
          currentUser={currentUser}
          onClaimCertificate={() => {
            setShowCertificate(true);
            const el = document.getElementById('certificate-generator-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onContinueLearning={() => onSelectTab('lessons')}
        />
      </div>

      {/* 100 Civic Courses Cap & Grand 40-Marks Timed Exam Milestone Card */}
      <div className="bg-linear-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/40 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>
                {isMeritGraduate
                  ? 'CIVIC MERIT GRADUATE • HONORS ACTIVE'
                  : grandExamProgress.hasStudiedAll
                  ? '100 COURSES MASTERED • FINAL EXAM UNLOCKED'
                  : `100 CIVIC COURSES CAP (${grandExamProgress.completedCount}/100)`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
              {isMeritGraduate
                ? (language === 'en'
                  ? 'Grand Civic Merit Distinction Honors'
                  : 'Heshima Kuu ya Kuhitimu Masomo ya Uraia')
                : grandExamProgress.hasStudiedAll
                ? (language === 'en'
                  ? 'Take Your 40-Marks Timed Final Exam'
                  : 'Fanya Mtihani wako wa Mwisho wa Alama 40')
                : (language === 'en'
                  ? 'Complete 100 Civic Courses to Graduate'
                  : 'Kamilisha Masomo 100 ya Uraia ili Kuhitimu')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isMeritGraduate
                ? (language === 'en'
                  ? `Graduated with ${meritRecord?.score || 35}/40 marks! You have earned the Certificate of Merit with Profile Verification QR code, Executive Double Verification Badge, and 5,000 tokens.`
                  : `Umehitimu kwa alama ${meritRecord?.score || 35}/40! Umepokea Cheti cha Sifa chenye Msimbo wa QR, Nembo ya Uthibitishaji Miwili, na tokeni 5,000.`)
                : grandExamProgress.hasStudiedAll
                ? (language === 'en'
                  ? 'You have studied all 100 civic courses! Sit the 40-marks timed final exam (>30 marks to pass) to claim your Certificate of Merit with live QR code, Double Verification Badge, and 5,000 tokens.'
                  : 'Umesoma masomo yote 100! Fanya mtihani wa alama 40 (>30 kufaulu) ili upate Cheti cha Sifa chenye QR, Nembo ya Uthibitishaji Miwili, na tokeni 5,000.')
                : (language === 'en'
                  ? `Master all 100 civic courses (currently ${grandExamProgress.completedCount}/100 studied, ${grandExamProgress.remainingCount} remaining). Once 100 courses are reached, daily course generation concludes and the timed exam unlocks!`
                  : `Kamilisha masomo yote 100 ya uraia (${grandExamProgress.completedCount}/100 yamemalizika). Ukifika 100, masomo ya kila siku yatafungwa na mtihani wa alama 40 utafunguka!`)}
            </p>

            <div className="w-full max-w-sm pt-1 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>100-Courses Progress</span>
                <span className="text-amber-400 font-mono">{grandExamProgress.completedCount} / 100</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${grandExamProgress.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            {isMeritGraduate ? (
              <button
                type="button"
                onClick={() => setShowGrandExamModal(true)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>{language === 'en' ? 'View Certificate of Merit & QR Code' : 'Tazama Cheti cha Sifa na Msimbo wa QR'}</span>
              </button>
            ) : grandExamProgress.hasStudiedAll ? (
              <button
                type="button"
                onClick={() => setShowGrandExamModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.03] ring-4 ring-amber-400/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'en' ? 'Take 40-Marks Timed Exam' : 'Fanya Mtihani wa Alama 40'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('lessons')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Study More Courses ({grandExamProgress.remainingCount} left)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Claim & Generator Section */}
      <div id="certificate-generator-card" className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-6 sm:p-8 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>KFE Official Civic Recognition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-2">
              {t.myLearning.certificateTitle}
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {t.myLearning.certificateDesc}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name for certificate"
                className="bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[240px]"
              />
              <button
                onClick={() => setShowCertificate(!showCertificate)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                {showCertificate
                  ? language === 'en'
                    ? 'Hide Certificate'
                    : 'Ficha Cheti'
                  : t.myLearning.claimCertificate}
              </button>
            </div>
          </div>

          <div className="hidden lg:block shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg">
              <div className="w-full h-full border-2 border-dashed border-amber-100 rounded-xl flex flex-col items-center justify-center text-white">
                <Award className="w-10 h-10" />
                <span className="text-[10px] font-bold uppercase mt-1">KFE Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        {showCertificate && (
          <div className="mt-8 pt-8 border-t border-amber-200/80 animate-in fade-in duration-300">
            <div className="flex justify-end gap-2 mb-4 no-print">
              <button
                onClick={handlePrintCertificate}
                className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.common.print}</span>
              </button>
            </div>

            {/* Framed Certificate Document */}
            <div
              id="printable-overall-certificate"
              className="printable-certificate-target bg-white p-8 sm:p-12 rounded-xl border-8 border-double border-amber-600/60 shadow-2xl relative max-w-4xl mx-auto text-center"
            >
              {/* Kenyan Ribbon Border at top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />

              {/* Watermark Logo Icon */}
              <div className="text-amber-800/80 flex items-center justify-center gap-2 mb-3">
                <Shield className="w-8 h-8 text-amber-600" />
                <span className="font-serif font-extrabold tracking-widest text-base sm:text-lg">
                  KWALE FOCUS EMPOWERMENT CBO
                </span>
              </div>

              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">
                THE SAMARITAN CIVIC EDUCATION AND GOVERNMENT LITERACY PLATFORM
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight mb-2">
                CERTIFICATE OF CIVIC LITERACY
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 italic mb-6">
                This is to officially certify that
              </p>

              <div className="text-xl sm:text-3xl font-extrabold text-blue-950 font-serif border-b-2 border-amber-500 inline-block px-8 pb-1 mb-6">
                {userName || 'Kenyan Citizen'}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed mb-8">
                has successfully engaged with and completed civic study on the{' '}
                <strong>Constitution of Kenya 2010</strong>, the structure of the National and
                County Governments, public accountability mechanisms, and rights of public
                participation under Article 1, Article 10, Article 35, and Article 174.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-xs text-slate-600 text-center">
                <div>
                  <div className="font-bold text-slate-800">Date Issued</div>
                  <div>{certificateDate}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Republic of Kenya</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-700 mb-1">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-bold text-amber-800 uppercase">
                    Official Seal of KFE
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-800">Verification ID</div>
                  <div className="font-mono text-slate-700">
                    SAM-KFE-{Math.abs(userName.length * 1024 + 2026)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Dev:{' '}
                    <a
                      href="mailto:abdulhamid.moh.ali19@gmail.com"
                      className="text-amber-700 hover:text-amber-800 underline font-medium"
                      title="Abdulhamid Chaucer (abdulhamid.moh.ali19@gmail.com)"
                    >
                      Abdulhamid Chaucer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bookmarked Offices Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              {t.myLearning.bookmarkedOffices} ({bookmarkedOffices.length})
            </h2>
          </div>
          {bookmarkedOffices.length > 0 && (
            <button
              onClick={() => onSelectTab('compare')}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              {t.comparison.title} →
            </button>
          )}
        </div>

        {bookmarkedOffices.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            <p className="mb-3">
              {language === 'en'
                ? 'You have not bookmarked any public offices yet. Browse the Government Explorer to bookmark offices for quick reference.'
                : 'Bado hujayahifadhi ofisi yoyote ya umma. Chunguza ofisi kwenye kichupo cha Chunguza Serikali.'}
            </p>
            <button
              onClick={() => onSelectTab('explorer')}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <span>{t.home.exploreButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedOffices.map((office) => (
              <div
                key={office.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {office.level} • {office.branch}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(office.id)}
                      className="text-amber-500 hover:text-slate-400 text-xs"
                      title="Remove Bookmark"
                    >
                      ★
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 font-serif mb-1">
                    {office.name[language]}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {office.legalReferences[language].join(' • ')}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectOffice(office.id)}
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    {t.explorer.learnMore} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
