import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Shield,
  Award,
  User as UserIcon,
  X,
  MapPin,
  MessageSquare,
  Compass,
  Activity,
  BookOpen,
} from 'lucide-react';
import { getUserRoleMeta } from '../utils/adminManagement';
import {
  getUserAvatar,
  getUserCounty,
  getUserSubCounty,
  getCurrentAuthUser,
} from '../utils/authAndQuestions';
import { isUserOnline, getActiveUserSessions } from '../utils/userPresence';
import { getUserProgress } from '../utils/storage';
import { AuthUser } from '../types';
import {
  getAdminPlatformAddressingName,
  getAdminAppointedProfile,
} from '../utils/adminAppointments';

export interface UserBadgeProps {
  username?: string | null;
  showRoleLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  forceGold?: boolean;
  forceBlue?: boolean;
  hideName?: boolean;
  showAvatar?: boolean;
  disableHoverCard?: boolean;
  currentUser?: AuthUser | null;
  onNavigateToProfile?: () => void;
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  username,
  showRoleLabel = false,
  size = 'sm',
  className = '',
  forceGold = false,
  forceBlue = false,
  hideName = false,
  showAvatar = false,
  disableHoverCard = false,
  currentUser,
  onNavigateToProfile,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [, setRerenderTrigger] = useState(0);

  useEffect(() => {
    const handleAdminUpdate = () => {
      setRerenderTrigger((prev) => prev + 1);
    };
    window.addEventListener('the_samaritan_admin_names_updated', handleAdminUpdate);
    return () => {
      window.removeEventListener('the_samaritan_admin_names_updated', handleAdminUpdate);
    };
  }, []);

  if (!username) return null;

  const roleMeta = getUserRoleMeta(username);
  const badgeType = forceGold ? 'gold' : forceBlue ? 'blue' : roleMeta.badgeType;
  const isBoldGold = roleMeta.isBoldGold;
  const userAvatar = showAvatar ? getUserAvatar(username) : null;

  const cleanHandle = username ? username.trim().toLowerCase().replace(/^@/, '') : '';
  const isTargetAdmin = Boolean(
    username &&
      (roleMeta.adminLevel !== 'citizen' ||
        cleanHandle.startsWith('admin') ||
        cleanHandle.includes('kfe') ||
        cleanHandle === 'the_samaritan')
  );

  const displayHandle =
    isTargetAdmin
      ? getAdminPlatformAddressingName(username)
      : username;

  const adminProfile = isTargetAdmin ? getAdminAppointedProfile(username) : null;

  // Determine if this badge belongs to the current logged-in user
  const loggedInUser = currentUser !== undefined ? currentUser : getCurrentAuthUser();
  const isSelf = Boolean(
    loggedInUser?.username &&
      username &&
      loggedInUser.username.trim().toLowerCase().replace(/^@/, '') ===
        username.trim().toLowerCase().replace(/^@/, '')
  );

  // Sizes for the verified icon
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const avatarSizes = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  };

  const textSizes = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleOpenProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disableHoverCard) return;

    if (isSelf) {
      // By clicking on his/her username, the user must be automatically taken to their profile page.
      if (onNavigateToProfile) {
        onNavigateToProfile();
      }
      window.dispatchEvent(new CustomEvent('navigate_to_profile_tab'));
    } else {
      // If a user clicks on another user's username then a summary of user details must appear.
      setIsProfileOpen(true);
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsProfileOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileOpen]);

  // Derived user details for grounded profile page
  const online = isUserOnline(username);
  const userCounty = getUserCounty(username);
  const userSubCounty = getUserSubCounty(username);
  const userProgress = getUserProgress(username);
  const presenceSessions = getActiveUserSessions().sessions;
  const activeSession = presenceSessions.find(
    (s) => s.username.toLowerCase().replace(/^@/, '') === username.toLowerCase().replace(/^@/, '')
  );

  const highestScore = Object.values(userProgress.quizScores || {}).reduce(
    (max: number, item: { score: number }) => (item && item.score > max ? item.score : max),
    0
  );

  return (
    <>
      <span
        onClick={handleOpenProfile}
        className={`inline-flex items-center gap-1.5 align-middle ${
          !disableHoverCard ? 'cursor-pointer hover:opacity-90' : ''
        } ${className}`}
        title={
          !disableHoverCard
            ? isSelf
              ? 'Click to open your Profile page'
              : `Click to view details summary for ${username}`
            : undefined
        }
      >
        {/* Profile Picture / Avatar */}
        {showAvatar && (
          <span
            className={`${avatarSizes[size]} rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 shadow-2xs`}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{username.replace('@', '').slice(0, 1).toUpperCase()}</span>
            )}
          </span>
        )}

        {/* Username with styling */}
        {!hideName && (
          <span
            className={`tracking-tight ${textSizes[size]} ${
              isBoldGold
                ? 'font-extrabold text-amber-500 dark:text-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.25)]'
                : badgeType === 'blue'
                ? 'font-semibold text-blue-700 dark:text-blue-300'
                : 'font-semibold text-slate-800 dark:text-slate-200'
            }`}
          >
            {displayHandle}
          </span>
        )}

        {/* Badges */}
        {badgeType === 'gold_double_tick' && (
          <span
            title={`${username} • Verified Executive Super Badge (Gold with Double Ticks)`}
            className="inline-flex items-center text-amber-500 hover:text-amber-600 transition-transform hover:scale-110"
          >
            <span className="relative inline-flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className={`${iconSizes[size]} text-amber-500 fill-amber-500 drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]`}
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4z" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="absolute inset-0 w-full h-full text-slate-950 stroke-slate-950 fill-none stroke-[2.8]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="5.5 12.5 8.5 15.5 14 9.5" />
                <polyline points="10 12.5 13 15.5 18.5 9.5" />
              </svg>
            </span>
          </span>
        )}

        {(badgeType === 'gold_bold' || badgeType === 'gold') && (
          <span
            title={`${username} • Verified Civic Administrator (Gold Badge)`}
            className="inline-flex items-center text-amber-500 hover:text-amber-600 transition-colors"
          >
            <CheckCircle2
              className={`${iconSizes[size]} text-amber-500 fill-amber-100 dark:fill-amber-950/80 stroke-[2.5]`}
            />
          </span>
        )}

        {badgeType === 'blue' && (
          <span
            title={`${username} • Verified Temporary Civic Administrator (Blue Badge)`}
            className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
          >
            <CheckCircle2
              className={`${iconSizes[size]} text-blue-600 fill-blue-100 dark:fill-blue-950/80 stroke-[2.5]`}
            />
          </span>
        )}

        {/* Role Pill */}
        {showRoleLabel && roleMeta.adminLevel !== 'citizen' && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isBoldGold
                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                : badgeType === 'gold'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
            }`}
          >
            {isBoldGold ? <Award className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
            <span>{roleMeta.roleTitle.en}</span>
          </span>
        )}
      </span>

      {/* Grounded Profile Page Modal for Easy Navigation (Replaces Floating Hover Page) */}
      {isProfileOpen && !disableHoverCard && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Civic Profile: ${username}`}
        >
          {/* Grounded Page Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
          >
            {/* Header with Close X at Top Right Corner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />
              <div className="flex items-center gap-2.5 min-w-0 pt-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                    Citizen Details Summary
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {username}
                  </p>
                </div>
              </div>

              {/* Close X at Top Right Corner */}
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-1"
                title="Close summary"
                aria-label="Close summary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grounded Scrollable Page Body for Easy Navigation */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-left flex-1">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="relative shrink-0">
                  <span className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500 bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {userAvatar ? (
                      <img src={userAvatar} alt={username} className="w-full h-full object-cover" />
                    ) : (
                      <span>{username.replace('@', '').slice(0, 2).toUpperCase()}</span>
                    )}
                  </span>
                  {online && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-2xs"
                      title="Active Online"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                    <span>{displayHandle}</span>
                    {badgeType === 'gold_double_tick' && (
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                  {isTargetAdmin && adminProfile && (
                    <div className="text-xs text-amber-800 dark:text-amber-300 font-bold truncate">
                      {adminProfile.appointedName} • {adminProfile.officialPosition}
                    </div>
                  )}
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 truncate">
                    {roleMeta.roleTitle.en}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {isTargetAdmin ? 'Official Devolution Administrator' : 'Constitutional Education Citizen'}
                  </div>
                </div>
              </div>

              {/* Location & Status Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold truncate">
                    {userSubCounty ? `${userSubCounty}, ` : ''}{userCounty}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  {online ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Active Online Now
                      </span>
                      {activeSession?.currentAction && (
                        <span className="text-slate-500 dark:text-slate-400 truncate">
                          • {activeSession.currentAction}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span className="text-slate-500 dark:text-slate-400">
                        Offline • Registered Civic Learner
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Executive Devolution Allocation Info Card */}
              {isTargetAdmin && adminProfile && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Executive Administrative Appointment</span>
                  </div>
                  <div className="text-[11px] text-amber-900/90 dark:text-amber-300 space-y-1 pt-1 border-t border-amber-200/70 dark:border-amber-800/60">
                    <div>
                      <strong>Platform Address:</strong> {getAdminPlatformAddressingName(username)}
                    </div>
                    <div>
                      <strong>Appointed Full Name:</strong> {adminProfile.appointedName}
                    </div>
                    <div>
                      <strong>Official Position:</strong> {adminProfile.officialPosition}
                    </div>
                    <div>
                      <strong>Devolution Oversight:</strong> {adminProfile.assignedScope}
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 pt-1">
                      Designated under The_Samaritan Super Authority
                    </div>
                  </div>
                </div>
              )}

              {/* Civic Progress Statistics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold uppercase tracking-wider">
                    Completed Lessons
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {userProgress.completedLessons.length}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold uppercase tracking-wider">
                    High Exam Score
                  </span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {highestScore > 0 ? `${highestScore}/10` : '—'}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Easy Navigation */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsProfileOpen(false);
                    window.dispatchEvent(
                      new CustomEvent('open_direct_chat_with_peer', { detail: { peer: username } })
                    );
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsProfileOpen(false);
                    window.dispatchEvent(new CustomEvent('open_community_feed'));
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Baraza Feed</span>
                </button>
              </div>
            </div>

            {/* Close Button at the Bottom of the Page */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <X className="w-4 h-4" />
                <span>Close Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
