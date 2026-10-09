import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Radio,
  Coins,
  MessageSquare,
  AlertTriangle,
  Send,
  Eye,
  RefreshCw,
  Sparkles,
  Award,
  Filter,
  FileSpreadsheet,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Language, AuthUser, BannedUserRecord } from '../types';
import {
  getRegisteredUsers,
  StoredUserRecord,
  getAllPasswordRecoveryRequests,
  PasswordRecoveryRequest,
} from '../utils/authAndQuestions';
import { getActiveUserSessions, ActiveUserSession } from '../utils/userPresence';
import { checkIfUserOrDeviceBanned, getBannedUsers } from '../utils/adminManagement';
import { getUserTokenBalance } from '../utils/facilitatorTokenRegistry';
import { getFollowStats } from '../utils/userFollowSystem';
import {
  getOperatorFlaggedIncidents,
  OperatorFlaggedIncident,
  approveAndUnbanUserBySamaritan,
  completelyBanUserBySamaritan,
  sendDirectMessage,
} from '../utils/civicMessagingService';
import { exportDatabaseToExcel } from '../utils/excelDatabase';
import { pushAllDataToGoogleSheet, getGoogleSheetConfig } from '../utils/googleSheetSync';
import { UserBadge } from './UserBadge';
import {
  getUserVerification,
  verifyUser,
  revokeVerification,
} from '../utils/userVerificationService';

interface MasterCitizenRosterAndIncidentsProps {
  currentUser: AuthUser;
  language: Language;
  onOpenTokenAwardModal?: (targetUser: string) => void;
}

export const MasterCitizenRosterAndIncidents: React.FC<MasterCitizenRosterAndIncidentsProps> = ({
  currentUser,
  language,
  onOpenTokenAwardModal,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'incidents' | 'recoveries'>('roster');
  const [registeredUsers, setRegisteredUsers] = useState<StoredUserRecord[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveUserSession[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUserRecord[]>([]);
  const [incidents, setIncidents] = useState<OperatorFlaggedIncident[]>([]);
  const [recoveries, setRecoveries] = useState<PasswordRecoveryRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'flagged'>('all');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Direct Executive Message Modal State
  const [messagingTarget, setMessagingTarget] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const loadData = () => {
    const reg = getRegisteredUsers();
    setRegisteredUsers(reg);

    const presence = getActiveUserSessions();
    setActiveSessions(presence.sessions);

    const banned = getBannedUsers();
    setBannedUsers(banned);

    const incs = getOperatorFlaggedIncidents();
    setIncidents(incs);

    const recs = getAllPasswordRecoveryRequests();
    setRecoveries(recs);
  };

  useEffect(() => {
    loadData();

    // Listen for live registrations, bans, and Operator AI incidents
    const handleUserReg = () => loadData();
    const handleBanUpdate = () => loadData();
    const handleIncidentUpdate = () => loadData();

    window.addEventListener('the_samaritan_user_registered', handleUserReg);
    window.addEventListener('the_samaritan_ban_updated', handleBanUpdate);
    window.addEventListener('the_samaritan_operator_incident_submitted', handleIncidentUpdate);
    window.addEventListener('the_samaritan_auth_changed', handleUserReg);

    const interval = setInterval(loadData, 6000);

    return () => {
      window.removeEventListener('the_samaritan_user_registered', handleUserReg);
      window.removeEventListener('the_samaritan_ban_updated', handleBanUpdate);
      window.removeEventListener('the_samaritan_operator_incident_submitted', handleIncidentUpdate);
      window.removeEventListener('the_samaritan_auth_changed', handleUserReg);
      clearInterval(interval);
    };
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Helper to check if a registered user is online
  const isUserOnline = (username: string) => {
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    return activeSessions.some(
      (s) => s.isOnline && s.username.trim().toLowerCase().replace(/^@/, '') === clean
    );
  };

  // Helper to check user ban / flag status
  const getUserStatus = (username: string) => {
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    const ban = bannedUsers.find((b) => b.username.toLowerCase().replace(/^@/, '') === clean);
    const hasPendingIncident = incidents.some(
      (i) => i.senderUsername.toLowerCase().replace(/^@/, '') === clean && i.status === 'pending_samaritan_review'
    );

    if (hasPendingIncident) return 'flagged';
    if (ban) return ban.banType === 'permanent' ? 'banned_permanent' : 'banned_temporary';
    return 'active';
  };

  // Handle Samaritan Approval & Unban
  const handleApproveAndUnban = (incidentId: string) => {
    const res = approveAndUnbanUserBySamaritan(
      incidentId,
      'Approved by The_Samaritan Super Authority. False positive or remorse statement accepted.'
    );
    if (res.success) {
      showFeedback(res.message, 'success');
      loadData();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // Handle Samaritan Permanent Ban
  const handleCompletelyBan = (incidentId: string) => {
    const res = completelyBanUserBySamaritan(
      incidentId,
      'Permanent expulsion enforced by The_Samaritan under Chapter Six standards.'
    );
    if (res.success) {
      showFeedback(res.message, 'success');
      loadData();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // Handle Direct Executive Message Send
  const handleSendDirectMessage = async () => {
    if (!messagingTarget || !messageContent.trim()) return;
    setIsSendingMsg(true);

    try {
      const res = await sendDirectMessage(currentUser, messagingTarget, messageContent.trim());
      if (res.success) {
        showFeedback(
          language === 'en'
            ? `Executive message dispatched to ${messagingTarget}`
            : `Ujumbe rasmi umetumwa kwa ${messagingTarget}`,
          'success'
        );
        setMessageContent('');
        setMessagingTarget(null);
      } else {
        showFeedback(res.message, 'error');
      }
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to send message', 'error');
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Filter registered users
  const filteredUsers = registeredUsers.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.county && u.county.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.subCounty && u.subCounty.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;

    const online = isUserOnline(u.username);
    const status = getUserStatus(u.username);

    if (statusFilter === 'online' && !online) return false;
    if (statusFilter === 'offline' && online) return false;
    if (statusFilter === 'flagged' && status === 'active') return false;

    if (countyFilter !== 'all' && u.county?.toLowerCase() !== countyFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  const pendingIncidentsCount = incidents.filter((i) => i.status === 'pending_samaritan_review').length;
  const onlineCount = registeredUsers.filter((u) => isUserOnline(u.username)).length;
  const offlineCount = Math.max(0, registeredUsers.length - onlineCount);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                The_Samaritan Executive Authority
              </span>
              <span className="text-xs text-amber-300/80 font-mono">Article 10 & 238 Oversight</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              {language === 'en' ? 'Master Citizen Roster & Operator Sentinel Desk' : 'Orodha Kuu ya Wananchi na Dawati la Operator AI'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              {language === 'en'
                ? 'Direct live visibility into every citizen account upon registration (online & offline), with real-time incident adjudication for messages intercepted by The Operator AI.'
                : 'Usimamizi wa moja kwa moja wa wananchi wote wanapojiandikisha (wakiwa mtandaoni au bila mtandao), pamoja na mapitio ya jumbe zilizozuiliwa na The Operator AI.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={async () => {
                const cfg = getGoogleSheetConfig();
                if (!cfg.webAppUrl) {
                  showFeedback(
                    language === 'en'
                      ? 'Google Sheet URL not configured yet. Go to Admin Panel > Live Google Sheet Sync to configure.'
                      : 'Anwani ya Google Sheet haijawekwa. Nenda kwenye Jopo la Utawala > Sawazisha Google Sheet.',
                    'error'
                  );
                  return;
                }
                try {
                  const res = await pushAllDataToGoogleSheet();
                  showFeedback(
                    language === 'en'
                      ? `Live Google Sheet Synced! ${res.message}`
                      : `Imesawazishwa na Google Sheet! ${res.message}`,
                    'success'
                  );
                } catch (e: any) {
                  showFeedback(e?.message || 'Sync failed', 'error');
                }
              }}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-teal-500 shadow-xs cursor-pointer"
              title={language === 'en' ? 'Sync Live to Google Sheets' : 'Sawazisha na Google Sheets'}
            >
              <Radio className="w-4 h-4 text-teal-200 animate-pulse" />
              <span>{language === 'en' ? 'Sync Google Sheet' : 'Sawazisha Sheet'}</span>
            </button>

            <button
              onClick={() => {
                try {
                  const summary = exportDatabaseToExcel();
                  showFeedback(
                    language === 'en'
                      ? `Database exported to Excel! (${summary.totalUsers} citizens, ${summary.totalQuestions} inquiries)`
                      : `Hifadhidata imepakuliwa kwa Excel! (${summary.totalUsers} wananchi, ${summary.totalQuestions} maswali)`,
                    'success'
                  );
                } catch {
                  showFeedback(
                    language === 'en' ? 'Failed to export Excel database' : 'Imeshindwa kupakua Excel',
                    'error'
                  );
                }
              }}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-500 shadow-xs cursor-pointer"
              title={language === 'en' ? 'Download Full Excel Database' : 'Pakua Hifadhidata Kamili ya Excel'}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>{language === 'en' ? 'Export Excel Database' : 'Pakua Excel'}</span>
            </button>

            <button
              onClick={loadData}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Refresh Roster' : 'Sasisha Orodha'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Executive Metric Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 font-bold block">
              {language === 'en' ? 'Total Registered' : 'Jumla ya Waliosajiliwa'}
            </span>
            <span className="text-2xl font-black text-white">{registeredUsers.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">
              {language === 'en' ? 'Live Auto-Sync' : 'Inasasishwa Papo Hapo'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 font-bold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {language === 'en' ? 'Online Right Now' : 'Mtandaoni Sasa'}
            </span>
            <span className="text-2xl font-black text-emerald-400">{onlineCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {language === 'en' ? 'Active Sessions' : 'Vipindi Hai'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 font-bold block">
              {language === 'en' ? 'Offline Registered' : 'Bila Mtandao'}
            </span>
            <span className="text-2xl font-black text-slate-300">{offlineCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {language === 'en' ? 'Visible in Registry' : 'Wamo kwenye Orodha'}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('incidents')}
            className={`cursor-pointer rounded-xl p-3 transition-all border ${
              pendingIncidentsCount > 0
                ? 'bg-red-950/70 border-red-500/80 hover:bg-red-900/80 animate-pulse'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px] text-red-300 font-bold block flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              {language === 'en' ? 'Operator AI Flagged' : 'Zilizotiliwa Shaka'}
            </span>
            <span className="text-2xl font-black text-red-400">{pendingIncidentsCount}</span>
            <span className="text-[10px] text-red-300/80 block mt-0.5 font-bold">
              {pendingIncidentsCount > 0
                ? language === 'en'
                  ? 'Urgent Review Required'
                  : 'Inahitaji Uamuzi Wako'
                : language === 'en'
                ? 'Zero Active Threats'
                : 'Hakuna Tishio'}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border border-emerald-700'
              : 'bg-red-900 text-red-100 border border-red-700'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Sub-Tabs: Master Roster vs Operator AI Incidents */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-1 text-sm font-black transition-all relative flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'text-purple-950 dark:text-amber-400 border-b-2 border-purple-900 dark:border-amber-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'en' ? 'Master Citizen Roster (All Users)' : 'Orodha Kuu ya Wananchi Wote'}</span>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300 font-bold">
            {registeredUsers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`pb-3 px-1 text-sm font-black transition-all relative flex items-center gap-2 ${
            activeTab === 'incidents'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>{language === 'en' ? 'The Operator AI Incident Desk' : 'Dawati la Uchunguzi la Operator AI'}</span>
          {pendingIncidentsCount > 0 && (
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
              {pendingIncidentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('recoveries')}
          className={`pb-3 px-1 text-sm font-black transition-all relative flex items-center gap-2 ${
            activeTab === 'recoveries'
              ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>{language === 'en' ? 'Password Recovery Audits' : 'Kumbukumbu za Marejesho ya Nenosiri'}</span>
          {recoveries.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
              {recoveries.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: MASTER CITIZEN ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search handle, county, sub-county...'
                    : 'Tafuta jina, kaunti, eneo bunge...'
                }
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {language === 'en' ? 'All' : 'Wote'}
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    statusFilter === 'online'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {language === 'en' ? 'Online' : 'Mtandaoni'}
                </button>
                <button
                  onClick={() => setStatusFilter('offline')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    statusFilter === 'offline'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {language === 'en' ? 'Offline' : 'Bila Mtandao'}
                </button>
                <button
                  onClick={() => setStatusFilter('flagged')}
                  className={`px-2.5 py-1 rounded-md transition-all text-red-600 ${
                    statusFilter === 'flagged'
                      ? 'bg-white dark:bg-slate-700 font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {language === 'en' ? 'Flagged / Banned' : 'Waliozuiwa'}
                </button>
              </div>

              <select
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
                className="text-xs font-bold px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="all">{language === 'en' ? 'All Counties (47)' : 'Kaunti Zote (47)'}</option>
                <option value="Kwale">Kwale (HQ)</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kilifi">Kilifi</option>
                <option value="Taita Taveta">Taita Taveta</option>
                <option value="Nairobi">Nairobi</option>
              </select>
            </div>
          </div>

          {/* User Roster Table / Card Deck */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Users className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
                <p className="font-bold text-sm">
                  {language === 'en'
                    ? 'No registered citizens match the filter.'
                    : 'Hakuna wananchi wanaolingana na kichujio.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => {
                  const online = isUserOnline(user.username);
                  const status = getUserStatus(user.username);
                  const tokens = getUserTokenBalance(user.username);
                  const stats = getFollowStats(user.username);

                  return (
                    <div
                      key={user.username}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <UserBadge username={user.username} size="md" showAvatar hideName currentUser={currentUser} />

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <UserBadge username={user.username} size="sm" currentUser={currentUser} />

                            {/* Online / Offline Pulse Badge */}
                            {online ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                Offline
                              </span>
                            )}

                            {/* Status Pill */}
                            {status === 'flagged' && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                Flagged by Operator AI
                              </span>
                            )}
                            {status === 'banned_permanent' && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300">
                                Permanently Banned
                              </span>
                            )}
                            {status === 'banned_temporary' && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
                                Suspended
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {user.county || 'Kwale'} {user.subCounty ? `(${user.subCounty})` : ''}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                            </span>

                            <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                              <Coins className="w-3.5 h-3.5" />
                              {tokens.availableBalance} {language === 'en' ? 'Tokens' : 'Tokeni'}
                            </span>

                            <span className="text-[11px] text-slate-400">
                              {stats.followersCount} followers • {stats.followingCount} following
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Samaritan Administrative Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {(() => {
                          const userVerif = getUserVerification(user.username);
                          return (
                            <button
                              onClick={() => {
                                if (!userVerif) {
                                  verifyUser(user.username, 'double_tick', { verifiedBy: currentUser.username });
                                  showFeedback(`Verified @${user.username} with Double Ticks badge!`, 'success');
                                } else if (userVerif.badgeTier === 'double_tick') {
                                  verifyUser(user.username, 'single_tick', { verifiedBy: currentUser.username });
                                  showFeedback(`Changed @${user.username} to Single Tick badge!`, 'success');
                                } else {
                                  revokeVerification(user.username, currentUser.username);
                                  showFeedback(`Revoked verification for @${user.username}`, 'success');
                                }
                                loadData();
                              }}
                              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                userVerif?.badgeTier === 'double_tick'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                                  : userVerif?.badgeTier === 'single_tick'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                              }`}
                              title={
                                userVerif?.badgeTier === 'double_tick'
                                  ? 'Verified (Double Ticks) - Click to change to Single Tick'
                                  : userVerif?.badgeTier === 'single_tick'
                                  ? 'Verified (Single Tick) - Click to revoke'
                                  : 'Click to quickly verify with Double Ticks badge'
                              }
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          );
                        })()}

                        {onOpenTokenAwardModal && (
                          <button
                            onClick={() => onOpenTokenAwardModal(user.username)}
                            className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
                            title={language === 'en' ? 'Allocate Facilitator Tokens' : 'Gawia Tokeni'}
                          >
                            <Coins className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setMessagingTarget(user.username);
                            setMessageContent('');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-900 dark:text-purple-200 text-xs font-bold border border-purple-200 dark:border-purple-800 transition-colors"
                          title={language === 'en' ? 'Send Direct Executive Message' : 'Tuma Ujumbe'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Message' : 'Ujumbe'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: THE OPERATOR AI SUSPICIOUS INCIDENTS DESK */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-0.5">
                {language === 'en'
                  ? 'The Operator AI Real-Time Sentinel Adjudication Desk'
                  : 'Dawati la Uamuzi wa The Operator AI'}
              </span>
              {language === 'en'
                ? 'Whenever a citizen sends a peer-to-peer message flagged for incitement, hate speech, election fraud, extortion, or state officer impersonation, the sender is automatically placed under immediate suspension. The case is submitted here exclusively for The_Samaritan to review and either approve (unban) or permanently ban.'
                : 'Mwananchi anapotuma ujumbe wenye uchochezi wa vurugu, chuki ya kikabila, wizi wa kura, vitisho au kujifanya afisa, ujumbe huzuiwa mara moja na akaunti kusimamishwa. Kesi hupelekwa hapa kwa The_Samaritan kuamua kusamehe (kufungua) au kupiga marufuku ya kudumu.'}
            </div>
          </div>

          {incidents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                {language === 'en' ? 'No Suspicious Incidents Detected' : 'Hakuna Ujumbe Uliotiliwa Shaka'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {language === 'en'
                  ? 'All peer-to-peer citizen messages analyzed by The Operator AI comply with constitutional civic discourse and Chapter Six standards.'
                  : 'Jumbe zote zilizopitiwa na The Operator AI zinazingatia maadili ya kikatiba.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => {
                const isPending = incident.status === 'pending_samaritan_review';

                return (
                  <div
                    key={incident.id}
                    className={`rounded-2xl p-5 border-2 transition-all ${
                      isPending
                        ? 'bg-red-50/40 dark:bg-red-950/20 border-red-500/80 shadow-md'
                        : incident.status === 'approved_unbanned'
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/50'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-bold">
                            #{incident.id}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              isPending
                                ? 'bg-red-600 text-white animate-pulse'
                                : incident.status === 'approved_unbanned'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-white'
                            }`}
                          >
                            {isPending
                              ? language === 'en'
                                ? 'Pending The_Samaritan Review'
                                : 'Inasubiri Uamuzi wa The_Samaritan'
                              : incident.status === 'approved_unbanned'
                              ? language === 'en'
                                ? 'Approved & Restored'
                                : 'Imeidhinishwa & Kufunguliwa'
                              : language === 'en'
                              ? 'Permanently Banned'
                              : 'Imezuiwa Kabisa'}
                          </span>
                          <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            Risk Score: {incident.riskScore}/100
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
                          <span>
                            Sender: <strong className="text-red-600">{incident.senderUsername}</strong>
                          </span>
                          <span>&rarr;</span>
                          <span>
                            Recipient: <strong className="text-slate-900 dark:text-slate-100">{incident.recipientUsername}</strong>
                          </span>
                          <span className="text-slate-400 font-normal">
                            • {new Date(incident.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-3 py-1 rounded-lg border border-red-200 dark:border-red-800 self-start md:self-auto">
                        {language === 'en' ? incident.categoryLabelEn : incident.categoryLabelSw}
                      </span>
                    </div>

                    {/* Offending Message Content Callout */}
                    <div className="mt-4 bg-white dark:bg-slate-900 border-l-4 border-red-600 p-3.5 rounded-r-xl shadow-xs">
                      <span className="text-[10px] uppercase tracking-wider font-black text-red-600 block mb-1">
                        {language === 'en' ? 'Intercepted Message Transcript' : 'Ujumbe Uliozuiliwa'}
                      </span>
                      <p className="text-sm font-mono text-slate-900 dark:text-slate-100 select-all">
                        "{incident.content}"
                      </p>
                    </div>

                    {/* The Operator AI Rationale */}
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-slate-200">
                          The Operator AI Analysis:
                        </strong>{' '}
                        {language === 'en' ? incident.explanationEn : incident.explanationSw}
                        {incident.flaggedKeywords.length > 0 && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">Flagged Markers:</span>
                            {incident.flaggedKeywords.map((k) => (
                              <span
                                key={k}
                                className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono font-bold"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Executive Decision Buttons for The_Samaritan */}
                    {isPending ? (
                      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {language === 'en'
                            ? 'The sender is currently suspended. Choose executive resolution:'
                            : 'Mtumaji amesimamishwa sasa. Chagua uamuzi wako wa mwisho:'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveAndUnban(incident.id)}
                            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{language === 'en' ? 'Approve & Unban User' : 'Idhinisha & Fungua Mtumiaji'}</span>
                          </button>

                          <button
                            onClick={() => handleCompletelyBan(incident.id)}
                            className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>
                              {language === 'en' ? 'Completely Ban from Platform' : 'Piga Marufuku Kabisa'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        <span>
                          Adjudicated by <strong className="text-slate-800 dark:text-slate-200">The_Samaritan</strong> on{' '}
                          {incident.reviewedAt ? new Date(incident.reviewedAt).toLocaleString() : 'Executive Decision'}
                          {incident.samaritanNotes ? ` • "${incident.samaritanNotes}"` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PASSWORD RECOVERY AUDITS & SYSTEM ACCESS */}
      {activeTab === 'recoveries' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              <strong className="block font-bold">
                {language === 'en'
                  ? 'Password Recovery & Access Restoration Desk (The_Samaritan Oversight)'
                  : 'Dawati la Marejesho ya Nenosiri na Ukaguzi wa Usalama'}
              </strong>
              <p className="mt-0.5">
                {language === 'en'
                  ? 'Whenever any citizen or administrator resets their password, the security event is cryptographically logged here. Citizens verify via registered Home County jurisdiction, while administrators verify using the executive recovery protocol.'
                  : 'Mwananchi au msimamizi anapoweka upya nenosiri lake, tukio hilo linarekodiwa hapa kwa ukaguzi wa The_Samaritan bila kuhatarisha usalama wa mtumiaji.'}
              </p>
            </div>
          </div>

          {recoveries.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/40 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {language === 'en' ? 'No Password Recovery Incidents Yet' : 'Hakuna Maombi ya Marejesho Bado'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'All user accounts and admin passwords are secure. Any forgotten password recoveries will be logged here in real-time.'
                  : 'Akaunti zote na manenosiri yako salama. Marejesho yoyote yatakayofanywa yataonekana hapa papo hapo.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recoveries.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{rec.username}</span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                              rec.role === 'admin'
                                ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {rec.role}
                          </span>
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(rec.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'en' ? 'Verified & Restored' : 'Imethibitishwa & Kurejeshwa'}</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'en' ? 'Verification Method: ' : 'Njia ya Uthibitishaji: '}
                    </span>
                    {rec.verificationMethod === 'county_verification' ? (
                      <span>
                        {language === 'en'
                          ? `Home County Verification (${rec.countyMatched} Jurisdiction)`
                          : `Uthibitisho wa Kaunti ya Nyumbani (${rec.countyMatched})`}
                      </span>
                    ) : (
                      <span>
                        {language === 'en'
                          ? 'Master Administrative Recovery Protocol'
                          : 'Itifaki Kuu ya Utawala ya Marejesho'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Direct Executive Message Composer Modal */}
      {messagingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border-2 border-purple-900 dark:border-purple-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {language === 'en' ? 'Direct Executive Message' : 'Ujumbe Rasmi wa Uongozi'}
                </h3>
              </div>
              <button
                onClick={() => setMessagingTarget(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400">
              Recipient: <strong className="text-purple-700 dark:text-purple-300">{messagingTarget}</strong>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {language === 'en'
                  ? 'This message is monitored by The Operator AI Sentinel in real-time.'
                  : 'Ujumbe huu unafuatiliwa na The Operator AI Sentinel papo hapo.'}
              </p>
            </div>

            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              placeholder={
                language === 'en'
                  ? 'Type your civic directive, guidance, or communication...'
                  : 'Andika agizo au maelekezo ya kiraia...'
              }
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMessagingTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {language === 'en' ? 'Cancel' : 'Ghairi'}
              </button>

              <button
                onClick={handleSendDirectMessage}
                disabled={isSendingMsg || !messageContent.trim()}
                className="flex items-center gap-2 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-black transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingMsg ? 'Sending...' : language === 'en' ? 'Send Message' : 'Tuma Ujumbe'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
