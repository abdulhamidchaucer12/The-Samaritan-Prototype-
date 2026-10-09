import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  X,
  Bell,
  Check,
  Trash2,
  MapPin,
  Coins,
  ArrowRight,
  Globe,
  Award,
  BookOpen,
  MessageSquare,
  Compass,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
  Users,
  Clock,
  Crown,
  CheckCheck,
  Send,
} from 'lucide-react';
import { Language, AuthUser, VerificationBadgeTier } from '../types';
import {
  evaluatePasswordStrength,
  changeAdminPassword,
  getUserAvatar,
  setUserAvatar,
  removeUserAvatar,
  DEFAULT_CIVIC_AVATARS,
  getUserCounty,
  getUserSubCounty,
  setUserCounty,
} from '../utils/authAndQuestions';
import { KENYA_47_COUNTIES } from '../data/kenyaCounties';
import { AdminNameAllocationConsole } from './AdminNameAllocationConsole';
import { getAdminPlatformAddressingName } from '../utils/adminAppointments';
import { getUserTokenBalance } from '../utils/facilitatorTokenRegistry';
import { getUserProgress } from '../utils/storage';
import { isUserOnline, getActiveUserSessions } from '../utils/userPresence';
import { UserBadge } from './UserBadge';
import { OnlineUsersPresenceBar } from './OnlineUsersPresenceBar';
import {
  getUserVerification,
  checkVerificationEligibility,
  getUserPendingRequest,
  getUserLatestRequest,
  submitVerificationRequest,
  REQUIRED_TOKENS_FOR_VERIFICATION,
} from '../utils/userVerificationService';

interface UserProfileViewProps {
  currentUser: AuthUser | null;
  language: Language;
  onLogout: () => void;
  onSelectTab?: (tab: string) => void;
  onOpenTokensModal?: () => void;
  onOpenCommunityFeed?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onClose?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  language,
  onLogout,
  onSelectTab,
  onOpenTokensModal,
  onOpenCommunityFeed,
  onOpenAuthModal,
  onClose,
}) => {
  const [currentAvatar, setCurrentAvatarState] = useState<string | null>(null);
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null);

  // Home County Management State
  const [profileCounty, setProfileCounty] = useState<string>('Kwale County');
  const [profileSubCounty, setProfileSubCounty] = useState<string>('');
  const [countyFeedback, setCountyFeedback] = useState<string | null>(null);

  // Admin Change Password State
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showCurrentAdminPass, setShowCurrentAdminPass] = useState(false);
  const [showNewAdminPass, setShowNewAdminPass] = useState(false);
  const [showConfirmAdminPass, setShowConfirmAdminPass] = useState(false);
  const [adminPassError, setAdminPassError] = useState<string | null>(null);
  const [adminPassSuccess, setAdminPassSuccess] = useState<string | null>(null);

  // Civic Verification Badge & Application state
  const [userVerification, setUserVerification] = useState(() =>
    currentUser?.username ? getUserVerification(currentUser.username) : null
  );
  const [pendingVerificationReq, setPendingVerificationReq] = useState(() =>
    currentUser?.username ? getUserPendingRequest(currentUser.username) : null
  );
  const [latestVerificationReq, setLatestVerificationReq] = useState(() =>
    currentUser?.username ? getUserLatestRequest(currentUser.username) : null
  );
  const [verifEligibility, setVerifEligibility] = useState(() =>
    checkVerificationEligibility(currentUser?.username)
  );

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyRequestedTier, setApplyRequestedTier] = useState<VerificationBadgeTier>('double_tick');
  const [applyNote, setApplyNote] = useState('');
  const [applyFeedback, setApplyFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const handleSyncVerif = () => {
      if (currentUser?.username) {
        setUserVerification(getUserVerification(currentUser.username));
        setPendingVerificationReq(getUserPendingRequest(currentUser.username));
        setLatestVerificationReq(getUserLatestRequest(currentUser.username));
        setVerifEligibility(checkVerificationEligibility(currentUser.username));
      }
    };
    handleSyncVerif();
    window.addEventListener('the_samaritan_verifications_updated', handleSyncVerif);
    window.addEventListener('the_samaritan_tokens_updated', handleSyncVerif);
    window.addEventListener('the_samaritan_progress_updated', handleSyncVerif);
    window.addEventListener('storage', handleSyncVerif);
    return () => {
      window.removeEventListener('the_samaritan_verifications_updated', handleSyncVerif);
      window.removeEventListener('the_samaritan_tokens_updated', handleSyncVerif);
      window.removeEventListener('the_samaritan_progress_updated', handleSyncVerif);
      window.removeEventListener('storage', handleSyncVerif);
    };
  }, [currentUser?.username]);

  const handleSubmitVerificationApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.username) return;
    setIsApplying(true);
    setApplyFeedback(null);

    const res = submitVerificationRequest(currentUser.username, applyRequestedTier, applyNote);
    setIsApplying(false);

    if (res.success) {
      setApplyFeedback({ type: 'success', message: res.message });
      setApplyNote('');
      setTimeout(() => {
        setShowApplyModal(false);
        setApplyFeedback(null);
      }, 2500);
    } else {
      setApplyFeedback({ type: 'error', message: res.message });
    }
  };

  useEffect(() => {
    if (currentUser?.username) {
      setCurrentAvatarState(getUserAvatar(currentUser.username));
      const c = getUserCounty(currentUser.username);
      const sc = getUserSubCounty(currentUser.username);
      if (c) setProfileCounty(c);
      if (sc) setProfileSubCounty(sc);
    }
  }, [currentUser?.username]);

  const handleSelectPreset = (icon: string, bg: string) => {
    if (!currentUser?.username) return;
    const svgUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${encodeURIComponent(
      bg
    )}"/><text x="32" y="40" font-size="28" text-anchor="middle">${encodeURIComponent(
      icon
    )}</text></svg>`;

    setUserAvatar(currentUser.username, svgUri);
    setCurrentAvatarState(svgUri);
    setAvatarFeedback(
      language === 'en' ? 'Civic badge avatar updated!' : 'Nembo ya wasifu imesasishwa!'
    );
    setTimeout(() => setAvatarFeedback(null), 3500);
  };

  const handleRemoveAvatar = () => {
    if (!currentUser?.username) return;
    removeUserAvatar(currentUser.username);
    setCurrentAvatarState(null);
    setAvatarFeedback(
      language === 'en' ? 'Avatar removed. Initials will be displayed.' : 'Nembo imeondolewa.'
    );
    setTimeout(() => setAvatarFeedback(null), 3500);
  };

  const handleSaveProfileCounty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.username) return;
    setUserCounty(currentUser.username, profileCounty, profileSubCounty);
    setCountyFeedback(
      language === 'en'
        ? `Home county saved as ${profileCounty}${profileSubCounty ? ` (${profileSubCounty})` : ''}!`
        : `Kaunti ya nyumbani imehifadhiwa kama ${profileCounty}!`
    );
    setTimeout(() => setCountyFeedback(null), 4000);
  };

  const adminNewPassStrength = evaluatePasswordStrength(newAdminPassword);

  const handleAdminChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassError(null);
    setAdminPassSuccess(null);

    if (newAdminPassword.length < 8) {
      setAdminPassError(
        language === 'en'
          ? 'New password must have at least 8 characters.'
          : 'Nenosiri jipya lazima liwe na herufi 8 au zaidi.'
      );
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setAdminPassError(
        language === 'en' ? 'Passwords do not match.' : 'Nenosiri halilingani.'
      );
      return;
    }

    if (!currentUser) return;
    const res = changeAdminPassword(currentUser.username, currentAdminPassword, newAdminPassword);
    if (res.success) {
      setAdminPassSuccess(res.message);
      setCurrentAdminPassword('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } else {
      setAdminPassError(res.message);
    }
  };

  const userProgress = getUserProgress(currentUser?.username);
  const highestScore = Object.values(userProgress.quizScores || {}).reduce(
    (max: number, item: { score: number }) => (item && item.score > max ? item.score : max),
    0
  );
  const online = currentUser?.username ? isUserOnline(currentUser.username) : false;

  // If user is not logged in, display sign in / register prompt view
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />

          {/* Close X at top right corner */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                if (onClose) onClose();
                else if (onSelectTab) onSelectTab('home');
              }}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title={language === 'en' ? 'Close' : 'Funga'}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-blue-900 text-amber-400 mx-auto flex items-center justify-center shadow-md">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en' ? 'Citizen Civic Profile' : 'Wasifu wa Mwananchi'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {language === 'en'
                ? 'Sign in or create an anonymous account to track constitutional lessons, earn facilitator tokens, customize your civic avatar, and connect with peers across all 47 counties.'
                : 'Ingia au fungua akaunti ya siri ili kufuata masomo ya katiba, kupata ishara za uwezeshaji, kuboresha nembo yako, na kujiunga na wananchi wengine.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>{language === 'en' ? 'Sign In' : 'Ingia'}</span>
            </button>

            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'Create Anonymous Account' : 'Jisajili'}</span>
            </button>
          </div>

          {/* Close button at the bottom of the card */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else if (onSelectTab) onSelectTab('home');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>{language === 'en' ? 'Close Profile' : 'Funga Wasifu'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Profile Header Card with Close X Button */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />

        <div className="flex items-start justify-between gap-4 pt-1">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-emerald-500 bg-emerald-600 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={currentUser.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{currentUser.username.replace('@', '').slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              {online && (
                <span
                  className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs"
                  title="Active Online"
                />
              )}
            </div>

            {/* User Meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-serif truncate">
                  {currentUser.role === 'admin'
                    ? `${getAdminPlatformAddressingName(currentUser.username)} (${currentUser.username})`
                    : currentUser.username}
                </h2>
                <UserBadge username={currentUser.username} size="sm" hideName />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {currentUser.role === 'admin'
                    ? 'Verified Civic Administrator'
                    : 'Registered Citizen of Kenya'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {profileSubCounty ? `${profileSubCounty}, ` : ''}{profileCounty}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions: Close X & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title={language === 'en' ? 'Log Out' : 'Ondoka'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Log Out' : 'Ondoka'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title={language === 'en' ? 'Close profile' : 'Funga wasifu'}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Online Citizens Presence Bar */}
      <OnlineUsersPresenceBar
        currentUser={currentUser}
        language={language}
        onOpenCommunityFeed={onOpenCommunityFeed}
        onOpenOnlineModal={() => window.dispatchEvent(new CustomEvent('open_online_users_modal'))}
      />

      {/* Grid: Avatar Customization & Home County Jurisdiction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Civic Avatar Customization Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
                {language === 'en' ? 'Civic Badge Avatar' : 'Nembo ya Wasifu'}
              </h3>
            </div>
            {currentAvatar && (
              <button
                onClick={handleRemoveAvatar}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Reset' : 'Weka Upya'}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {language === 'en'
              ? 'Choose a free civic badge icon to personalize your verified citizen account.'
              : 'Chagua nembo ya uraia ya bure ili kuweka wasifu wako wazi.'}
          </p>

          {avatarFeedback && (
            <div className="p-2.5 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 font-medium border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{avatarFeedback}</span>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {language === 'en' ? 'Select a civic avatar preset:' : 'Chagua nembo ya uraia:'}
            </span>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {DEFAULT_CIVIC_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  title={av.label}
                  onClick={() => handleSelectPreset(av.icon, av.bg)}
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:scale-110 flex items-center justify-center text-lg transition-all shadow-2xs cursor-pointer"
                >
                  {av.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Home County & Devolution Jurisdiction Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-emerald-200 dark:border-emerald-900/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
                {language === 'en'
                  ? 'Home County & Jurisdiction'
                  : 'Kaunti ya Nyumbani na Ugatuzi'}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {KENYA_47_COUNTIES.find((c) => c.name === profileCounty)?.code
                ? `Code ${KENYA_47_COUNTIES.find((c) => c.name === profileCounty)?.code}`
                : '47 Counties'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {language === 'en'
              ? 'Connects your account to your County Assembly, ward barazas, and devolution public participation under Article 174 & 201.'
              : 'Inakuunganisha na bunge la kaunti yako, ushiriki wa wananchi, na mabaraza ya ugatuzi.'}
          </p>

          {countyFeedback && (
            <div className="p-2.5 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 font-medium border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{countyFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfileCounty} className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'County (1 - 47)' : 'Kaunti (1 - 47)'} *
                </label>
                <div className="relative">
                  <select
                    required
                    value={profileCounty}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfileCounty(val);
                      const cObj = KENYA_47_COUNTIES.find((c) => c.name === val);
                      if (cObj && cObj.subCounties.length > 0) {
                        setProfileSubCounty(cObj.subCounties[0]);
                      } else {
                        setProfileSubCounty('');
                      }
                    }}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none pr-8 cursor-pointer"
                  >
                    {KENYA_47_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {String(c.code).padStart(2, '0')} - {c.name} ({c.region})
                      </option>
                    ))}
                  </select>
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Sub-County' : 'Kaunti Ndogo'}
                </label>
                <select
                  value={profileSubCounty}
                  onChange={(e) => setProfileSubCounty(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="">
                    {language === 'en' ? '-- Select Sub-County --' : '-- Chagua Kaunti Ndogo --'}
                  </option>
                  {(
                    KENYA_47_COUNTIES.find((c) => c.name === profileCounty)?.subCounties || []
                  ).map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Save Jurisdiction' : 'Hifadhi Kaunti'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Facilitator Tokens & Baraza Credits Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en'
                ? 'Facilitator Tokens & Baraza Credits'
                : 'Ishara za Uwezeshaji na Mikopo ya Baraza'}
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold text-xs">
            <span>🪙</span>
            <span>
              {currentUser ? getUserTokenBalance(currentUser.username).availableBalance : 0} TKNS
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {language === 'en'
            ? 'Facilitator Tokens are awarded by The Samaritan to civic facilitators, baraza conveners, and youth leaders conducting grassroots Constitution training across all 47 counties.'
            : 'Ishara za uwezeshaji hutolewa na Msamaria kwa wawezeshaji wa katiba na mabaraza ya vijana nyanjani katika kaunti zote 47.'}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
              {language === 'en' ? 'Total Earned' : 'Jumla Iliyopatikana'}
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              +{currentUser ? getUserTokenBalance(currentUser.username).totalAwarded : 0} Tokens
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
              {language === 'en' ? 'Status' : 'Hali'}
            </span>
            <span className="font-bold text-blue-700 dark:text-blue-300">
              {currentUser?.role === 'admin' ? 'Administrator Custodian' : 'Grassroots Citizen'}
            </span>
          </div>
        </div>

        {onOpenTokensModal && (
          <button
            type="button"
            onClick={onOpenTokensModal}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span>
                {language === 'en'
                  ? 'Open Facilitator Tokens & Baraza Registry'
                  : 'Fungua Daftari la Ishara na Mafunzo'}
              </span>
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Civic Verification Badge & Application Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en'
                ? 'Civic Verification Badge (Single Tick ✓ / Double Ticks ✓✓)'
                : 'Nembo ya Uthibitishaji wa Uraia (Mhuri Mmoja ✓ / Mihuri Miwili ✓✓)'}
            </h3>
          </div>

          {/* Current Status Pill */}
          {userVerification ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                userVerification.badgeTier === 'double_tick'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700'
              }`}
            >
              {userVerification.badgeTier === 'double_tick' ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Double Ticks Verified (✓✓)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Single Tick Verified (✓)</span>
                </>
              )}
            </span>
          ) : pendingVerificationReq ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Application Under Review</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Standard Citizen Account
            </span>
          )}
        </div>

        {/* Status Details */}
        {userVerification ? (
          <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-50/70 via-slate-50 to-amber-50/70 dark:from-emerald-950/30 dark:via-slate-900 dark:to-amber-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  {userVerification.badgeTitleEn}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verified by {userVerification.verifiedBy} on {new Date(userVerification.verifiedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {userVerification.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60 dark:border-slate-800">
                &ldquo;{userVerification.notes}&rdquo;
              </p>
            )}

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1 pt-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Your verified status reflects alongside your username across the entire platform.</span>
            </div>
          </div>
        ) : pendingVerificationReq ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Your Verification Application is Pending Review</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Submitted on {new Date(pendingVerificationReq.submittedAt).toLocaleDateString()} requesting the{' '}
              <strong>{pendingVerificationReq.requestedTier === 'double_tick' ? 'Double Ticks (✓✓)' : 'Single Tick (✓)'}</strong> verification badge. The_Samaritan has been notified to review your application in The Samaritan Console.
            </p>
            {pendingVerificationReq.userNote && (
              <p className="italic text-slate-500 dark:text-slate-400 text-[11px] bg-white/60 dark:bg-slate-900/40 p-2 rounded-xl">
                Note: &ldquo;{pendingVerificationReq.userNote}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'en'
                ? 'Citizens who complete the 10 foundational civic courses and hold at least 50 facilitator tokens can request an official verification badge (Single Tick ✓ or Double Ticks ✓✓) co-signed by The_Samaritan.'
                : 'Wananchi wanaokamilisha masomo 10 ya msingi ya uraia na kumiliki angalau tokeni 50 wanaweza kuomba nembo rasmi ya uthibitisho (Mhuri Mmoja ✓ au Mihuri Miwili ✓✓) iliyoidhinishwa na Msamaria.'}
            </p>

            {/* Application Prerequisites Checklist Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Application Prerequisites Checklist
              </div>

              {/* Requirement 1: 10 Foundational Courses */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      10 Foundational Civic Courses
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Completed: {verifEligibility.foundationalCount}/10
                    </span>
                  </div>
                </div>

                {verifEligibility.foundationalCount >= 10 ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Completed ✓</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      {10 - verifEligibility.foundationalCount} more needed
                    </span>
                    {onSelectTab && (
                      <button
                        type="button"
                        onClick={() => onSelectTab('lessons')}
                        className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] hover:underline cursor-pointer"
                      >
                        Study
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Requirement 2: 50 Tokens */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      Facilitator Token Balance
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Balance: {verifEligibility.tokenBalance} TKNS (Min 50)
                    </span>
                  </div>
                </div>

                {verifEligibility.tokenBalance >= REQUIRED_TOKENS_FOR_VERIFICATION ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Eligible ✓</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      {REQUIRED_TOKENS_FOR_VERIFICATION - verifEligibility.tokenBalance} more TKNS
                    </span>
                    {onSelectTab && (
                      <button
                        type="button"
                        onClick={() => onSelectTab('quiz')}
                        className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] hover:underline cursor-pointer"
                      >
                        Earn
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Previous Denial Note if any */}
            {latestVerificationReq && latestVerificationReq.status === 'denied' && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-800 dark:text-red-300">
                <span className="font-bold block text-[10px] uppercase">Previous Application Decision:</span>
                <p className="mt-0.5 italic text-[11px]">
                  &ldquo;{latestVerificationReq.decisionReason || 'Criteria not met at that time.'}&rdquo;
                </p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                  You can submit a fresh application now that you meet the criteria!
                </span>
              </div>
            )}

            {/* Apply Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                disabled={!verifEligibility.eligible}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  verifEligibility.eligible
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {verifEligibility.eligible
                    ? language === 'en'
                      ? 'Apply for Civic Verification Badge'
                      : 'Omba Nembo ya Uthibitishaji wa Uraia'
                    : language === 'en'
                    ? 'Complete 10 Foundational Courses & 50 Tokens to Apply'
                    : 'Kamilisha Masomo 10 & Tokeni 50 ili Kuomba'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-slate-100 font-serif">
                    Apply for Civic Verification Badge
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official review by The_Samaritan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applyFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  applyFeedback.type === 'success'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                    : 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 border border-red-300'
                }`}
              >
                {applyFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{applyFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitVerificationApplication} className="space-y-4">
              {/* Confirmed Prerequisites */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-[10px] uppercase">
                  Verified Prerequisites:
                </span>
                <div className="text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>✓ 10 Foundational Civic Courses Completed</span>
                  <span className="font-black">10/10</span>
                </div>
                <div className="text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>✓ Facilitator Tokens Balance Verified</span>
                  <span className="font-black">{verifEligibility.tokenBalance} TKNS</span>
                </div>
              </div>

              {/* Badge Tier Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Requested Verification Tier *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setApplyRequestedTier('double_tick')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      applyRequestedTier === 'double_tick'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/40 text-amber-950 dark:text-amber-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span>Double Ticks (✓✓)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                      Civic Scholar & Community Leader
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApplyRequestedTier('single_tick')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      applyRequestedTier === 'single_tick'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-400/40 text-blue-950 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Single Tick (✓)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                      Verified Grassroots Citizen
                    </span>
                  </button>
                </div>
              </div>

              {/* Personal Motivation Statement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Statement of Civic Contribution <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={applyNote}
                  onChange={(e) => setApplyNote(e.target.value)}
                  placeholder="Share a short note on your community involvement, baraza attendance, or constitutional education efforts in your county..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isApplying ? 'Submitting...' : 'Submit Application to The Samaritan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Civic Learning Progress Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en' ? 'Civic Learning Progress & Certificates' : 'Maendeleo ya Masomo na Vyeti'}
            </h3>
          </div>
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('myLearning')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'en' ? 'View Full Dashboard' : 'Tazama Kamili'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold uppercase tracking-wider">
              Lessons Completed
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              {userProgress.completedLessons.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold uppercase tracking-wider">
              High Exam Score
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {highestScore > 0 ? `${highestScore}/10` : '—'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold uppercase tracking-wider">
              Certificate Status
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-1">
              <Award className="w-4 h-4" />
              <span>{highestScore >= 8 ? 'Qualified Awardee' : 'In Progress'}</span>
            </span>
          </div>
        </div>

        {onSelectTab && (
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => onSelectTab('lessons')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'Continue Lessons' : 'Endelea na Masomo'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('quiz')}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200 dark:border-emerald-800"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'Take Civic Exam' : 'Fanya Mtihani wa Katiba'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Community Baraza & Citizen Activity Feed Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-teal-200 dark:border-teal-900/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en' ? 'Community Baraza & Peer Network' : 'Baraza la Wananchi na Mtandao'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
            Live Grassroots
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {language === 'en'
            ? 'Engage with fellow verified citizens, join regional discussions, and track grassroots baraza dialogues across all 47 counties.'
            : 'Shiriki na wananchi wenzako, ungana na majadiliano ya kikanda, na ufuatilie mabaraza ya mashinani kote nchini.'}
        </p>

        {onOpenCommunityFeed && (
          <button
            type="button"
            onClick={onOpenCommunityFeed}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{language === 'en' ? 'Open Community Activity & Baraza Feed' : 'Fungua Mtandao wa Wananchi na Baraza'}</span>
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Admin Password Change Card (if admin) */}
      {currentUser.role === 'admin' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en'
                ? `Change Password for ${currentUser.username}`
                : `Badilisha Nenosiri la ${currentUser.username}`}
            </h3>
          </div>

          {/* Admin alert notification note */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                {language === 'en'
                  ? 'Administrative alerts: All citizen question submissions are actively synchronized and notified to both Admin 1 and Admin 2.'
                  : 'Arifa za kiutawala: Maswali yote ya wananchi yanasawazishwa na kutumwa kwa barua pepe za Wasimamizi wote wawili.'}
              </span>
            </div>
          </div>

          {adminPassSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{adminPassSuccess}</span>
            </div>
          )}

          {adminPassError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{adminPassError}</span>
            </div>
          )}

          <form onSubmit={handleAdminChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Current Password' : 'Nenosiri la Sasa'}
              </label>
              <div className="relative">
                <input
                  type={showCurrentAdminPass ? 'text' : 'password'}
                  required
                  value={currentAdminPassword}
                  onChange={(e) => setCurrentAdminPassword(e.target.value)}
                  placeholder={language === 'en' ? 'Enter current password' : 'Weka nenosiri la sasa'}
                  className="w-full text-xs px-3 py-2 pr-9 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentAdminPass(!showCurrentAdminPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showCurrentAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'New Password (min 8 characters)' : 'Nenosiri Jipya (herufi 8+)'}
              </label>
              <div className="relative">
                <input
                  type={showNewAdminPass ? 'text' : 'password'}
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full text-xs px-3 py-2 pr-9 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowNewAdminPass(!showNewAdminPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showNewAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {newAdminPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {language === 'en' ? 'Strength:' : 'Nguvu:'} {adminNewPassStrength.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{adminNewPassStrength.feedbackMessage}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(adminNewPassStrength.score / 4) * 100}%`,
                        backgroundColor: adminNewPassStrength.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Confirm New Password' : 'Thibitisha Nenosiri Jipya'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmAdminPass ? 'text' : 'password'}
                  required
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full text-xs px-3 py-2 pr-9 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmAdminPass(!showConfirmAdminPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showConfirmAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {language === 'en' ? 'Update Admin Password' : 'Hifadhi Nenosiri Jipya'}
            </button>
          </form>
        </div>
      )}

      {/* 9. THE SAMARITAN: ADMIN 1-4 NAME ALLOCATION CONSOLE */}
      {currentUser.role === 'admin' &&
        (currentUser.username === 'The_Samaritan' ||
          currentUser.username.toLowerCase() === '@the_samaritan' ||
          currentUser.username.toLowerCase() === 'the samaritan' ||
          currentUser.username.toLowerCase() === 'sir chaucer') && (
          <AdminNameAllocationConsole
            language={language}
            currentUser={currentUser}
          />
        )}

      {/* Bottom Close Button at the bottom of the page */}
      <div className="pt-2 pb-6">
        <button
          type="button"
          onClick={() => {
            if (onClose) onClose();
            else if (onSelectTab) onSelectTab('home');
          }}
          className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <X className="w-4 h-4" />
          <span>{language === 'en' ? 'Close Profile' : 'Funga Wasifu'}</span>
        </button>
      </div>
    </div>
  );
};
