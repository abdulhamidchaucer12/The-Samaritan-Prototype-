import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  KeyRound,
  X,
  ShieldCheck,
  Bell,
  Check,
  Trash2,
  MapPin,
  Coins,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import {
  evaluatePasswordStrength,
  validateAnonymousUsername,
  registerAnonymousUser,
  loginUser,
  changeAdminPassword,
  getUserAvatar,
  setUserAvatar,
  removeUserAvatar,
  DEFAULT_CIVIC_AVATARS,
  getUserCounty,
  getUserSubCounty,
  setUserCounty,
  recoverAnonymousCitizenPassword,
  recoverAdminPassword,
} from '../utils/authAndQuestions';
import { KENYA_47_COUNTIES } from '../data/kenyaCounties';
import { getUserTokenBalance } from '../utils/facilitatorTokenRegistry';
import { OnlineUsersPresenceBar } from './OnlineUsersPresenceBar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  initialMode?: 'login' | 'register' | 'adminSettings' | 'recover';
  onOpenTokensModal?: () => void;
  onOpenCommunityFeed?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  onLoginSuccess,
  onLogout,
  initialMode = 'login',
  onOpenTokensModal,
  onOpenCommunityFeed,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'adminSettings' | 'recover'>(
    currentUser?.role === 'admin' ? 'adminSettings' : initialMode
  );

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password Recovery States
  const [recoverUserType, setRecoverUserType] = useState<'citizen' | 'admin'>('citizen');
  const [recoverCounty, setRecoverCounty] = useState('Kwale');
  const [recoverAdminSecret, setRecoverAdminSecret] = useState('');
  const [recoverNewPassword, setRecoverNewPassword] = useState('');
  const [recoverConfirmPassword, setRecoverConfirmPassword] = useState('');
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);

  // County states for Registration (Listing 47 counties)
  const [regCounty, setRegCounty] = useState('Kwale');
  const [regSubCounty, setRegSubCounty] = useState('Matuga');

  // County states for User Profile (Persistent)
  const [profileCounty, setProfileCounty] = useState<string>(() =>
    currentUser?.county || (currentUser ? getUserCounty(currentUser.username) : 'Kwale')
  );
  const [profileSubCounty, setProfileSubCounty] = useState<string>(() =>
    currentUser?.subCounty || (currentUser ? getUserSubCounty(currentUser.username) || '' : '')
  );
  const [countyFeedback, setCountyFeedback] = useState<string | null>(null);

  // Admin Change Password states
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [adminPassSuccess, setAdminPassSuccess] = useState<string | null>(null);
  const [adminPassError, setAdminPassError] = useState<string | null>(null);

  // Live password strength calculation
  const passwordStrength = evaluatePasswordStrength(password);
  const adminNewPassStrength = evaluatePasswordStrength(newAdminPassword);

  // Live username validation
  const usernameValidation = validateAnonymousUsername(username);

  // Profile picture state
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(() =>
    currentUser?.avatarUrl || getUserAvatar(currentUser?.username) || null
  );
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null);

  const handleSelectPreset = (presetIcon: string, presetBg: string) => {
    if (!currentUser) return;
    // Create canvas or SVG-based avatar for preset
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = presetBg.includes('emerald')
        ? '#059669'
        : presetBg.includes('amber')
        ? '#d97706'
        : presetBg.includes('blue')
        ? '#2563eb'
        : presetBg.includes('red')
        ? '#dc2626'
        : presetBg.includes('teal')
        ? '#0d9488'
        : '#4f46e5';
      ctx.beginPath();
      ctx.arc(60, 60, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '54px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(presetIcon, 60, 64);
      const dataUrl = canvas.toDataURL('image/png');
      setUserAvatar(currentUser.username, dataUrl);
      setCurrentAvatar(dataUrl);
      setAvatarFeedback(
        language === 'en' ? 'Civic avatar selected!' : 'Nembo ya wasifu imeteuliwa!'
      );
      setTimeout(() => setAvatarFeedback(null), 3000);
    }
  };

  const handleRemoveAvatar = () => {
    if (!currentUser) return;
    removeUserAvatar(currentUser.username);
    setCurrentAvatar(null);
    setAvatarFeedback(
      language === 'en' ? 'Profile picture removed.' : 'Picha imeondolewa.'
    );
    setTimeout(() => setAvatarFeedback(null), 3000);
  };

  const handleSaveProfileCounty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!profileCounty) {
      setCountyFeedback(
        language === 'en' ? 'Please select a valid county.' : 'Tafadhali chagua kaunti.'
      );
      return;
    }
    const ok = setUserCounty(currentUser.username, profileCounty, profileSubCounty);
    if (ok) {
      setCountyFeedback(
        language === 'en'
          ? `Home county saved: ${profileCounty}${profileSubCounty ? ` (${profileSubCounty})` : ''}!`
          : `Kaunti ya nyumbani imehifadhiwa: ${profileCounty}${profileSubCounty ? ` (${profileSubCounty})` : ''}!`
      );
      setTimeout(() => setCountyFeedback(null), 4000);
    }
  };

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!usernameValidation.isValid) {
      setErrorMsg(usernameValidation.errorMessage || 'Invalid username');
      return;
    }

    if (!regCounty) {
      setErrorMsg(language === 'en' ? 'Please select your Home County.' : 'Tafadhali chagua Kaunti yako.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg(
        language === 'en'
          ? 'Password must contain at least 8 characters.'
          : 'Nenosiri lazima liwe na angalau herufi 8.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        language === 'en' ? 'Passwords do not match.' : 'Manenosiri hayafanani.'
      );
      return;
    }

    const result = registerAnonymousUser(username, password, regCounty, regSubCounty);
    if (result.success && result.user) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        onLoginSuccess(result.user!);
        onClose();
      }, 700);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = loginUser(username, password);
    if (result.success && result.user) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        onLoginSuccess(result.user!);
        onClose();
      }, 600);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handlePasswordRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (recoverNewPassword.length < 8) {
      setErrorMsg(
        language === 'en'
          ? 'New password must contain at least 8 characters.'
          : 'Nenosiri jipya lazima liwe na angalau herufi 8.'
      );
      return;
    }

    if (recoverNewPassword !== recoverConfirmPassword) {
      setErrorMsg(
        language === 'en' ? 'Passwords do not match.' : 'Manenosiri hayafanani.'
      );
      return;
    }

    if (recoverUserType === 'citizen') {
      const res = recoverAnonymousCitizenPassword(username, recoverCounty, recoverNewPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setPassword(recoverNewPassword);
        setTimeout(() => {
          setMode('login');
          setSuccessMsg(
            language === 'en'
              ? 'Password recovered! You can now log in with your new password.'
              : 'Nenosiri limerejeshwa! Sasa unaweza kuingia kwa nenosiri lako jipya.'
          );
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = recoverAdminPassword(username, recoverAdminSecret, recoverNewPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setPassword(recoverNewPassword);
        setTimeout(() => {
          setMode('login');
          setSuccessMsg(
            language === 'en'
              ? 'Administrator password reset! You can now log in.'
              : 'Nenosiri la msimamizi limerejeshwa! Sasa unaweza kuingia.'
          );
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleAdminChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassError(null);
    setAdminPassSuccess(null);

    if (currentUser?.role !== 'admin') return;

    if (newAdminPassword.length < 8) {
      setAdminPassError(
        language === 'en'
          ? 'New password must contain at least 8 characters.'
          : 'Nenosiri jipya lazima liwe na angalau herufi 8.'
      );
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setAdminPassError(
        language === 'en' ? 'New passwords do not match.' : 'Manenosiri mapya hayafanani.'
      );
      return;
    }

    const adminName = currentUser.username as 'Admin 1' | 'Admin 2';
    const res = changeAdminPassword(adminName, currentAdminPassword, newAdminPassword);

    if (res.success) {
      setAdminPassSuccess(
        language === 'en'
          ? `Password for ${adminName} updated successfully!`
          : `Nenosiri la ${adminName} limebadilishwa kikamilifu!`
      );
      setCurrentAdminPassword('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } else {
      setAdminPassError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8"
      >
        {/* Top Kenyan Ribbon Accent */}
        <div className="h-1.5 kenya-ribbon" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shadow-xs">
              {currentUser?.role === 'admin' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-serif">
                {currentUser
                  ? currentUser.role === 'admin'
                    ? language === 'en'
                      ? 'Administrator Panel'
                      : 'Paneli ya Wasimamizi'
                    : language === 'en'
                    ? 'Citizen Profile'
                    : 'Akaunti ya Mwananchi'
                  : mode === 'register'
                  ? language === 'en'
                    ? 'Create Anonymous Account'
                    : 'Fungua Akaunti ya Siri'
                  : language === 'en'
                  ? 'Sign In / Admin Access'
                  : 'Ingia / Paneli ya Msimamizi'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentUser
                  ? `Logged in as ${currentUser.username}`
                  : language === 'en'
                  ? 'Ask questions & interact with public offices'
                  : 'Uliza maswali na kujifunza kuhusu serikali'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logged in state view */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            {/* User Details Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{currentUser.role === 'admin' ? 'AD' : '@'}</span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{currentUser.username}</span>
                  </div>
                  <div className="text-xs text-emerald-800 font-medium">
                    {currentUser.role === 'admin'
                      ? 'Verified Civic Administrator'
                      : 'Anonymous Citizen Handle'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMode('login');
                }}
                className="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                {language === 'en' ? 'Log Out' : 'Ondoka'}
              </button>
            </div>

            {/* Live Online Citizens Presence Indicator in Profile */}
            <OnlineUsersPresenceBar
              currentUser={currentUser}
              language={language}
              onOpenCommunityFeed={() => {
                onClose();
                if (onOpenCommunityFeed) onOpenCommunityFeed();
              }}
            />

            {/* Profile Picture Management Card (Available for ALL Users & Admins) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-bold text-xs text-slate-900 font-serif">
                    {language === 'en' ? 'Civic Badge Avatar' : 'Nembo ya Wasifu'}
                  </h4>
                </div>
                {currentAvatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="text-[11px] font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{language === 'en' ? 'Remove' : 'Ondoa'}</span>
                  </button>
                )}
              </div>

              {avatarFeedback && (
                <div className="p-2 bg-emerald-100 text-emerald-900 text-xs rounded-lg flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{avatarFeedback}</span>
                </div>
              )}

              {/* Civic Avatar Quick Presets (100% Free Zero-Media Uploads) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  {language === 'en' ? 'Select a civic badge avatar:' : 'Chagua nembo ya uraia:'}
                </span>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {DEFAULT_CIVIC_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      title={av.label}
                      onClick={() => handleSelectPreset(av.icon, av.bg)}
                      className="w-9 h-9 rounded-full bg-white border border-slate-300 hover:border-emerald-500 hover:scale-110 flex items-center justify-center text-lg transition-all shadow-2xs"
                    >
                      {av.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory Home County & Devolution Jurisdiction Card (47 Counties of Kenya) */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-bold text-xs text-slate-900 font-serif">
                    {language === 'en'
                      ? 'Home County & Devolution Jurisdiction (Mandatory)'
                      : 'Kaunti ya Nyumbani na Ugatuzi (Lazima)'}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {KENYA_47_COUNTIES.find((c) => c.name === profileCounty)?.code
                    ? `Code ${KENYA_47_COUNTIES.find((c) => c.name === profileCounty)?.code}`
                    : '47 Counties'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Anchors your civic feed, county assembly petitions, ward public participation barazas, and devolution budget hearings under Article 174 & 201.'
                  : 'Inakuunganisha na bunge la kaunti yako, ushiriki wa wananchi wadi, na vikao vya bajeti ya ugatuzi chini ya Kifungu cha 174 & 201.'}
              </p>

              {countyFeedback && (
                <div className="p-2.5 bg-emerald-100/90 text-emerald-900 text-xs rounded-lg flex items-center gap-2 font-medium border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{countyFeedback}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfileCounty} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Select County (1 - 47)' : 'Chagua Kaunti (1 - 47)'} *
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
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none pr-8 cursor-pointer"
                      >
                        {KENYA_47_COUNTIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {String(c.code).padStart(2, '0')} - {c.name} ({c.region})
                          </option>
                        ))}
                      </select>
                      <Globe className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Sub-County / Constituency' : 'Kaunti Ndogo / Eneo Bunge'}
                    </label>
                    <select
                      value={profileSubCounty}
                      onChange={(e) => setProfileSubCounty(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
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

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="font-semibold text-emerald-800">
                      {language === 'en' ? 'Current Jurisdiction:' : 'Kaunti Yako Sasa:'}
                    </span>
                    <span>
                      {profileCounty}
                      {profileSubCounty ? ` • ${profileSubCounty}` : ''}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Save Home County' : 'Hifadhi Kaunti'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Samaritan Facilitator Tokens & Civic Credits Card (Moved from header to profile) */}
            <div className="p-4 rounded-xl border border-amber-200 bg-linear-to-br from-amber-50/70 to-yellow-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-700" />
                  <h4 className="font-bold text-xs text-slate-900 font-serif">
                    {language === 'en'
                      ? 'Facilitator Tokens & Baraza Credits'
                      : 'Ishara za Uwezeshaji na Mikopo ya Baraza'}
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
                  <span>🪙</span>
                  <span>
                    {currentUser
                      ? getUserTokenBalance(currentUser.username).availableBalance
                      : 0}{' '}
                    TKNS
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'Facilitator Tokens are awarded by The Samaritan to civic facilitators, baraza conveners, and youth leaders conducting grassroots Constitution training across all 47 counties.'
                  : 'Ishara za uwezeshaji hutolewa na Msamaria kwa viongozi wa vijana na wawezeshaji wa baraza wanaofanya mafunzo ya Katiba nyanjani katika kaunti zote 47.'}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-lg border border-amber-200/80">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    {language === 'en' ? 'Total Earned' : 'Jumla Iliyopatikana'}
                  </span>
                  <span className="font-bold text-emerald-700">
                    +{currentUser ? getUserTokenBalance(currentUser.username).totalAwarded : 0} Tokens
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    {language === 'en' ? 'Status' : 'Hali ya Mwananchi'}
                  </span>
                  <span className="font-bold text-blue-700">
                    {currentUser?.role === 'admin'
                      ? 'Administrator Custodian'
                      : 'Active Grassroots Citizen'}
                  </span>
                </div>
              </div>

              {onOpenTokensModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTokensModal();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5" />
                    <span>
                      {language === 'en'
                        ? 'Open Facilitator Tokens & Baraza Registry'
                        : 'Fungua Daftari la Ishara na Mafunzo'}
                    </span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Admin-only password change section */}
            {currentUser.role === 'admin' && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-700" />
                  <h4 className="font-bold text-sm text-slate-900 font-serif">
                    {language === 'en'
                      ? `Change Password for ${currentUser.username}`
                      : `Badilisha Nenosiri la ${currentUser.username}`}
                  </h4>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>
                      {language === 'en'
                        ? 'Administrative alerts: All citizen question submissions are actively synchronized and notified to both Admin 1 and Admin 2.'
                        : 'Arifa za kiutawala: Maswali yote ya wananchi yanasawazishwa na kutumwa kwa barua pepe za Wasimamizi wote wawili.'}
                    </span>
                  </div>
                </div>

                {adminPassSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{adminPassSuccess}</span>
                  </div>
                )}

                {adminPassError && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{adminPassError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Current Password' : 'Nenosiri la Sasa'}
                    </label>
                    <input
                      type="password"
                      required
                      value={currentAdminPassword}
                      onChange={(e) => setCurrentAdminPassword(e.target.value)}
                      placeholder={language === 'en' ? 'Enter current password' : 'Weka nenosiri la sasa'}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'New Password (min 8 characters)' : 'Nenosiri Jipya (herufi 8+)'}
                    </label>
                    <input
                      type="password"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {newAdminPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-600">
                            Strength: {adminNewPassStrength.label}
                          </span>
                          <span className="text-slate-500">{adminNewPassStrength.feedbackMessage}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: adminNewPassStrength.color }}
                            animate={{ width: `${(adminNewPassStrength.score / 4) * 100}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Confirm New Password' : 'Thibitisha Nenosiri Jipya'}
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    {language === 'en' ? 'Update Admin Password' : 'Hifadhi Nenosiri Jipya'}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* Authentication Forms: Login or Register */
          <div className="p-6">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 shadow-xs ring-1 ring-slate-200 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {language === 'en' ? 'Citizen Sign Up' : 'Jisajili'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 shadow-xs ring-1 ring-slate-200 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {language === 'en' ? 'Log In / Admin' : 'Ingia / Admin'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('recover');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'recover'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-800 dark:text-amber-400 hover:text-amber-900'
                }`}
              >
                {language === 'en' ? 'Forgot Pass' : 'Rejesha'}
              </button>
            </div>

            {/* Error or Success alerts */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {mode === 'register' ? (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">
                      {language === 'en' ? 'Instagram-Style Anonymous Handle' : 'Jina la Siri Mtindo wa Instagram'}
                    </strong>
                    {language === 'en'
                      ? 'Pick an anonymous username (e.g. @mwananchi_kwale, @voice_of_tiwi). Both username and password must have at least 8 characters.'
                      : 'Chagua jina la utani lenye herufi 8 au zaidi kuanzia na @. Nenosiri nalo lazima liwe na herufi 8 au zaidi.'}
                  </div>
                </div>

                {/* Username Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Anonymous Username' : 'Jina la Utani (Handle)'} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@mwananchi_2026"
                      className={`w-full text-sm px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 font-mono ${
                        username && !usernameValidation.isValid
                          ? 'border-red-400 focus:ring-red-500 bg-red-50/30'
                          : username && usernameValidation.isValid
                          ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/30'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    />
                    <div className="absolute right-3 top-2.5 text-xs">
                      {username && usernameValidation.isValid ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : username ? (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {username.replace('@', '').length}/8
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {username && !usernameValidation.isValid && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">
                      {usernameValidation.errorMessage}
                    </p>
                  )}
                </div>

                {/* Mandatory Home County Dropdown Selection (Listing all 47 Counties of Kenya) */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {language === 'en' ? 'Home County (Mandatory)' : 'Kaunti ya Nyumbani (Lazima)'} *
                    </label>
                    <span className="text-[10px] text-emerald-800 font-semibold">
                      {KENYA_47_COUNTIES.find((c) => c.name === regCounty)?.code
                        ? `Code ${KENYA_47_COUNTIES.find((c) => c.name === regCounty)?.code}`
                        : '47 Counties'}
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      required
                      value={regCounty}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRegCounty(val);
                        const cObj = KENYA_47_COUNTIES.find((c) => c.name === val);
                        if (cObj && cObj.subCounties.length > 0) {
                          setRegSubCounty(cObj.subCounties[0]);
                        } else {
                          setRegSubCounty('');
                        }
                      }}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none pr-8 cursor-pointer"
                    >
                      {KENYA_47_COUNTIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {String(c.code).padStart(2, '0')} - {c.name} ({c.region})
                        </option>
                      ))}
                    </select>
                    <Globe className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>

                  {/* Sub-County selection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {language === 'en' ? 'Sub-County / Constituency' : 'Kaunti Ndogo / Eneo Bunge'}
                    </label>
                    <select
                      value={regSubCounty}
                      onChange={(e) => setRegSubCounty(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="">
                        {language === 'en' ? '-- Select Sub-County --' : '-- Chagua Kaunti Ndogo --'}
                      </option>
                      {(KENYA_47_COUNTIES.find((c) => c.name === regCounty)?.subCounties || []).map(
                        (sc) => (
                          <option key={sc} value={sc}>
                            {sc}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {language === 'en'
                      ? 'Anchors your civic participation to your local county government across Kenya.'
                      : 'Hukuweka katika mifumo ya ugatuzi na mabaraza ya kaunti yako nchini Kenya.'}
                  </p>
                </div>

                {/* Password Input with Real-time Strength Meter */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {language === 'en' ? 'Password' : 'Nenosiri'} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>{language === 'en' ? 'Hide' : 'Ficha'}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>{language === 'en' ? 'Show' : 'Onyesha'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  {/* Password Strength Evaluation Box */}
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700">
                        {language === 'en' ? 'Password Strength:' : 'Nguvu ya Nenosiri:'}
                      </span>
                      <span
                        className="font-bold px-2 py-0.5 rounded text-[11px]"
                        style={{
                          backgroundColor: `${passwordStrength.color}20`,
                          color: passwordStrength.color,
                        }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Animated Strength Progress Bar */}
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full rounded-full transition-all"
                        style={{ backgroundColor: passwordStrength.color }}
                        animate={{ width: `${Math.max(10, (passwordStrength.score / 4) * 100)}%` }}
                        transition={{ duration: 0.25 }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 mb-2">
                      {passwordStrength.feedbackMessage}
                    </p>

                    {/* Live Criteria Checklist */}
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 border-t border-slate-200/80 pt-2">
                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasMinLength ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={passwordStrength.hasMinLength ? 'font-semibold text-slate-900' : ''}>
                          At least 8 chars ({password.length}/8)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasUppercase ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={passwordStrength.hasUppercase ? 'font-semibold text-slate-900' : ''}>
                          Uppercase letter (A-Z)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasNumber ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={passwordStrength.hasNumber ? 'font-semibold text-slate-900' : ''}>
                          Number (0-9)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasSpecialChar ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={passwordStrength.hasSpecialChar ? 'font-semibold text-slate-900' : ''}>
                          Special symbol (!@#$)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Confirm Password' : 'Rudia Nenosiri'} *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className={`w-full text-sm px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-red-400 focus:ring-red-500'
                        : confirmPassword && confirmPassword === password
                        ? 'border-emerald-400 focus:ring-emerald-500'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!usernameValidation.isValid || password.length < 8}
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                    !usernameValidation.isValid || password.length < 8
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-lg'
                  }`}
                >
                  {language === 'en' ? 'Create Anonymous Account' : 'Fungua Akaunti ya Siri'}
                </button>
              </form>
            ) : mode === 'login' ? (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Username or Handle' : 'Jina la Mtumiaji au Msimamizi'}
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. @mwananchi_kwale or Admin 1"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {language === 'en' ? 'Password' : 'Nenosiri'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {language === 'en' ? 'Log In' : 'Ingia'}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('recover');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      setRecoverNewPassword('');
                      setRecoverConfirmPassword('');
                    }}
                    className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-semibold"
                  >
                    {language === 'en'
                      ? 'Forgot password? Recover account access'
                      : 'Umesahau nenosiri? Rejesha uwezo wa kuingia'}
                  </button>
                </div>
              </form>
            ) : (
              /* Password Recovery Form (Citizen via Home County / Admin via Master Security Key) */
              <form onSubmit={handlePasswordRecoverySubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">
                      {language === 'en'
                        ? 'Secure Account Password Recovery'
                        : 'Urejeshaji Salama wa Nenosiri'}
                    </strong>
                    {language === 'en'
                      ? 'Citizens verify their account through their registered Home County jurisdiction. Administrators use the Master Security Key.'
                      : 'Wananchi wanathibitisha akaunti yao kupitia Kaunti ya nyumbani waliyosajili. Wasimamizi wanatumia Ufunguo Mkuu wa Usalama.'}
                  </div>
                </div>

                {/* Switch between Citizen handle and Admin account */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setRecoverUserType('citizen')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      recoverUserType === 'citizen'
                        ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {language === 'en' ? 'Citizen Account' : 'Akaunti ya Mwananchi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecoverUserType('admin')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      recoverUserType === 'admin'
                        ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {language === 'en' ? 'Civic Admin' : 'Msimamizi wa Uraia'}
                  </button>
                </div>

                {/* Handle Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {recoverUserType === 'citizen'
                      ? language === 'en'
                        ? 'Citizen Handle'
                        : 'Jina la Utani'
                      : language === 'en'
                      ? 'Admin Handle'
                      : 'Jina la Msimamizi'}{' '}
                    *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={recoverUserType === 'citizen' ? '@mwananchi_kwale' : '@admin.kfe1 or Admin 1'}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Citizen Verification: Home County Selection */}
                {recoverUserType === 'citizen' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {language === 'en'
                        ? 'Registered Home County (Identity Verification)'
                        : 'Kaunti ya Nyumbani Uliyosajili'} *
                    </label>
                    <select
                      required
                      value={recoverCounty}
                      onChange={(e) => setRecoverCounty(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {KENYA_47_COUNTIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.code}. {c.name} County
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Administrative Master Security Key' : 'Ufunguo Mkuu wa Usalama'} *
                    </label>
                    <input
                      type="password"
                      required
                      value={recoverAdminSecret}
                      onChange={(e) => setRecoverAdminSecret(e.target.value)}
                      placeholder="Enter administrative master recovery key"
                      className="w-full text-sm px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      {language === 'en'
                        ? 'Available to authorized administrators from The_Samaritan platform custody.'
                        : 'Inatolewa kwa wasimamizi walioidhinishwa na The_Samaritan.'}
                    </p>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {language === 'en' ? 'New Password' : 'Nenosiri Jipya'} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRecoverPassword(!showRecoverPassword)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      {showRecoverPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showRecoverPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showRecoverPassword ? 'text' : 'password'}
                    required
                    value={recoverNewPassword}
                    onChange={(e) => setRecoverNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 8 characters)"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Confirm New Password' : 'Thibitisha Nenosiri Jipya'} *
                  </label>
                  <input
                    type="password"
                    required
                    value={recoverConfirmPassword}
                    onChange={(e) => setRecoverConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {recoverConfirmPassword && recoverConfirmPassword !== recoverNewPassword && (
                    <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={recoverNewPassword.length < 8 || recoverNewPassword !== recoverConfirmPassword}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {language === 'en' ? 'Set New Password & Restore Access' : 'Weka Nenosiri Jipya & Fungua'}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    {language === 'en' ? 'Back to Login' : 'Rudi kwenye Kuingia'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
