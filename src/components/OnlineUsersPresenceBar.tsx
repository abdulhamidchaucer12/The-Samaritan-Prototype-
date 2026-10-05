import React, { useState, useEffect } from 'react';
import { Users, Wifi, ChevronRight, X, Compass, MapPin } from 'lucide-react';
import { Language, AuthUser } from '../types';
import { getActiveUserSessions, ActiveUserSession, subscribeToUserPresence } from '../utils/userPresence';
import { UserBadge } from './UserBadge';
import { getUserCounty } from '../utils/authAndQuestions';

interface OnlineUsersPresenceBarProps {
  currentUser: AuthUser | null;
  language: Language;
  onOpenCommunityFeed?: () => void;
  onOpenOnlineModal?: () => void;
  className?: string;
}

export const OnlineUsersPresenceBar: React.FC<OnlineUsersPresenceBarProps> = ({
  currentUser,
  language,
  onOpenCommunityFeed,
  onOpenOnlineModal,
  className = '',
}) => {
  const [sessionsData, setSessionsData] = useState(() => getActiveUserSessions());
  const [expanded, setExpanded] = useState(false);
  const [avatarStackHoverOpen, setAvatarStackHoverOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToUserPresence(() => {
      setSessionsData(getActiveUserSessions());
    });
    return () => unsub();
  }, []);

  const myUsername = (currentUser?.username || '').toLowerCase().replace(/^@/, '');
  const onlineSessions = sessionsData.sessions.filter((s) => s.isOnline);
  // Exclude current user from "other online users", but if none other, show helpful note
  const otherOnlineUsers = onlineSessions.filter(
    (s) => s.username.toLowerCase().replace(/^@/, '') !== myUsername
  );

  // If user is not logged in, they can still see all online users
  const displayUsers = currentUser ? otherOnlineUsers : onlineSessions;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        displayUsers.length > 0
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60 shadow-xs'
          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      } ${className}`}
    >
      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left Section: Live Online Counter & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h4
                className={`font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5 ${
                  onOpenOnlineModal ? 'cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400' : ''
                }`}
                onClick={onOpenOnlineModal}
              >
                <span>
                  {language === 'en' ? 'Citizens Online Right Now' : 'Wananchi Walio Mtandaoni Sasa'}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                  {onlineSessions.length} {language === 'en' ? 'Active' : 'Hai'}
                </span>
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {currentUser
                ? displayUsers.length > 0
                  ? language === 'en'
                    ? `You are connected with ${displayUsers.length} other citizen${displayUsers.length > 1 ? 's' : ''} across Kenya`
                    : `Umeunganishwa na mwananchi ${displayUsers.length} mwingine kote nchini`
                  : language === 'en'
                  ? 'You are active online! Other citizens logging in will appear here in real time.'
                  : 'Uko mtandaoni! Wananchi wengine watakapoingia wataonekana hapa papo hapo.'
                : language === 'en'
                ? 'Live citizens learning constitution modules across all 47 counties'
                : 'Wananchi wanaosoma masomo ya katiba kote katika kaunti 47'}
            </p>
          </div>
        </div>

        {/* Right Section: Avatars preview & Expand / Directory Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {displayUsers.length > 0 && (
            <div className="relative">
              <div
                className="flex items-center -space-x-2 overflow-hidden py-1 px-1 cursor-pointer"
                onMouseEnter={() => setAvatarStackHoverOpen(true)}
                onClick={() => setAvatarStackHoverOpen(!avatarStackHoverOpen)}
                title={language === 'en' ? 'Click or hover to inspect online users' : 'Tazama wananchi walio mtandaoni'}
              >
                {displayUsers.slice(0, 4).map((u) => (
                  <div
                    key={u.id}
                    className="inline-block ring-2 ring-white dark:ring-slate-900 rounded-full"
                    title={`${u.username} • ${u.county}`}
                  >
                    <UserBadge username={u.username} size="sm" showAvatar />
                  </div>
                ))}
                {displayUsers.length > 4 && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    +{displayUsers.length - 4}
                  </div>
                )}
              </div>

              {/* Username Hover Container: Scrollable with Close Function */}
              {avatarStackHoverOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-3 space-y-2 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setAvatarStackHoverOpen(false)}
                >
                  {/* Container Header with Close Button */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{language === 'en' ? 'Online Users' : 'Walio Mtandaoni'}</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                        {displayUsers.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAvatarStackHoverOpen(false);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={language === 'en' ? 'Close' : 'Funga'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scrollable List Container */}
                  <div className="max-h-56 sm:max-h-64 overflow-y-auto space-y-2 pr-1">
                    {displayUsers.map((u) => {
                      const county = u.county || getUserCounty(u.username);
                      return (
                        <div
                          key={u.id}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative shrink-0">
                              <UserBadge username={u.username} size="xs" showAvatar />
                              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs truncate">{u.username}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                                <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{county}</span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                            Online
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer button */}
                  {onOpenOnlineModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarStackHoverOpen(false);
                        onOpenOnlineModal();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Users className="w-3 h-3" />
                      <span>{language === 'en' ? 'Open Full Directory' : 'Fungua Orodha Kamili'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenOnlineModal && (
              <button
                type="button"
                onClick={onOpenOnlineModal}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                title={language === 'en' ? 'Open full online users directory' : 'Fungua orodha ya walio mtandaoni'}
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Who\'s Online' : 'Walio Mtandaoni'}</span>
              </button>
            )}

            {displayUsers.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{expanded ? (language === 'en' ? 'Hide' : 'Ficha') : (language === 'en' ? 'Quick View' : 'Tazama')}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
              </button>
            )}

            {onOpenCommunityFeed && (
              <button
                type="button"
                onClick={onOpenCommunityFeed}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Network' : 'Mtandao'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Live User Cards */}
      {expanded && displayUsers.length > 0 && (
        <div className="p-3.5 sm:p-4 pt-0 border-t border-emerald-100 dark:border-emerald-900/60 mt-1">
          {/* Header with Title and Close button */}
          <div className="flex items-center justify-between pt-3 pb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {language === 'en' ? 'Active Online Citizens & Facilitators' : 'Wananchi na Wasimamizi Walio Mtandaoni'}
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                {displayUsers.length}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title={language === 'en' ? 'Close expanded users container' : 'Funga orodha ya watumiaji'}
            >
              <span>{language === 'en' ? 'Close' : 'Funga'}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="max-h-60 sm:max-h-72 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pb-1">
              {displayUsers.map((u) => {
                const county = u.county || getUserCounty(u.username);
                return (
                  <div
                    key={u.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <UserBadge username={u.username} size="sm" showAvatar />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {u.username}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{county}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                      Online
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
