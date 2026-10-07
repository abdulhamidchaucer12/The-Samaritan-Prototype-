import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  UserCheck,
  Heart,
  MessageSquare,
  Award,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  X,
  Search,
  Flame,
  Radio,
  Clock,
  Sparkles,
  MapPin,
  Send,
  ShieldAlert,
  AlertTriangle,
  Compass,
  ArrowLeft,
  Coins,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { UserBadge } from './UserBadge';
import {
  getAllPublicActivities,
  getFeedForUser,
  toggleFollowUser,
  isFollowing,
  getFollowStats,
  toggleLikeActivity,
  UserActivityRecord,
} from '../utils/userFollowSystem';
import { getActiveUserSessions, ActiveUserSession } from '../utils/userPresence';
import { getRegisteredUsers, getUserCounty, StoredUserRecord } from '../utils/authAndQuestions';
import { getProximityTier, getNeighbouringCounties } from '../data/kenyaCounties';
import { getUserTokenBalance } from '../utils/facilitatorTokenRegistry';
import {
  sendDirectMessage,
  getDirectMessagesBetween,
  getUserConversations,
  markConversationAsRead,
  CivicDirectMessage,
} from '../utils/civicMessagingService';
import { checkIfUserOrDeviceBanned } from '../utils/adminManagement';

interface CivicCommunityFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: AuthUser | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  initialPeer?: string | null;
  initialTab?: 'feed' | 'following' | 'directory' | 'messages';
}

export const CivicCommunityFeedModal: React.FC<CivicCommunityFeedModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  onOpenAuthModal,
  initialPeer,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'following' | 'directory' | 'messages'>('directory');
  const [activities, setActivities] = useState<UserActivityRecord[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveUserSession[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<StoredUserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineOnlyFilter, setOnlineOnlyFilter] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);

  // Direct Messaging States
  const [activeChatPeer, setActiveChatPeer] = useState<string | null>(null);
  const [directMessages, setDirectMessages] = useState<CivicDirectMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [sentinelAlert, setSentinelAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myUsername = currentUser?.username || '';
  const myCounty = currentUser?.county || (currentUser ? getUserCounty(currentUser.username) : 'Kwale') || 'Kwale';

  const refreshData = () => {
    const allActs = getAllPublicActivities();
    setActivities(allActs);

    const presence = getActiveUserSessions();
    setActiveSessions(presence.sessions);

    const allReg = getRegisteredUsers();
    setRegisteredUsers(allReg);

    if (activeChatPeer && myUsername) {
      const msgs = getDirectMessagesBetween(myUsername, activeChatPeer);
      setDirectMessages(msgs);
      markConversationAsRead(myUsername, activeChatPeer);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialPeer) {
        setActiveChatPeer(initialPeer);
        setActiveTab('messages');
      } else if (initialTab) {
        setActiveTab(initialTab);
      }
      refreshData();
      const interval = setInterval(refreshData, 6000);

      const handleMsgUpdate = () => {
        if (activeChatPeer && myUsername) {
          const msgs = getDirectMessagesBetween(myUsername, activeChatPeer);
          setDirectMessages(msgs);
        }
      };

      window.addEventListener('civic_messages_updated', handleMsgUpdate);
      window.addEventListener('the_samaritan_user_registered', refreshData);
      window.addEventListener('the_samaritan_ban_updated', refreshData);

      return () => {
        clearInterval(interval);
        window.removeEventListener('civic_messages_updated', handleMsgUpdate);
        window.removeEventListener('the_samaritan_user_registered', refreshData);
        window.removeEventListener('the_samaritan_ban_updated', refreshData);
      };
    }
  }, [isOpen, myUsername, activeChatPeer]);

  useEffect(() => {
    if (activeTab === 'messages' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [directMessages, activeTab]);

  const showNotification = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleFollow = (targetUsername: string) => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('login');
      return;
    }
    const res = toggleFollowUser(currentUser.username, targetUsername);
    showNotification(
      res.isFollowing
        ? language === 'en'
          ? `You are now following ${targetUsername}'s civic activities`
          : `Sasa unamfuatilia ${targetUsername} na matukio yake ya kikatiba`
        : language === 'en'
        ? `Unfollowed ${targetUsername}`
        : `Umeacha kumfuatilia ${targetUsername}`,
      'success'
    );
    refreshData();
  };

  const handleLike = (activityId: string) => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('login');
      return;
    }
    toggleLikeActivity(activityId, currentUser.username);
    refreshData();
  };

  // Open Direct Chat with user
  const handleOpenChatWithUser = (peerUsername: string) => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('login');
      return;
    }
    setActiveChatPeer(peerUsername);
    setActiveTab('messages');
    setSentinelAlert(null);
    const msgs = getDirectMessagesBetween(currentUser.username, peerUsername);
    setDirectMessages(msgs);
    markConversationAsRead(currentUser.username, peerUsername);
  };

  // Send Direct Message monitored by The Operator AI (Text Only)
  const handleSendMessage = async () => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('login');
      return;
    }
    if (!activeChatPeer) return;
    if (!chatInput.trim()) return;

    const contentToSend = chatInput.trim();
    setIsSendingChat(true);
    setSentinelAlert(null);

    try {
      const res = await sendDirectMessage(
        currentUser,
        activeChatPeer,
        contentToSend
      );

      if (res.success) {
        setChatInput('');
        const msgs = getDirectMessagesBetween(currentUser.username, activeChatPeer);
        setDirectMessages(msgs);
        showNotification(
          language === 'en' ? 'Message sent securely.' : 'Ujumbe umetumwa salama.',
          'success'
        );
      } else {
        // Flagged by The Operator AI or user is suspended
        setSentinelAlert(res.message);
        showNotification(res.message, 'error');
        const msgs = getDirectMessagesBetween(currentUser.username, activeChatPeer);
        setDirectMessages(msgs);
      }
    } catch (err: any) {
      showNotification(err?.message || 'Failed to send message', 'error');
    } finally {
      setIsSendingChat(false);
    }
  };

  if (!isOpen) return null;

  // Check ban status for current user
  const myBanCheck = currentUser ? checkIfUserOrDeviceBanned(currentUser.username) : { isBanned: false };

  // Feed selection
  const feedList =
    activeTab === 'following' && currentUser
      ? getFeedForUser(currentUser.username)
      : activities;

  const filteredFeed = feedList.filter(
    (act) =>
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityIcon = (type: UserActivityRecord['type']) => {
    switch (type) {
      case 'question':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-purple-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  // Build Comprehensive Citizen Directory sorted by Proximity:
  // 1. Home County FIRST
  // 2. Neighbouring Counties SECOND
  // 3. Other Counties THIRD
  const userMap = new Map<
    string,
    {
      username: string;
      county: string;
      subCounty?: string;
      isOnline: boolean;
      currentAction?: string;
      tier: 'home' | 'neighbour' | 'other';
    }
  >();

  // Add active session users
  activeSessions.forEach((s) => {
    const clean = s.username.toLowerCase().replace(/^@/, '');
    if (clean !== myUsername.toLowerCase().replace(/^@/, '')) {
      const c = s.county || getUserCounty(s.username) || 'Kwale';
      const tier = getProximityTier(myCounty, c);
      userMap.set(clean, {
        username: s.username,
        county: c,
        subCounty: s.subCounty,
        isOnline: true,
        currentAction: s.currentAction,
        tier,
      });
    }
  });

  // Add all registered users (including offline)
  registeredUsers.forEach((u) => {
    const clean = u.username.toLowerCase().replace(/^@/, '');
    if (clean !== myUsername.toLowerCase().replace(/^@/, '')) {
      if (!userMap.has(clean)) {
        const c = u.county || getUserCounty(u.username) || 'Kwale';
        const tier = getProximityTier(myCounty, c);
        userMap.set(clean, {
          username: u.username,
          county: c,
          subCounty: u.subCounty,
          isOnline: false,
          tier,
        });
      }
    }
  });

  // Sort by Proximity Tier (Home -> Neighbour -> Other) then by online status
  const sortedCitizens = Array.from(userMap.values())
    .filter((cit) => {
      if (onlineOnlyFilter && !cit.isOnline) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        cit.username.toLowerCase().includes(q) ||
        cit.county.toLowerCase().includes(q) ||
        (cit.subCounty && cit.subCounty.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const tierWeight = { home: 0, neighbour: 1, other: 2 };
      const tierDiff = tierWeight[a.tier] - tierWeight[b.tier];
      if (tierDiff !== 0) return tierDiff;
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return a.username.localeCompare(b.username);
    });

  // Conversations summary
  const conversations = myUsername ? getUserConversations(myUsername) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-purple-950 to-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif">
                  {language === 'en'
                    ? 'Civic Community Network & Direct Messaging'
                    : 'Mtandao wa Wananchi na Gumzo za Kiraia'}
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'en'
                  ? `Your Anchor: ${myCounty} County • Neighbouring counties prioritized • Monitored by The Operator AI`
                  : `Kaunti Yako: ${myCounty} • Kaunti jirani kwanza • Inalindwa na The Operator AI`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert banner */}
        {toastMessage && (
          <div
            className={`py-2.5 px-4 text-xs font-bold text-center transition-all ${
              toastMessage.type === 'error'
                ? 'bg-red-600 text-white'
                : toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-100'
            }`}
          >
            {toastMessage.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('directory')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400 font-black'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>
                {language === 'en' ? 'Discover Citizens' : 'Gundua Wananchi'}
              </span>
              <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono px-1.5 py-0.2 rounded-full">
                {sortedCitizens.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400 font-black'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{language === 'en' ? 'Direct Messages' : 'Gumzo za Moja kwa Moja'}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded-full">
                AI Monitored
              </span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'feed'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400 font-black'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{language === 'en' ? 'Public Feed' : 'Matukio ya Umma'}</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setActiveTab('following')}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'following'
                    ? 'border-purple-600 text-purple-700 dark:text-purple-400 font-black'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'en' ? 'Following Feed' : 'Unaowafuata'}</span>
              </button>
            )}
          </div>

          {activeTab !== 'messages' && (
            <div className="flex items-center gap-2 py-1.5">
              {activeTab === 'directory' && (
                <button
                  type="button"
                  onClick={() => setOnlineOnlyFilter(!onlineOnlyFilter)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                    onlineOnlyFilter
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                  title={language === 'en' ? 'Show only online citizens' : 'Onyesha wananchi walio mtandaoni pekee'}
                >
                  <span className={`w-2 h-2 rounded-full ${onlineOnlyFilter ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
                  <span className="whitespace-nowrap">{language === 'en' ? 'Online Only' : 'Walio Mtandaoni'}</span>
                </button>
              )}

              <div className="relative w-40 sm:w-52">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Filter users...' : 'Chuja wananchi...'}
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="grow overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: DISCOVER CITIZENS (HOME & NEIGHBOURING COUNTIES FIRST) */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              {/* Proximity Information Banner */}
              <div className="bg-gradient-to-r from-purple-50 via-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-purple-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-purple-900 text-white flex items-center justify-center font-black shadow-xs">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-black text-slate-900 dark:text-slate-100 block text-xs sm:text-sm">
                      {language === 'en'
                        ? `Prioritized by Devolution Proximity (Anchor: ${myCounty} County)`
                        : `Iliyopangwa kwa Ukaribu wa Kaunti (Kaunti Yako: ${myCounty})`}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      {language === 'en'
                        ? 'Citizens from your home county appear first, followed by neighbouring counties, then other counties across Kenya.'
                        : 'Wananchi wa kaunti yako huonekana kwanza, wakifuatiwa na kaunti jirani, kisha kaunti zingine nchini Kenya.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Home
                  </span>
                  <span>&rarr;</span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-300">
                    Neighbouring
                  </span>
                  <span>&rarr;</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                    Other
                  </span>
                </div>
              </div>

              {/* Citizen Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {sortedCitizens.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-slate-500 font-bold text-xs">
                    {language === 'en' ? 'No citizens found matching search.' : 'Hakuna wananchi waliopatikana.'}
                  </div>
                ) : (
                  sortedCitizens.map((cit) => {
                    const isUserFollowed = isFollowing(myUsername, cit.username);
                    const stats = getFollowStats(cit.username);

                    return (
                      <div
                        key={cit.username}
                        className={`p-4 rounded-2xl border-2 transition-all space-y-3 shadow-2xs ${
                          cit.tier === 'home'
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-400/80'
                            : cit.tier === 'neighbour'
                            ? 'bg-sky-50/20 dark:bg-sky-950/10 border-sky-400/70'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <UserBadge username={cit.username} size="sm" currentUser={currentUser} />
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-semibold">
                                {cit.county} {cit.subCounty ? `(${cit.subCounty})` : ''}
                              </span>
                            </div>
                          </div>

                          {/* County Proximity Tier Badge */}
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              cit.tier === 'home'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : cit.tier === 'neighbour'
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {cit.tier === 'home'
                              ? 'Home County'
                              : cit.tier === 'neighbour'
                              ? 'Neighbour'
                              : 'Devolved County'}
                          </span>
                        </div>

                        {/* Status & Followers */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="text-slate-500">
                            {stats.followersCount} followers
                          </span>

                          {cit.isOnline ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Online
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Offline</span>
                          )}
                        </div>

                        {/* Interactive Buttons: Follow, Message, & Share Tokens */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => handleToggleFollow(cit.username)}
                            className={`grow flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isUserFollowed
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {isUserFollowed ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Follow</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenChatWithUser(cit.username)}
                            className="grow flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'Message' : 'Gumzo'}</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent('open_facilitator_tokens_modal', {
                                  detail: { tab: 'share', recipient: cit.username },
                                })
                              );
                            }}
                            title="Share Tokens with this citizen"
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 transition-colors shrink-0"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT MESSAGES (OPERATOR AI MONITORED) */}
          {activeTab === 'messages' && (
            <div className="h-[520px] flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              {/* Left Column: Conversations List */}
              <div
                className={`w-full md:w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900/60 ${
                  activeChatPeer ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {language === 'en' ? 'Conversations' : 'Mazungumzo'}
                  </h3>
                </div>

                <div className="grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {conversations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {language === 'en'
                        ? 'No active chats. Start messaging citizens from the "Discover Citizens" tab!'
                        : 'Hakuna mazungumzo bado. Fungua "Gundua Wananchi" kuanza gumzo!'}
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const isSelected = activeChatPeer?.toLowerCase() === conv.peerUsername.toLowerCase();

                      return (
                        <div
                          key={conv.peerUsername}
                          onClick={() => handleOpenChatWithUser(conv.peerUsername)}
                          className={`p-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-purple-100 dark:bg-purple-950/80 border-l-4 border-purple-600'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900 dark:text-slate-100 truncate">
                              {conv.peerUsername}
                            </span>
                            {conv.unreadCount > 0 && (
                              <span className="text-[10px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {conv.lastMessage.content}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Chat Box with The Operator AI Sentinel */}
              <div
                className={`grow flex flex-col bg-white dark:bg-slate-900 ${
                  !activeChatPeer ? 'hidden md:flex' : 'flex'
                }`}
              >
                {!activeChatPeer ? (
                  <div className="m-auto text-center p-8 text-slate-400 max-w-sm">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-600" />
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                      {language === 'en' ? 'Select a Citizen to Chat' : 'Chagua Mwananchi Kuzungumza'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'en'
                        ? 'Peer-to-peer messages are securely delivered and protected by The Operator AI Sentinel.'
                        : 'Jumbe za wananchi zinalindwa na The Operator AI Sentinel kuzuia uchochezi na chuki.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Chat Header */}
                    <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveChatPeer(null)}
                          className="md:hidden p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <UserBadge username={activeChatPeer} size="sm" currentUser={currentUser} />
                        <div>
                          <span className="font-black text-xs text-slate-900 dark:text-slate-100 block">
                            {activeChatPeer}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {getUserCounty(activeChatPeer) || 'Kwale'} County
                          </span>
                        </div>
                      </div>

                      {/* Sentinel Active Badge & Share Tokens Button */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent('open_facilitator_tokens_modal', {
                                detail: { tab: 'share', recipient: activeChatPeer },
                              })
                            );
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold transition-colors"
                          title="Share tokens with this user"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          <span>{language === 'en' ? 'Share Tokens' : 'Gawa Tokeni'}</span>
                        </button>

                        <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2.5 py-1 rounded-full text-[10px] text-purple-800 dark:text-purple-300 font-bold">
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                          <span className="hidden sm:inline">The Operator AI Monitoring</span>
                          <span className="sm:hidden">Operator AI</span>
                        </div>
                      </div>
                    </div>

                    {/* Operator AI Constitutional Notice */}
                    <div className="bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/60 px-4 py-2 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        {language === 'en'
                          ? 'Messages are monitored in real-time. Incitement, hate speech, or election tampering leads to immediate ban and submission to The_Samaritan.'
                          : 'Jumbe zinafuatiliwa papo hapo. Uchochezi au matamshi ya chuki huleta marufuku ya mara moja na kupelekwa kwa The_Samaritan.'}
                      </span>
                    </div>

                    {/* Sentinel Ban Alert Banner if triggered */}
                    {sentinelAlert && (
                      <div className="m-3 p-3 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md animate-pulse flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                        <div>{sentinelAlert}</div>
                      </div>
                    )}

                    {/* Messages Thread */}
                    <div className="grow overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                      {directMessages.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          {language === 'en'
                            ? `Say hello to @${activeChatPeer}! Start your constitutional or devolution discussion.`
                            : `Msalimie @${activeChatPeer}! Anzisha mazungumzo ya kikatiba.`}
                        </div>
                      ) : (
                        directMessages.map((msg) => {
                          const isMine =
                            msg.senderUsername.toLowerCase().replace(/^@/, '') ===
                            myUsername.toLowerCase().replace(/^@/, '');
                          const isBlocked = msg.status === 'blocked_by_operator';

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                                  isBlocked
                                    ? 'bg-red-100 text-red-900 border-2 border-red-500 font-mono font-bold'
                                    : isMine
                                    ? 'bg-purple-900 text-white rounded-br-xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                                }`}
                              >
                                {/* Message Content */}
                                {msg.content && <div>{msg.content}</div>}
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                                <span>
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {msg.tokensUsed && msg.tokensUsed > 0 && (
                                  <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                                    <Coins className="w-2.5 h-2.5" />
                                    <span>{msg.tokensUsed} Tok</span>
                                  </span>
                                )}
                                {isBlocked && (
                                  <span className="text-red-600 font-bold">Blocked by Operator AI</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Composer */}
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                      {myBanCheck.isBanned ? (
                        <div className="p-2.5 rounded-xl bg-red-100 text-red-900 text-xs font-bold text-center">
                          {language === 'en'
                            ? 'Your account is currently restricted. You cannot send messages until reviewed by The_Samaritan.'
                            : 'Akaunti yako imesimamishwa. Huwezi kutuma ujumbe mpaka ipitiwe na The_Samaritan.'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder={
                              language === 'en'
                                ? `Message @${activeChatPeer} (Monitored by Operator AI)...`
                                : `Andika ujumbe kwa @${activeChatPeer}...`
                            }
                            className="grow px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />

                          <button
                            onClick={handleSendMessage}
                            disabled={isSendingChat || !chatInput.trim()}
                            className="flex items-center gap-1.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSendingChat ? '...' : language === 'en' ? 'Send' : 'Tuma'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3 & 4: FEED AND FOLLOWING */}
          {(activeTab === 'feed' || activeTab === 'following') && (
            <div className="space-y-3.5">
              {filteredFeed.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Radio className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                    {activeTab === 'following'
                      ? language === 'en'
                        ? "You aren't following anyone yet or they have no recent activities"
                        : 'Bado hujamfuata mwananchi yeyote au hawana matukio mapya'
                      : language === 'en'
                      ? 'No activities found matching your search'
                      : 'Hakuna matukio yaliyopatikana'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'en'
                      ? 'Switch to "Discover Citizens" to find community members in your home and neighbouring counties!'
                      : 'Fungua "Gundua Wananchi" kupata wananchi wa kaunti yako na kaunti jirani!'}
                  </p>
                </div>
              ) : (
                filteredFeed.map((act) => {
                  const isUserFollowed = isFollowing(myUsername, act.username);
                  const isSelf = myUsername === act.username;
                  const hasLiked = currentUser ? act.likedByUsernames.includes(currentUser.username) : false;

                  return (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            {getActivityIcon(act.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <UserBadge username={act.username} size="sm" currentUser={currentUser} />
                              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(act.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                              {act.title}
                            </h4>
                          </div>
                        </div>

                        {!isSelf && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleToggleFollow(act.username)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                                isUserFollowed
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {isUserFollowed ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Following</span>
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3.5 h-3.5" />
                                  <span>Follow</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleOpenChatWithUser(act.username)}
                              className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              title="Direct Message"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                        {act.details}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          onClick={() => handleLike(act.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-bold ${
                            hasLiked
                              ? 'text-red-600 bg-red-50 dark:bg-red-950/40'
                              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                          <span>{act.likesCount}</span>
                        </button>

                        <span className="text-[11px] text-slate-400 capitalize">
                          {act.type === 'question'
                            ? language === 'en' ? 'Community Inquiry' : 'Swali la Wananchi'
                            : act.type === 'certificate'
                            ? language === 'en' ? 'Verified Certificate' : 'Cheti cha Kikatiba'
                            : act.type === 'lesson'
                            ? language === 'en' ? 'Civic Lesson Drop' : 'Somo la Uraia'
                            : act.type === 'suggestion'
                            ? language === 'en' ? 'Feature Suggestion' : 'Pendekezo la Mwananchi'
                            : language === 'en' ? 'Legal Verification' : 'Uthibitisho wa Kisheria'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
