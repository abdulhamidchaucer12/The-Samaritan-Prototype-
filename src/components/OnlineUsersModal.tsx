import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  X,
  Search,
  MapPin,
  MessageSquare,
  Shield,
  Activity,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Compass,
  Monitor,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import {
  getActiveUserSessions,
  ActiveUserSession,
  subscribeToUserPresence,
} from '../utils/userPresence';
import { UserBadge } from './UserBadge';
import { getUserCounty, getUserSubCounty } from '../utils/authAndQuestions';

interface OnlineUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  language: Language;
  onOpenDirectChat?: (username: string) => void;
  onOpenCommunityFeed?: () => void;
}

export const OnlineUsersModal: React.FC<OnlineUsersModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onOpenDirectChat,
  onOpenCommunityFeed,
}) => {
  const [presenceData, setPresenceData] = useState(() => getActiveUserSessions());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'admins' | 'citizens' | 'local'>('all');

  useEffect(() => {
    if (!isOpen) return;
    setPresenceData(getActiveUserSessions());
    const unsub = subscribeToUserPresence(() => {
      setPresenceData(getActiveUserSessions());
    });
    return () => unsub();
  }, [isOpen]);

  const myUsername = (currentUser?.username || '').toLowerCase().replace(/^@/, '');
  const myCounty = currentUser?.county || (currentUser ? getUserCounty(currentUser.username) : '');

  // Extract online sessions
  const onlineSessions = useMemo(() => {
    return presenceData.sessions.filter((s) => s.isOnline);
  }, [presenceData]);

  // Filtered list
  const filteredUsers = useMemo(() => {
    return onlineSessions.filter((session) => {
      const uname = session.username.toLowerCase();
      const county = (session.county || '').toLowerCase();
      const subCounty = (session.subCounty || '').toLowerCase();
      const action = (session.currentAction || '').toLowerCase();
      const section = (session.currentSection || '').toLowerCase();

      // Tab filter
      if (filterTab === 'admins' && session.role !== 'admin') return false;
      if (filterTab === 'citizens' && session.role === 'admin') return false;
      if (filterTab === 'local') {
        if (!myCounty) return true;
        if (!county.includes(myCounty.toLowerCase())) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          uname.includes(query) ||
          county.includes(query) ||
          subCounty.includes(query) ||
          action.includes(query) ||
          section.includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [onlineSessions, filterTab, searchQuery, myCounty]);

  const adminCount = onlineSessions.filter((s) => s.role === 'admin').length;
  const citizenCount = onlineSessions.filter((s) => s.role !== 'admin').length;
  const localCount = myCounty
    ? onlineSessions.filter((s) => (s.county || '').toLowerCase().includes(myCounty.toLowerCase()))
        .length
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Ribbon */}
        <div className="kenya-ribbon" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-blue-50/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 font-serif">
                  {language === 'en' ? 'Citizens & Administrators Online' : 'Wananchi na Wasimamizi Walio Mtandaoni'}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {onlineSessions.length} {language === 'en' ? 'Active Now' : 'Wako Mtandaoni'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {language === 'en'
                  ? 'Real-time peer presence and on-duty civic facilitators across The Republic of Kenya (All 47 Counties)'
                  : 'Muonekano wa moja kwa moja wa wananchi na wasimamizi wa kiraia kote katika Jamhuri ya Kenya (Kaunti zote 47)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={language === 'en' ? 'Close' : 'Funga'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Logged In Highlight Banner */}
        {currentUser ? (
          <div className="px-4 py-2.5 bg-emerald-500/10 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2 truncate">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold truncate">
                {language === 'en' ? 'Logged in as:' : 'Umeingia kama:'}
              </span>
              <span className="font-mono font-bold">{currentUser.username}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-300 truncate">
                {currentUser.county || getUserCounty(currentUser.username)}
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              {language === 'en' ? 'Visible to other peers' : 'Unaonekana kwa wengine'}
            </span>
          </div>
        ) : (
          <div className="px-4 py-2 bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <span>
              {language === 'en'
                ? 'Browsing as Guest. Log in to connect with peers and access encrypted direct messaging.'
                : 'Unavinjari kama Mgeni. Ingia ili kuungana na wengine na kutumia ujumbe salama.'}
            </span>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search by handle, county, sub-county, or live action...'
                    : 'Tafuta kwa jina la mtumiaji, kaunti, au shughuli...'
                }
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'en' ? `All (${onlineSessions.length})` : `Wote (${onlineSessions.length})`}
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('admins')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  filterTab === 'admins'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>{language === 'en' ? `Admins (${adminCount})` : `Wasimamizi (${adminCount})`}</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('citizens')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterTab === 'citizens'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'en' ? `Citizens (${citizenCount})` : `Wananchi (${citizenCount})`}
              </button>
              {myCounty && (
                <button
                  type="button"
                  onClick={() => setFilterTab('local')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    filterTab === 'local'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{myCounty} ({localCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {language === 'en' ? 'No online users match your filter' : 'Hakuna watumiaji walio mtandaoni wanaolingana na kichujio chako'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'Try selecting "All" or clearing the search query to see active citizens and administrators.'
                  : 'Jaribu kuchagua "Wote" au futa utafutaji ili kuona wananchi na wasimamizi walio hewani.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterTab('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 transition-colors"
              >
                {language === 'en' ? 'Reset Filters' : 'Weka Upya Vichujio'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredUsers.map((user) => {
                const isMe = user.username.toLowerCase().replace(/^@/, '') === myUsername;
                const county = user.county || getUserCounty(user.username);
                const subCounty = user.subCounty || getUserSubCounty(user.username);
                const isDeviceMobile = user.deviceType === 'mobile';

                return (
                  <div
                    key={user.id}
                    className={`p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between gap-3 ${
                      isMe
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-xs'
                        : user.role === 'admin'
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 hover:border-amber-400'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-2xs'
                    }`}
                  >
                    {/* Top Row: User Avatar, Handle, Badges & Online Indicator */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <UserBadge username={user.username} size="md" showAvatar hideName currentUser={currentUser} />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-xs"
                            title="Active Online"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <UserBadge username={user.username} size="sm" currentUser={currentUser} />

                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded-md text-[10px] font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                                {language === 'en' ? 'YOU' : 'WEWE'}
                              </span>
                            )}

                            {user.role === 'admin' ? (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-0.5">
                                <Shield className="w-2.5 h-2.5 text-amber-700 dark:text-amber-300" />
                                <span>{user.adminLevel === 'super' ? 'Super Admin' : 'Civic Admin'}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                {language === 'en' ? 'Citizen' : 'Mwananchi'}
                              </span>
                            )}
                          </div>

                          {/* County & Location */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              {subCounty ? `${subCounty}, ` : ''}{county}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Device badge */}
                      <div
                        className="p-1 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 shrink-0"
                        title={isDeviceMobile ? 'Active on Mobile' : 'Active on Desktop'}
                      >
                        {isDeviceMobile ? (
                          <Smartphone className="w-3.5 h-3.5" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {/* Middle: Live Activity Detail */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {user.currentAction || `Engaged with ${user.currentSection}`}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span>{user.currentSection}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {language === 'en' ? 'Active now' : 'Yuko hewani'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {!isMe && onOpenDirectChat && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenDirectChat(user.username);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Message' : 'Tuma Ujumbe'}</span>
                        </button>
                      )}

                      {onOpenCommunityFeed && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenCommunityFeed();
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Compass className="w-3 h-3 text-slate-500" />
                          <span>{language === 'en' ? 'Network' : 'Mtandao'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>
              {language === 'en'
                ? 'Presence updates in real-time across all counties'
                : 'Taarifa za mtandaoni zinasasishwa papo hapo kote nchini'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenCommunityFeed && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCommunityFeed();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'en' ? 'Full Community Feed & Directory' : 'Orodha Kamili na Baraza'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Done' : 'Nimemaliza'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
