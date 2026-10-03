import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Sparkles,
  Send,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Shield,
  Search,
  Lock,
} from 'lucide-react';
import {
  Language,
  AuthUser,
  FacilitatorTrainingCertificate,
} from '../types';
import {
  getUserTokenBalance,
  redeemTokensForFacilitatorCert,
  getAllFacilitatorCertificates,
  TOKENS_REQUIRED_FOR_FACILITATOR_CERT,
  transferTokensBetweenUsers,
} from '../utils/facilitatorTokenRegistry';
import { UserBadge } from './UserBadge';
import { KENYA_47_COUNTIES } from '../data/kenyaCounties';
import { getRegisteredUsers, getUserCounty, getUserSubCounty } from '../utils/authAndQuestions';

interface FacilitatorTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: AuthUser | null;
  initialTab?: 'overview' | 'share' | 'history';
  prefilledRecipient?: string;
}

export const FacilitatorTokensModal: React.FC<FacilitatorTokensModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  initialTab = 'overview',
  prefilledRecipient = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'share' | 'history'>('overview');
  const [tokenData, setTokenData] = useState(() =>
    getUserTokenBalance(currentUser?.username)
  );
  const [userCerts, setUserCerts] = useState<FacilitatorTrainingCertificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<FacilitatorTrainingCertificate | null>(null);

  // Certificate Redemption Form State
  const initialCounty = currentUser?.county || getUserCounty(currentUser?.username);
  const initialSubCounty = currentUser?.subCounty || getUserSubCounty(currentUser?.username);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.username || '');
  const [certCounty, setCertCounty] = useState(initialCounty);
  const [certSubCounty, setCertSubCounty] = useState(initialSubCounty || '');
  const [location, setLocation] = useState(
    `${initialCounty} County Civic Training Centre${initialSubCounty ? ` (${initialSubCounty})` : ''}`
  );
  const [topic, setTopic] = useState('Civic Education & Community Baraza Facilitation (Samaritan Physical Training)');
  const [redemptionMsg, setRedemptionMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Share Tokens Form State
  const [shareRecipient, setShareRecipient] = useState(prefilledRecipient);
  const [shareAmount, setShareAmount] = useState<number>(1);
  const [shareNote, setShareNote] = useState('');
  const [shareSearchFilter, setShareSearchFilter] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Registered Citizens for Recipient Autocomplete
  const [allCitizens, setAllCitizens] = useState<{ username: string; county: string }[]>([]);

  const loadData = () => {
    if (!currentUser?.username) return;
    const balance = getUserTokenBalance(currentUser.username);
    setTokenData(balance);

    const allCerts = getAllFacilitatorCertificates();
    const clean = currentUser.username.trim().toLowerCase();
    const mine = allCerts.filter((c) => c.recipientUsername.toLowerCase() === clean);
    setUserCerts(mine);

    try {
      const reg = getRegisteredUsers();
      const currentClean = currentUser.username.toLowerCase().replace(/^@/, '');
      const filtered = reg
        .filter((u) => u.username.toLowerCase().replace(/^@/, '') !== currentClean)
        .map((u) => ({ username: u.username, county: u.county || 'Kenya' }));
      setAllCitizens(filtered);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadData();
      if (initialTab) setActiveTab(initialTab);
      if (prefilledRecipient) setShareRecipient(prefilledRecipient.replace(/^@/, ''));
      const county = currentUser.county || getUserCounty(currentUser.username);
      const subCounty = currentUser.subCounty || getUserSubCounty(currentUser.username);
      setCertCounty(county);
      setCertSubCounty(subCounty || '');
      setLocation(`${county} County Civic Training Centre${subCounty ? ` (${subCounty})` : ''}`);
      if (!fullName) setFullName(currentUser.username);
    }
  }, [isOpen, currentUser, initialTab, prefilledRecipient]);

  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('the_samaritan_tokens_updated', handleUpdate);
    window.addEventListener('the_samaritan_facilitator_certs_updated', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_tokens_updated', handleUpdate);
      window.removeEventListener('the_samaritan_facilitator_certs_updated', handleUpdate);
    };
  }, [currentUser]);

  if (!isOpen) return null;

  // Handle Certificate Redemption Submit
  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const res = redeemTokensForFacilitatorCert(
      currentUser.username,
      fullName.trim() || currentUser.username,
      topic,
      location
    );

    setRedemptionMsg({ success: res.success, text: res.message });

    if (res.success && res.certificate) {
      loadData();
      setIsRedeeming(false);
      setSelectedCert(res.certificate);
    }
  };

  // Handle Token Sharing Submit
  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setShareFeedback(null);
    setIsSharing(true);

    try {
      const res = transferTokensBetweenUsers(
        currentUser.username,
        shareRecipient,
        shareAmount,
        shareNote
      );

      if (res.success) {
        setShareFeedback({ type: 'success', message: res.message });
        setShareNote('');
        setShareAmount(1);
        loadData();
      } else {
        setShareFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setShareFeedback({ type: 'error', message: err?.message || 'Failed to share tokens' });
    } finally {
      setIsSharing(false);
    }
  };

  // Filtered recipient suggestions
  const filteredCitizens = allCitizens.filter((c) =>
    c.username.toLowerCase().includes(shareSearchFilter.toLowerCase().replace(/^@/, '')) ||
    c.county.toLowerCase().includes(shareSearchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center text-amber-200 shadow-inner shrink-0">
              <Coins className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Samaritan Civic Token Hub</span>
              </div>
              <h3 className="font-serif font-bold text-xl leading-tight">
                {language === 'en'
                  ? 'Facilitator Tokens & Registry'
                  : 'Tokeni za Uwezeshaji na Vyeti'}
              </h3>
              <p className="text-xs text-amber-100/80">
                {language === 'en'
                  ? 'Earn, share tokens with peers, & redeem physical training certificates'
                  : 'Pata, shiriki tokeni na wenzako, na chukua vyeti rasmi vya uwezeshaji'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto shrink-0 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{language === 'en' ? 'Overview & Certs' : 'Muhtasari na Vyeti'}</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'share'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{language === 'en' ? 'Share Tokens' : 'Gawa Tokeni'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
              P2P
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'history'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{language === 'en' ? 'Token Ledger' : 'Daftari la Tokeni'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto grow">
          {/* Active Balance Ribbon */}
          {currentUser && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {language === 'en' ? 'Available Tokens' : 'Tokeni Zilizopo'}
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 dark:text-amber-100 font-mono truncate">
                    {tokenData.availableBalance.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                    {language === 'en' ? 'tokens' : 'tokeni'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Total Earned / Received' : 'Jumla ya Tokeni'}
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono truncate">
                    {tokenData.totalAwarded.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {language === 'en' ? 'lifetime' : 'jumla'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  {language === 'en' ? 'Tokens Spent / Redeemed' : 'Tokeni Zilizotumika'}
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 font-mono truncate">
                    {tokenData.totalRedeemed.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                    {language === 'en' ? 'spent' : 'zimetumika'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW & CERTIFICATES */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {tokenData.isUnlimitedAuthority && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-emerald-500/20 border border-amber-400 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-xs block">
                        {language === 'en'
                          ? 'The_Samaritan Supreme Treasury: 30,000,000 Annual Tokens'
                          : 'Hazina Kuu ya Msamaria: Tokeni 30,000,000 za Kila Mwaka'}
                      </span>
                      <span className="text-[11px] text-amber-800 dark:text-amber-300">
                        {language === 'en'
                          ? 'Automatically renews every year on January 1st • Supreme token issuance & grant authority'
                          : 'Inajisasisha kiotomatiki kila mwaka tarehe 1 Januari • Mamlaka kuu ya kugawa tokeni za uwezeshaji'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white font-black text-[10px] tracking-wider uppercase shrink-0">
                    Supreme Quota Active
                  </span>
                </div>
              )}

              {/* How to Earn Banner */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-teal-950 dark:text-teal-200 leading-relaxed">
                  <span className="font-bold block mb-0.5">
                    {language === 'en' ? 'How to Earn More Tokens:' : 'Jinsi ya Kupata Tokeni Zaidi:'}
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-teal-900/90 dark:text-teal-300">
                    <li>
                      <strong>5 Tokens:</strong>{' '}
                      {language === 'en'
                        ? 'Automatically earn 5 tokens for every course completed with an 80%+ quiz score!'
                        : 'Pata tokeni 5 kiotomatiki kwa kila somo ukifaulu chemsha bongo kwa 80%+!'}
                    </li>
                    <li>
                      <strong>Peer Sharing:</strong>{' '}
                      {language === 'en'
                        ? 'Receive token gifts from fellow citizens or community facilitators.'
                        : 'Pokea zawadi za tokeni kutoka kwa wananchi au wawezeshaji wenzako.'}
                    </li>
                    <li>
                      <strong>Usage:</strong>{' '}
                      {language === 'en'
                        ? 'Share tokens with peer citizens or redeem official facilitator training certificates (5 tokens).'
                        : 'Shiriki tokeni na wananchi wenzako au chukua vyeti rasmi vya uwezeshaji (tokeni 5).'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Facilitator Certificate Progress & Redemption Card */}
              {currentUser && (
                <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/15 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
                          {language === 'en'
                            ? 'Facilitator Certificate of Physical Training'
                            : 'Cheti cha Uwezeshaji cha Mafunzo ya Ana kwa Ana'}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? `Exchange ${TOKENS_REQUIRED_FOR_FACILITATOR_CERT} tokens for an authorized physical training certificate with serial verification.`
                          : `Badilisha tokeni ${TOKENS_REQUIRED_FOR_FACILITATOR_CERT} kwa cheti rasmi chenye nambari ya uthibitisho ya usajili.`}
                      </p>
                    </div>

                    {tokenData.availableBalance >= TOKENS_REQUIRED_FOR_FACILITATOR_CERT && !isRedeeming && (
                      <button
                        onClick={() => setIsRedeeming(true)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 shrink-0"
                      >
                        <Award className="w-4 h-4" />
                        <span>{language === 'en' ? 'Redeem Certificate' : 'Chukua Cheti'}</span>
                      </button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>{language === 'en' ? 'Token Goal Progress' : 'Maendeleo ya Tokeni'}</span>
                      <span className="font-mono font-bold text-amber-800 dark:text-amber-400">
                        {tokenData.availableBalance} / {TOKENS_REQUIRED_FOR_FACILITATOR_CERT}
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (tokenData.availableBalance / TOKENS_REQUIRED_FOR_FACILITATOR_CERT) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Redemption Message */}
                  {redemptionMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        redemptionMsg.success
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {redemptionMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                      <span>{redemptionMsg.text}</span>
                    </div>
                  )}

                  {/* Form when redeeming */}
                  {isRedeeming && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={handleRedeemSubmit}
                      className="pt-3 border-t border-amber-200 dark:border-amber-800 space-y-3"
                    >
                      <h5 className="font-bold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                        {language === 'en' ? 'Certificate Personalization' : 'Maelezo ya Cheti'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'en' ? 'Full Name on Certificate' : 'Jina Kamili Kwenye Cheti'}
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Hassan Mohamed Athman"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {language === 'en' ? 'Training County' : 'Kaunti ya Mafunzo'}
                          </label>
                          <select
                            value={certCounty}
                            onChange={(e) => {
                              setCertCounty(e.target.value);
                              setLocation(`${e.target.value} County Civic Training Centre`);
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          >
                            {KENYA_47_COUNTIES.map((c) => (
                              <option key={c.code} value={c.name}>
                                {c.name} County
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsRedeeming(false)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        >
                          {language === 'en' ? 'Cancel' : 'Ghairi'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
                        >
                          {language === 'en' ? 'Confirm & Issue (5 Tokens)' : 'Thibitisha (Tokeni 5)'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              )}

              {/* My Issued Certificates */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{language === 'en' ? 'My Issued Facilitator Certificates' : 'Vyeti Vyangu Rasmi'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    {userCerts.length}
                  </span>
                </h4>

                {userCerts.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    {language === 'en'
                      ? 'No certificates issued yet. Complete course quizzes to accumulate 5 tokens and redeem your official physical facilitator credential!'
                      : 'Hujatolewa cheti bado. Kamilisha chemsha bongo kupata tokeni 5 ili kuchukua cheti chako!'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userCerts.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 shadow-xs flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                              {cert.serialNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(cert.issuedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2 font-serif">
                            {cert.recipientFullName}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {cert.trainingTopic}
                          </p>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <span>📍 {cert.location}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="w-full py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'View & Print Certificate' : 'Ona na Chapisha Cheti'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SHARE TOKENS */}
          {activeTab === 'share' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-teal-500/15 border border-amber-300 dark:border-amber-800/60 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {language === 'en' ? 'Citizen-to-Citizen Token Sharing' : 'Kushiriki Tokeni kwa Wananchi'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {language === 'en'
                      ? 'Send tokens to any fellow citizen. When they receive tokens, they will be automatically notified with your name as the generous sender!'
                      : 'Mtumie mwananchi mwenzako tokeni. Akizipokea ataarifiwa kiotomatiki na jina lako kama mtumaji!'}
                  </p>
                </div>
              </div>

              {/* Share Feedback */}
              {shareFeedback && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    shareFeedback.type === 'success'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}
                >
                  {shareFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{shareFeedback.message}</span>
                </div>
              )}

              {/* Share Form */}
              <form onSubmit={handleShareSubmit} className="space-y-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {/* Recipient Input & Search */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {language === 'en' ? 'Recipient Citizen Handle:' : 'Jina la Mtumiaji Mpokeaji:'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={shareRecipient}
                      onChange={(e) => {
                        setShareRecipient(e.target.value);
                        setShareSearchFilter(e.target.value);
                      }}
                      placeholder="e.g. fatuma_mombasa or john_doe"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>

                  {/* Suggestions Chips */}
                  {shareSearchFilter && filteredCitizens.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 max-h-24 overflow-y-auto">
                      <span className="text-[10px] text-slate-400">Suggestions:</span>
                      {filteredCitizens.slice(0, 6).map((c) => (
                        <button
                          key={c.username}
                          type="button"
                          onClick={() => {
                            setShareRecipient(c.username);
                            setShareSearchFilter('');
                          }}
                          className="px-2 py-0.5 text-[11px] rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 font-mono transition-colors"
                        >
                          @{c.username} ({c.county})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amount Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {language === 'en' ? 'Tokens to Transfer:' : 'Kiasi cha Tokeni za Kutuma:'}
                    </label>
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-bold font-mono">
                      Available: {tokenData.availableBalance}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {[1, 2, 5, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setShareAmount(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          shareAmount === preset
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {preset} {preset === 1 ? 'Token' : 'Tokens'}
                      </button>
                    ))}

                    <input
                      type="number"
                      min={1}
                      max={tokenData.isUnlimitedAuthority ? 100000 : tokenData.availableBalance}
                      value={shareAmount}
                      onChange={(e) => setShareAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {language === 'en' ? 'Civic Note / Message (Optional):' : 'Ujumbe au Sababu (Hiari):'}
                  </label>
                  <input
                    type="text"
                    value={shareNote}
                    onChange={(e) => setShareNote(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'e.g. Great job on the civic debate! Here are tokens for photo uploads.'
                        : 'mfano: Kazi nzuri kwenye baraza! Hizi hapa tokeni za kupakia picha.'
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSharing || !shareRecipient.trim() || (!tokenData.isUnlimitedAuthority && tokenData.availableBalance < shareAmount)}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSharing
                        ? 'Transferring...'
                        : language === 'en'
                        ? `Send ${shareAmount} Token(s) to @${shareRecipient || '...'}`
                        : `Tuma Tokeni ${shareAmount} kwa @${shareRecipient || '...'}`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: TOKEN LEDGER & AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {language === 'en' ? 'Immutable Token Ledger & Audit History' : 'Daftari la Ukaguzi wa Tokeni'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Detailed breakdown of all token grants received, quiz rewards, peer shares, and expenditures'
                      : 'Mchanganuo wa tokeni zilizopokelewa, zilizotumwa, na matumizi mengine'}
                  </p>
                </div>
              </div>

              {/* Incoming Grants */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  <span>Tokens Received & Earned (Grants & Quizzes)</span>
                </h5>

                {tokenData.grants.length === 0 ? (
                  <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-400">
                    No token grants recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tokenData.grants.map((grant) => (
                      <div
                        key={grant.id}
                        className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-950 dark:text-emerald-200">
                              +{grant.amount} Token(s)
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">
                              From: @{grant.grantedBy}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px]">{grant.reason}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(grant.grantedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outgoing Expenditures */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-amber-600" />
                  <span>Tokens Spent & Shared (Transfers, Photos, Certs)</span>
                </h5>

                {tokenData.expenditures.length === 0 && userCerts.length === 0 ? (
                  <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-400">
                    No expenditures or transfers recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Facilitator Certificates */}
                    {userCerts.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-950 dark:text-amber-200">
                              -{c.tokensRedeemed} Tokens
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold">
                              Facilitator Certificate
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                            Serial #{c.serialNumber} • {c.trainingTopic}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(c.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}

                    {/* Other expenditures */}
                    {tokenData.expenditures.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              -{exp.amount} Token(s)
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                              {exp.type}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">{exp.description}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(exp.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Chapter Six Certified • Lead Facilitator Abdulhamid Chaucer</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            {language === 'en' ? 'Close' : 'Funga'}
          </button>
        </div>
      </motion.div>

      {/* Printable Certificate Modal Preview */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl border-4 border-amber-400/80 shadow-2xl w-full max-w-3xl overflow-hidden p-8 space-y-6 my-6 relative"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Certificate Canvas */}
              <div className="border-4 border-double border-amber-600/60 p-8 rounded-2xl bg-amber-50/20 text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-amber-800">
                  <Shield className="w-6 h-6 text-amber-600" />
                  <span className="font-mono text-xs font-black tracking-widest uppercase">
                    THE SAMARITAN CIVIC EDUCATION FOUNDATION
                  </span>
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>

                <div className="space-y-1">
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-wide">
                    CERTIFICATE OF PHYSICAL TRAINING
                  </h2>
                  <p className="text-xs font-mono text-amber-800 uppercase tracking-wider">
                    Community Baraza Facilitator Accreditation
                  </p>
                </div>

                <p className="text-xs text-slate-600 italic">This is to certify that</p>

                <div className="border-b-2 border-amber-600/40 pb-2 max-w-md mx-auto">
                  <span className="font-serif font-black text-2xl text-slate-900">
                    {selectedCert.recipientFullName}
                  </span>
                </div>

                <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                  has successfully attended, participated in, and fulfilled the civic education physical training requirement for
                  <span className="font-bold text-slate-900 block mt-1">
                    "{selectedCert.trainingTopic}"
                  </span>
                  under Article 10 (National Values and Principles of Governance) and Chapter Six (Leadership and Integrity) of the Constitution of Kenya.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Location / Venue</span>
                    <span className="font-bold text-slate-800">{selectedCert.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Serial Number</span>
                    <span className="font-mono font-bold text-amber-800">{selectedCert.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Authorized Signatory</span>
                    <span className="font-serif font-bold text-slate-900">{selectedCert.authorizedBy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  {language === 'en' ? 'Back' : 'Rudi'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'en' ? 'Print Certificate' : 'Chapisha Cheti'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
