import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCheck,
  CheckCircle2,
  XCircle,
  Crown,
  Search,
  UserCheck,
  Users,
  Award,
  Sparkles,
  AlertCircle,
  Filter,
  Check,
  Clock,
  Coins,
  BookOpen,
  MessageSquare,
  Trash2,
  RefreshCw,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  UserVerificationRecord,
  VerificationRequest,
  VerificationBadgeTier,
  Language,
} from '../types';
import {
  getAllVerifiedUsers,
  getAllVerificationRequests,
  verifyUser,
  revokeVerification,
  updateVerificationTier,
  grantVerificationRequest,
  denyVerificationRequest,
  cleanUsername,
} from '../utils/userVerificationService';
import { getRegisteredUsers, getUserCounty } from '../utils/authAndQuestions';
import { UserBadge } from './UserBadge';

interface UserVerificationConsoleProps {
  language: Language;
  actorUsername?: string;
  onNavigateToUser?: (username: string) => void;
}

export const UserVerificationConsole: React.FC<UserVerificationConsoleProps> = ({
  language,
  actorUsername = 'The_Samaritan',
  onNavigateToUser,
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'requests' | 'direct_verify'>('requests');

  // Direct Verify Form State
  const [targetUsername, setTargetUsername] = useState('');
  const [selectedTier, setSelectedTier] = useState<VerificationBadgeTier>('double_tick');
  const [customTitleEn, setCustomTitleEn] = useState('');
  const [customTitleSw, setCustomTitleSw] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Denial Modal State
  const [denyingRequest, setDenyingRequest] = useState<VerificationRequest | null>(null);
  const [denialReason, setDenialReason] = useState('');

  // Data State
  const [verifiedUsers, setVerifiedUsers] = useState<UserVerificationRecord[]>(() => getAllVerifiedUsers());
  const [requests, setRequests] = useState<VerificationRequest[]>(() => getAllVerificationRequests());
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'single_tick' | 'double_tick'>('all');
  const [requestFilter, setRequestFilter] = useState<'pending' | 'all' | 'granted' | 'denied'>('pending');

  const registeredUsers = useMemo(() => getRegisteredUsers(), []);

  const refreshData = () => {
    setVerifiedUsers(getAllVerifiedUsers());
    setRequests(getAllVerificationRequests());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('the_samaritan_verifications_updated', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_verifications_updated', handleUpdate);
    };
  }, []);

  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === 'pending').length;
  }, [requests]);

  const singleTickCount = useMemo(() => {
    return verifiedUsers.filter((u) => u.badgeTier === 'single_tick').length;
  }, [verifiedUsers]);

  const doubleTickCount = useMemo(() => {
    return verifiedUsers.filter((u) => u.badgeTier === 'double_tick').length;
  }, [verifiedUsers]);

  // Handle direct verification submission
  const handleDirectVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const clean = cleanUsername(targetUsername);
    if (!clean) {
      setFormFeedback({
        type: 'error',
        message: language === 'en' ? 'Please enter a valid username.' : 'Tafadhali weka jina sahihi la mtumiaji.',
      });
      return;
    }

    const res = verifyUser(clean, selectedTier, {
      verifiedBy: actorUsername,
      badgeTitleEn: customTitleEn || undefined,
      badgeTitleSw: customTitleSw || undefined,
      notes: adminNotes || undefined,
      source: 'direct_admin_action',
    });

    if (res.success) {
      setFormFeedback({ type: 'success', message: res.message });
      setTargetUsername('');
      setCustomTitleEn('');
      setCustomTitleSw('');
      setAdminNotes('');
      refreshData();
    } else {
      setFormFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRevoke = (username: string) => {
    if (
      window.confirm(
        language === 'en'
          ? `Are you sure you want to revoke the verification badge for @${username}?`
          : `Una uhakika unataka kufuta nembo ya uthibitisho ya @${username}?`
      )
    ) {
      const res = revokeVerification(username, actorUsername);
      if (res.success) {
        refreshData();
      }
    }
  };

  const handleToggleTier = (username: string, currentTier: VerificationBadgeTier) => {
    const nextTier: VerificationBadgeTier = currentTier === 'double_tick' ? 'single_tick' : 'double_tick';
    const res = updateVerificationTier(username, nextTier, actorUsername);
    if (res.success) {
      refreshData();
    }
  };

  const handleGrantRequest = (req: VerificationRequest, tierToGrant: VerificationBadgeTier) => {
    const res = grantVerificationRequest(req.id, tierToGrant, actorUsername);
    if (res.success) {
      refreshData();
    }
  };

  const handleConfirmDenial = () => {
    if (!denyingRequest) return;
    const res = denyVerificationRequest(
      denyingRequest.id,
      denialReason || 'Verification requirements or activity could not be confirmed at this time.',
      actorUsername
    );
    if (res.success) {
      setDenyingRequest(null);
      setDenialReason('');
      refreshData();
    }
  };

  // Filtered lists
  const filteredVerified = useMemo(() => {
    return verifiedUsers.filter((u) => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.badgeTitleEn && u.badgeTitleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.notes && u.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier = tierFilter === 'all' || u.badgeTier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [verifiedUsers, searchQuery, tierFilter]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (requestFilter === 'pending') return r.status === 'pending';
      if (requestFilter === 'granted') return r.status === 'granted';
      if (requestFilter === 'denied') return r.status === 'denied';
      return true;
    });
  }, [requests, requestFilter]);

  return (
    <div className="space-y-6">
      {/* Royal Executive Header */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-amber-950 via-slate-900 to-slate-950 text-white border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-serif text-amber-200">
                  {language === 'en'
                    ? 'The Samaritan User Verification Console'
                    : 'Dawati Kuu la Uthibitishaji wa Wananchi'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  Super Authority
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {language === 'en'
                  ? 'Verify any citizen directly to grant single tick (✓) or double ticks (✓✓) verification badges without requiring admin status or course prerequisites. Review and adjudicate incoming citizen verification applications.'
                  : 'Thibitisha mwananchi yeyote moja kwa moja kuwapa nembo ya mhuri mmoja (✓) au mihuri miwili (✓✓) bila kuhitaji vigezo vya uongozi. Kagua na uidhinishe maombi yanayotumwa na wananchi.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Refresh Records"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pending Applications
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</span>
              <Clock className="w-4 h-4 text-amber-400/60" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Double Ticks (✓✓)
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-amber-300 font-mono">{doubleTickCount}</span>
              <Crown className="w-4 h-4 text-amber-300/60" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Single Tick (✓)
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-blue-400 font-mono">{singleTickCount}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400/60" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Verified Users
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{verifiedUsers.length}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveConsoleTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeConsoleTab === 'requests'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {language === 'en' ? 'Citizen Verification Requests' : 'Maombi ya Uthibitishaji'}
          </span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveConsoleTab('direct_verify')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeConsoleTab === 'direct_verify'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>
            {language === 'en' ? 'Direct Citizen Verification Desk' : 'Uthibitishaji wa Moja kwa Moja'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CITIZEN VERIFICATION REQUESTS INBOX */}
      {/* ========================================================================= */}
      {activeConsoleTab === 'requests' && (
        <div className="space-y-6">
          {/* Requests Filter Pills */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Filter:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: 'pending', label: `Pending Review (${pendingCount})` },
                    { id: 'all', label: `All Requests (${requests.length})` },
                    { id: 'granted', label: 'Granted' },
                    { id: 'denied', label: 'Denied' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRequestFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      requestFilter === tab.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
            </div>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {requestFilter === 'pending'
                  ? 'Zero Pending Verification Applications'
                  : 'No Verification Requests Found'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {requestFilter === 'pending'
                  ? 'All citizen verification requests have been addressed. Qualified citizens who complete 10 foundational courses and have 50 tokens can submit new requests from their profile.'
                  : 'No requests match the current filter selection.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((req) => {
                const isPending = req.status === 'pending';
                const userCounty = getUserCounty(req.username);

                return (
                  <div
                    key={req.id}
                    className={`rounded-2xl p-5 border transition-all ${
                      isPending
                        ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 shadow-md ring-1 ring-amber-400/30'
                        : req.status === 'granted'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
                    }`}
                  >
                    {/* Top Row: User & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                          {req.username.replace('@', '').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                              {req.displayUsername}
                            </span>
                            <UserBadge username={req.username} size="xs" hideName />
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {userCounty ? `${userCounty} County` : 'Registered Citizen'} • Submitted{' '}
                            {new Date(req.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                            : req.status === 'granted'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                            : 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Requested Tier Pill */}
                    <div className="mt-3.5 flex items-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">Requested:</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          req.requestedTier === 'double_tick'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        }`}
                      >
                        {req.requestedTier === 'double_tick' ? (
                          <>
                            <Crown className="w-3.5 h-3.5 text-amber-600" />
                            <span>Double Ticks Badge (✓✓)</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Single Tick Badge (✓)</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Automatic Prerequisites Verified Card */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>Prerequisites Auto-Verification</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">Passed</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          <span>10 Foundational Civic Courses</span>
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {req.foundationalCoursesCompleted}/10 Completed ✓
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          <span>Facilitator Token Balance</span>
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {req.tokenBalanceAtRequest} Tokens (Min 50) ✓
                        </span>
                      </div>
                    </div>

                    {/* User's Note / Statement */}
                    {req.userNote && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-amber-900 dark:text-amber-300 block text-[10px] uppercase">
                          Citizen Motivation / Statement:
                        </span>
                        <p className="italic mt-0.5">&ldquo;{req.userNote}&rdquo;</p>
                      </div>
                    )}

                    {/* Decision Summary if already reviewed */}
                    {!isPending && (
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                        <span>Reviewed by {req.reviewedBy} on {new Date(req.reviewedAt || '').toLocaleDateString()}</span>
                        {req.decisionReason && (
                          <div className="italic text-slate-600 dark:text-slate-300 mt-0.5">
                            Reason: {req.decisionReason}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons for The_Samaritan */}
                    {isPending && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleGrantRequest(req, 'double_tick')}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Grant Double Ticks Badge"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>Grant Double Ticks (✓✓)</span>
                        </button>

                        <button
                          onClick={() => handleGrantRequest(req, 'single_tick')}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Grant Single Tick Badge"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Grant Single Tick (✓)</span>
                        </button>

                        <button
                          onClick={() => {
                            setDenyingRequest(req);
                            setDenialReason('');
                          }}
                          className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 text-xs font-bold transition-all cursor-pointer"
                          title="Deny Application"
                        >
                          <span>Deny</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DIRECT CITIZEN VERIFICATION DESK (INSTANT EXECUTIVE ACTION) */}
      {/* ========================================================================= */}
      {activeConsoleTab === 'direct_verify' && (
        <div className="space-y-6">
          {/* Direct Verification Form Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100 font-serif">
                  {language === 'en'
                    ? 'Direct Citizen Verification Form'
                    : 'Fomu ya Uthibitishaji wa Moja kwa Moja'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'en'
                    ? 'Enter any username. They do not need to be an administrator or have completed any courses or tokens.'
                    : 'Weka jina la mtumiaji yeyote. Hahitaji kuwa msimamizi wala kukamilisha masomo au tokeni.'}
                </p>
              </div>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleDirectVerify} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username Input with Auto-datalist */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Username *
                  </label>
                  <input
                    type="text"
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    placeholder="e.g. @karanja_john, mary_mwangi, any_citizen"
                    list="registered_citizens_list"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <datalist id="registered_citizens_list">
                    {registeredUsers.map((u) => (
                      <option key={u.username} value={u.username}>
                        {u.username} ({u.county || 'Citizen'})
                      </option>
                    ))}
                  </datalist>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                    Type or pick any username from the platform.
                  </span>
                </div>

                {/* Badge Tier Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Verification Badge Tier *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTier('double_tick')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedTier === 'double_tick'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-black'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-800" />
                      <span>Double Ticks (✓✓)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTier('single_tick')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedTier === 'single_tick'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-black'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Single Tick (✓)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Custom Titles & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Honorific / Title (English) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={customTitleEn}
                    onChange={(e) => setCustomTitleEn(e.target.value)}
                    placeholder={
                      selectedTier === 'double_tick'
                        ? 'e.g. Verified Civic Scholar, Community Paralegal'
                        : 'e.g. Verified Citizen, Grassroots Defender'
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Citation / Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Commended for grassroots devolution advocacy"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Citizen Now (Grant {selectedTier === 'double_tick' ? 'Double Ticks' : 'Single Tick'})</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Verified Citizens Table Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100 font-serif">
                  {language === 'en' ? 'Active Verified Citizens Roster' : 'Orodha ya Wananchi Walioidhinishwa'}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {verifiedUsers.length}
                </span>
              </div>

              {/* Search & Tier Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search verified..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-44"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'double_tick', label: 'Double (✓✓)' },
                      { id: 'single_tick', label: 'Single (✓)' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setTierFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        tierFilter === f.id
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredVerified.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No verified citizens match your query. Use the form above to verify your first citizen.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Citizen</th>
                      <th className="py-2.5 px-3">Badge Tier</th>
                      <th className="py-2.5 px-3">Title / Honorific</th>
                      <th className="py-2.5 px-3">Verified Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredVerified.map((u) => {
                      const isDouble = u.badgeTier === 'double_tick';
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <UserBadge username={u.username} size="sm" />
                            </div>
                            {u.notes && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic block mt-0.5">
                                {u.notes}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                isDouble
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                                  : 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700'
                              }`}
                            >
                              {isDouble ? <Crown className="w-3 h-3 text-amber-600" /> : <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                              <span>{isDouble ? 'Double Ticks (✓✓)' : 'Single Tick (✓)'}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {u.badgeTitleEn}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                              Source: {u.source.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                            {new Date(u.verifiedAt).toLocaleDateString()}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleTier(u.username, u.badgeTier)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                                title={`Switch to ${isDouble ? 'Single Tick' : 'Double Ticks'}`}
                              >
                                Switch to {isDouble ? 'Single Tick' : 'Double Ticks'}
                              </button>

                              <button
                                onClick={() => handleRevoke(u.username)}
                                className="p-1 rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-950/40 text-[10px] font-bold transition-colors cursor-pointer"
                                title="Revoke Verification"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Denial Reason Modal */}
      {denyingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                Deny Verification Application
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Provide a brief explanation for <strong>{denyingRequest.displayUsername}</strong>. This message will be delivered directly to their in-app notifications.
            </p>

            <div>
              <textarea
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                placeholder="e.g. Please demonstrate continued active participation in grassroots baraza sessions and re-apply in 30 days."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDenyingRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDenial}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
